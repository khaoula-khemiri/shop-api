const mongoose = require("mongoose")
const { stringify } = require("nodemon/lib/utils")

const userSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        img: { type: String }
    }, { timestamps: true });

module.exports = mongoose.model("User", userSchema);