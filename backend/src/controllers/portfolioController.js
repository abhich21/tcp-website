import pkg from "@prisma/client";
import { getFileUrl, deleteFromS3 } from "../utils/s3Upload.js";

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

// ➕ Create Portfolio Item
export const createPortfolioItem = async (req, res) => {
  try {
    const { title, category_id, category_name, description, type, url } = req.body;

    // Ensure main image is present
    if (!req.files || !req.files.image || !req.files.image[0]) {
      return res.status(400).json({ message: "Main image is required" });
    }

    const mainImage = getFileUrl(req.files.image[0]);

    let details = [];

    // Handle based on type
    if (type === "youtube" || type === "vimeo") {
      details = [{ type, url }];
    } else if (type === "pdf") {
      if (!req.files.file || !req.files.file[0]) {
        return res.status(400).json({ message: "PDF file is required" });
      }
      const pdfUrl = getFileUrl(req.files.file[0]);
      details = [{ type: "pdf", url: pdfUrl }];
    } else if (type === "image") {
      if (!req.files.files || !req.files.files.length) {
        return res.status(400).json({ message: "Image files are required for type=image" });
      }
      details = req.files.files.map((f) => ({ type: "image", url: getFileUrl(f) }));
    } else {
      return res.status(400).json({ message: "Invalid or missing type" });
    }

    const newItem = await prisma.portfolioItem.create({
      data: {
        title,
        category_id: parseInt(category_id),
        category_name,
        description: description || null,
        image: mainImage,
        details,
      },
    });

    res.status(201).json({ message: "Portfolio item created successfully", data: newItem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating portfolio item", error: err.message });
  }
};

// 📄 Get All with pagination, category filter, sorting & search
export const getAllPortfolioItems = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 9;
    const skip = (page - 1) * limit;

    const categoryId = req.query.category_id ? parseInt(req.query.category_id) : null;
    const sort = req.query.sort ? req.query.sort.toLowerCase() : "latest"; // 'atoz', 'ztoa', 'latest'
    const search = req.query.search ? req.query.search.trim() : ""; 

    // 🧩 Build WHERE clause dynamically
    // MODIFIED: Initialize with soft delete filter
    let whereClause = { isDeleted: false };

    // Category filter (1 = All, skip filter)
    if (categoryId && categoryId !== 1) {
      whereClause.category_id = categoryId;
    }

    // Search filter (case-insensitive)
    if (search) {
      whereClause.title = { contains: search, mode: "insensitive" };
    }

    // Sorting logic
    let orderBy = { created_at: "desc" }; // default = latest first
    if (sort === "atoz") orderBy = { title: "asc" };
    else if (sort === "ztoa") orderBy = { title: "desc" };

    let totalItems, items;

    // 🧠 Case 1: sort=atoz/ztoa (ignore category 9 priority)
    if (sort === "atoz" || sort === "ztoa") {
      [totalItems, items] = await Promise.all([
        prisma.portfolioItem.count({ where: whereClause }),
        prisma.portfolioItem.findMany({
          where: whereClause,
          skip,
          take: limit,
          orderBy,
        }),
      ]);
    } 
    else {
      // 🧠 Case 2: Latest sorting with category priority
      if (!categoryId || categoryId === 1) {
        // Include category 9 items first, but still respect search filter if given
        // MODIFIED: Added isDeleted: false to both queries
        const whereCategory9 = { category_id: 9, isDeleted: false };
        const whereOthers = { NOT: { category_id: 9 }, isDeleted: false };

        // Add search condition to both if exists
        if (search) {
          whereCategory9.title = { contains: search, mode: "insensitive" };
          whereOthers.title = { contains: search, mode: "insensitive" };
        }

        const [category9Items, otherItems] = await Promise.all([
          prisma.portfolioItem.findMany({
            where: whereCategory9,
            orderBy: { created_at: "desc" },
          }),
          prisma.portfolioItem.findMany({
            where: whereOthers,
            orderBy: { created_at: "desc" },
          }),
        ]);

        const combined = [...category9Items, ...otherItems];
        totalItems = combined.length;

        // Manual pagination after merging
        const start = skip;
        const end = skip + limit;
        items = combined.slice(start, end);
      } 
      else {
        // Category filter (not 1) with latest sorting
        [totalItems, items] = await Promise.all([
          prisma.portfolioItem.count({ where: whereClause }),
          prisma.portfolioItem.findMany({
            where: whereClause,
            skip,
            take: limit,
            orderBy: { created_at: "desc" },
          }),
        ]);
      }
    }

    const totalPages = Math.ceil(totalItems / limit);

    res.json({
      data: items,
      pagination: {
        totalItems,
        totalPages,
        currentPage: page,
        itemsPerPage: limit,
      },
      filters: {
        sort,
        category_id: categoryId || "none",
        search: search || null,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching portfolio items" });
  }
};


// 📄 Get One by ID
export const getPortfolioItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await prisma.portfolioItem.findUnique({ where: { id: parseInt(id) } });
    
    // MODIFIED: Check if item exists AND is not deleted
    if (!item || item.isDeleted) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Error fetching item" });
  }
};

// ✏️ Update Portfolio Item
export const updatePortfolioItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category_id, category_name, description, type, url } = req.body;

    const existing = await prisma.portfolioItem.findUnique({ where: { id: parseInt(id) } });
    if (!existing) return res.status(404).json({ message: "Item not found" });

    let details = existing.details;
    let mainImage = existing.image;

    // ✅ If new main image provided
    if (req.files && req.files.image && req.files.image[0]) {
      if (mainImage) await deleteFromS3(mainImage);
      mainImage = getFileUrl(req.files.image[0]);
    }

    // ✅ Handle details replacements
    if (type === "youtube" || type === "vimeo") {
      details = [{ type, url }];
    } else if (type === "pdf" && req.files.file?.[0]) {
      if (existing.details?.[0]?.url) await deleteFromS3(existing.details[0].url);
      const pdfUrl = getFileUrl(req.files.file[0]);
      details = [{ type: "pdf", url: pdfUrl }];
    } else if (type === "image" && req.files.files?.length) {
      if (existing.details?.length) {
        for (const d of existing.details) {
          if (d.type === "image" && d.url) await deleteFromS3(d.url);
        }
      }
      details = req.files.files.map((f) => ({ type: "image", url: getFileUrl(f) }));
    }

    const updated = await prisma.portfolioItem.update({
      where: { id: parseInt(id) },
      data: {
        title: title || existing.title,
        category_id: parseInt(category_id) || existing.category_id,
        category_name: category_name || existing.category_name,
        description: description || existing.description,
        image: mainImage,
        details,
        updated_at: new Date(),
      },
    });

    res.json({ message: "Portfolio item updated successfully", data: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating portfolio item", error: err.message });
  }
};

// 🗑️ Delete Portfolio Item
export const deletePortfolioItem = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.portfolioItem.findUnique({ where: { id: parseInt(id) } });
    if (!existing) return res.status(404).json({ message: "Item not found" });

    if (existing.image) await deleteFromS3(existing.image);

    if (existing.details?.length) {
      for (const d of existing.details) {
        if (d.url) await deleteFromS3(d.url);
      }
    }

    await prisma.portfolioItem.delete({ where: { id: parseInt(id) } });
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting item" });
  }
};