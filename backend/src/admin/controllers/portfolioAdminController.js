import { PrismaClient } from '@prisma/client';
import { getFileUrl, deleteFromS3 } from '../../utils/s3Upload.js';
import { logAdminAction } from '../utils/adminLogger.js';

const prisma = new PrismaClient();

// --- CRUD OPERATIONS ---

export const createPortfolioItemAdmin = async (req, res) => {
  try {
    const { title, description, category_id, type, url } = req.body;
    const adminUser = req.admin ? req.admin.username : 'unknown_admin';

    let coverImageUrl = '';
    if (req.files && req.files.image && req.files.image[0]) {
      coverImageUrl = getFileUrl(req, req.files.image[0]);
    } else {
      return res.status(400).json({ message: 'Cover image is required' });
    }

    let details = [];
    if (type === 'image') {
      if (req.files && req.files.files && req.files.files.length > 0) {
        details = req.files.files.map((file) => ({
          type: 'image',
          url: getFileUrl(req, file),
        }));
      }
    } else if (['pdf', 'youtube', 'vimeo'].includes(type)) {
      if (url) {
        details = [{ type, url }];
      }
    }

    let categoryName = null;
    if (category_id) {
      const category = await prisma.category.findUnique({
        where: { id: parseInt(category_id) },
      });
      if (category) {
        categoryName = category.name;
      }
    }

    const newItem = await prisma.portfolioItem.create({
      data: {
        title,
        description,
        image: coverImageUrl,
        category_id: parseInt(category_id),
        category_name: categoryName,
        details: details,
      },
    });

    await logAdminAction({
      actor: adminUser,
      action: 'CREATE',
      tableName: 'PortfolioItem',
      recordId: newItem.id,
      beforeData: null,
      afterData: newItem,
    });

    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating portfolio item:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAllPortfolioItemsAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category_id } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (category_id) {
      where.category_id = parseInt(category_id);
    }

    const [items, total] = await prisma.$transaction([
      prisma.portfolioItem.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { created_at: 'desc' },
      }),
      prisma.portfolioItem.count({ where }),
    ]);

    res.json({
      data: items,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching portfolio items:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getPortfolioItemByIdAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await prisma.portfolioItem.findUnique({
      where: { id: parseInt(id) },
    });

    if (!item) {
      return res.status(404).json({ message: 'Portfolio item not found' });
    }

    res.json(item);
  } catch (error) {
    console.error('Error fetching portfolio item:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updatePortfolioItemAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category_id, type, url, existing_files } = req.body;
    const adminUser = req.admin ? req.admin.username : 'unknown_admin';

    const existingItem = await prisma.portfolioItem.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingItem) {
      return res.status(404).json({ message: 'Portfolio item not found' });
    }

    let updatedData = {
      title,
      description,
      category_id: parseInt(category_id),
    };

    // 1. Handle Cover Image Update
    if (req.files && req.files.image && req.files.image[0]) {
      if (existingItem.image) {
        await deleteFromS3(existingItem.image);
      }
      updatedData.image = getFileUrl(req, req.files.image[0]);
    }

    // 2. Handle Category Name Update
    if (category_id && parseInt(category_id) !== existingItem.category_id) {
      const category = await prisma.category.findUnique({
        where: { id: parseInt(category_id) },
      });
      if (category) {
        updatedData.category_name = category.name;
      }
    }

    // 3. Handle Details (Gallery/Video) Update
    // Logic: Merge existing kept files with new uploaded files
    let newDetails = existingItem.details || [];
    
    if (type) {
      if (type === 'image') {
        // A. Filter existing images
        let keptUrls = [];
        try {
          keptUrls = existing_files ? JSON.parse(existing_files) : [];
        } catch (e) {
          console.error("Error parsing existing_files:", e);
        }

        // Identify images to delete (those in existing details but NOT in keptUrls)
        const imagesToDelete = existingItem.details.filter(
          d => d.type === 'image' && !keptUrls.includes(d.url)
        );

        for (const img of imagesToDelete) {
          if (img.url) await deleteFromS3(img.url);
        }

        // Keep only the ones in keptUrls
        const keptDetails = existingItem.details.filter(
          d => d.type === 'image' && keptUrls.includes(d.url)
        );

        // B. Add new uploaded images
        let newImageDetails = [];
        if (req.files && req.files.files && req.files.files.length > 0) {
          newImageDetails = req.files.files.map((file) => ({
            type: 'image',
            url: getFileUrl(req, file),
          }));
        }

        newDetails = [...keptDetails, ...newImageDetails];

      } else if (['pdf', 'youtube', 'vimeo'].includes(type)) {
        // For non-image types, we replace the details entirely
        // First, clean up old images if switching from image type
        if (Array.isArray(existingItem.details)) {
          for (const detail of existingItem.details) {
            if (detail.type === 'image' && detail.url) {
              await deleteFromS3(detail.url);
            }
          }
        }
        
        if (url) {
          newDetails = [{ type, url }];
        }
      }
      updatedData.details = newDetails;
    }

    const updatedItem = await prisma.portfolioItem.update({
      where: { id: parseInt(id) },
      data: updatedData,
    });

    await logAdminAction({
      actor: adminUser,
      action: 'UPDATE',
      tableName: 'PortfolioItem',
      recordId: updatedItem.id,
      beforeData: existingItem,
      afterData: updatedItem,
    });

    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating portfolio item:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deletePortfolioItemAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const adminUser = req.admin ? req.admin.username : 'unknown_admin';

    const existingItem = await prisma.portfolioItem.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingItem) {
      return res.status(404).json({ message: 'Portfolio item not found' });
    }

    if (existingItem.image) {
      await deleteFromS3(existingItem.image);
    }

    if (Array.isArray(existingItem.details)) {
      for (const detail of existingItem.details) {
        if (detail.type === 'image' && detail.url) {
          await deleteFromS3(detail.url);
        }
      }
    }

    await prisma.portfolioItem.delete({
      where: { id: parseInt(id) },
    });

    await logAdminAction({
      actor: adminUser,
      action: 'DELETE',
      tableName: 'PortfolioItem',
      recordId: existingItem.id,
      beforeData: existingItem,
      afterData: null,
    });

    res.json({ message: 'Portfolio item deleted successfully' });
  } catch (error) {
    console.error('Error deleting portfolio item:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// --- SOFT DELETE FUNCTIONS ---

export const archivePortfolioItemAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const adminUser = req.admin ? req.admin.username : 'unknown_admin';

    const existingItem = await prisma.portfolioItem.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingItem) {
      return res.status(404).json({ message: 'Portfolio item not found' });
    }

    // If already archived, return it as is
    if (existingItem.isDeleted === true) {
      return res.json(existingItem);
    }

    const updatedItem = await prisma.portfolioItem.update({
      where: { id: parseInt(id) },
      data: { isDeleted: true },
    });

    await logAdminAction({
      actor: adminUser,
      action: 'UPDATE',
      tableName: 'PortfolioItem',
      recordId: updatedItem.id,
      beforeData: existingItem,
      afterData: updatedItem,
    });

    res.json(updatedItem);
  } catch (error) {
    console.error('Error archiving portfolio item:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const unarchivePortfolioItemAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const adminUser = req.admin ? req.admin.username : 'unknown_admin';

    const existingItem = await prisma.portfolioItem.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingItem) {
      return res.status(404).json({ message: 'Portfolio item not found' });
    }

    // If not archived, return as is
    if (existingItem.isDeleted === false) {
      return res.json(existingItem);
    }

    const updatedItem = await prisma.portfolioItem.update({
      where: { id: parseInt(id) },
      data: { isDeleted: false },
    });

    await logAdminAction({
      actor: adminUser,
      action: 'UPDATE',
      tableName: 'PortfolioItem',
      recordId: updatedItem.id,
      beforeData: existingItem,
      afterData: updatedItem,
    });

    res.json(updatedItem);
  } catch (error) {
    console.error('Error unarchiving portfolio item:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const permanentDeletePortfolioItemAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const adminUser = req.admin ? req.admin.username : 'unknown_admin';

    const existingItem = await prisma.portfolioItem.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingItem) {
      return res.status(404).json({ message: 'Portfolio item not found' });
    }

    // 1. Safe Delete Cover Image from S3
    if (existingItem.image && existingItem.image.includes('amazonaws.com')) {
      await deleteFromS3(existingItem.image);
    }

    // 2. Safe Delete Details Images from S3
    if (Array.isArray(existingItem.details)) {
      for (const detail of existingItem.details) {
        if (detail.type === 'image' && detail.url && detail.url.includes('amazonaws.com')) {
          await deleteFromS3(detail.url);
        }
      }
    }

    // 3. Permanent Delete from DB
    await prisma.portfolioItem.delete({
      where: { id: parseInt(id) },
    });

    // 4. Audit Log
    await logAdminAction({
      actor: adminUser,
      action: 'DELETE',
      tableName: 'PortfolioItem',
      recordId: existingItem.id,
      beforeData: existingItem,
      afterData: null,
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error permanently deleting portfolio item:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};