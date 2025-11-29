import { PrismaClient } from "@prisma/client";
import { logAdminAction } from "../utils/adminLogger.js";

const prisma = new PrismaClient();



// Get all categories
export const getAllCategories = async (req, res) => {
  try {
    // 1. Fetch all categories
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });

    // 2. Manually count portfolio items for each category
    // (Since Prisma relation is missing in schema, we can't use include: { _count })
    const categoriesWithCounts = await Promise.all(
      categories.map(async (cat) => {
        const count = await prisma.portfolioItem.count({
          where: { category_id: cat.id },
        });
        return {
          ...cat,
          _count: { portfolioItems: count },
        };
      })
    );

    res.json(categoriesWithCounts);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Create a new category
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const existingCategory = await prisma.category.findUnique({
      where: { name },
    });

    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const newCategory = await prisma.category.create({
      data: { name },
    });

    // Log action
    await logAdminAction(
      req.admin.username,
      "CREATE",
      "Category",
      newCategory.id,
      { before: null, after: newCategory }
    );

    res.status(201).json(newCategory);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update a category
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const category = await prisma.category.findUnique({
      where: { id: Number(id) },
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const updatedCategory = await prisma.category.update({
      where: { id: Number(id) },
      data: { name },
    });

    // Log action
    await logAdminAction(
      req.admin.username,
      "UPDATE",
      "Category",
      updatedCategory.id,
      { before: category, after: updatedCategory }
    );

    res.json(updatedCategory);
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id: Number(id) },
      include: {
        _count: {
          select: { portfolioItems: true },
        },
      },
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (category._count.portfolioItems > 0) {
      return res.status(400).json({
        message: `Cannot delete category with ${category._count.portfolioItems} associated items. Please reassign or delete them first.`,
      });
    }

    await prisma.category.delete({
      where: { id: Number(id) },
    });

    // Log action
    await logAdminAction(
      req.admin.username,
      "DELETE",
      "Category",
      category.id,
      { before: category, after: null }
    );

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
