const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, unique: true },
        desc: { type: String, required: true },
        img: { type: String, required: true },
        categories: { type: Array },
        size: { type: Array },
        color: { type: Array },
        price: { type: Number, required: true },
        inStock: { type: Boolean, default: true },
        likes: { type: Number, default: 0 },
        review: {
            type: [{
                user: Object,
                text: String,
                createdAt: { type: Date, default: Date.now }
            }]
            , default: undefined
        }
    },
    { timestamps: true });

module.exports = mongoose.model("Product", ProductSchema);