const express = require("express");
const Product = require("../models/Product");
const {
    protect,
    farmerOnly
} = require("../middleware/authMiddleware");

const router = express.Router();

/* =========================
   GET ALL PRODUCTS
   Customer + Farmer
========================= */

router.get("/", async (req, res) => {
    try {
        const products = await Product.find()
            .populate(
                "farmer",
                "name email"
            )
            .sort({
                createdAt: -1
            });

        res.status(200).json(products);

    } catch (error) {
        console.error(
            "GET PRODUCTS ERROR:",
            error
        );

        res.status(500).json({
            message:
                "Failed to fetch products",
            error: error.message
        });
    }
});


/* =========================
   GET SINGLE PRODUCT
========================= */

router.get("/:id", async (req, res) => {
    try {
        const product =
            await Product.findById(
                req.params.id
            ).populate(
                "farmer",
                "name email"
            );

        if (!product) {
            return res.status(404).json({
                message:
                    "Product not found"
            });
        }

        res.status(200).json(product);

    } catch (error) {
        console.error(
            "GET PRODUCT ERROR:",
            error
        );

        res.status(500).json({
            message:
                "Failed to fetch product",
            error: error.message
        });
    }
});


/* =========================
   ADD PRODUCT
   Farmer Only
========================= */

router.post(
    "/",
    protect,
    farmerOnly,
    async (req, res) => {
        try {
            const {
                name,
                category,
                price,
                stock,
                unit,
                image,
                description
            } = req.body;

            if (
                !name ||
                !category ||
                price === undefined ||
                stock === undefined
            ) {
                return res.status(400).json({
                    message:
                        "Name, category, price and stock are required"
                });
            }

            const product =
                await Product.create({
                    name: name.trim(),
                    category,
                    price: Number(price),
                    stock: Number(stock),
                    unit: unit || "kg",
                    image: image || "",
                    description:
                        description || "",
                    farmer: req.user._id
                });

            res.status(201).json({
                message:
                    "Product added successfully",
                product
            });

        } catch (error) {
            console.error(
                "ADD PRODUCT ERROR:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to add product",
                error: error.message
            });
        }
    }
);


/* =========================
   UPDATE PRODUCT
   Farmer Only
========================= */

router.put(
    "/:id",
    protect,
    farmerOnly,
    async (req, res) => {
        try {
            const product =
                await Product.findById(
                    req.params.id
                );

            if (!product) {
                return res.status(404).json({
                    message:
                        "Product not found"
                });
            }

            if (
                product.farmer.toString() !==
                req.user._id.toString()
            ) {
                return res.status(403).json({
                    message:
                        "You can only edit your own products"
                });
            }

            const {
                name,
                category,
                price,
                stock,
                unit,
                image,
                description
            } = req.body;

            if (name !== undefined)
                product.name = name.trim();

            if (category !== undefined)
                product.category = category;

            if (price !== undefined)
                product.price =
                    Number(price);

            if (stock !== undefined)
                product.stock =
                    Number(stock);

            if (unit !== undefined)
                product.unit = unit;

            if (image !== undefined)
                product.image = image;

            if (description !== undefined)
                product.description =
                    description;

            await product.save();

            res.status(200).json({
                message:
                    "Product updated successfully",
                product
            });

        } catch (error) {
            console.error(
                "UPDATE PRODUCT ERROR:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to update product",
                error: error.message
            });
        }
    }
);


/* =========================
   DELETE PRODUCT
   Farmer Only
========================= */

router.delete(
    "/:id",
    protect,
    farmerOnly,
    async (req, res) => {
        try {
            const product =
                await Product.findById(
                    req.params.id
                );

            if (!product) {
                return res.status(404).json({
                    message:
                        "Product not found"
                });
            }

            if (
                product.farmer.toString() !==
                req.user._id.toString()
            ) {
                return res.status(403).json({
                    message:
                        "You can only delete your own products"
                });
            }

            await Product.findByIdAndDelete(
                req.params.id
            );

            res.status(200).json({
                message:
                    "Product deleted successfully"
            });

        } catch (error) {
            console.error(
                "DELETE PRODUCT ERROR:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to delete product",
                error: error.message
            });
        }
    }
);

module.exports = router;