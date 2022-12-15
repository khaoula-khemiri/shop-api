const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const { userValidator, validate } = require("../middlewares/validators");

//REGISTER
router.post("/register", userValidator, validate, async (req, res) => {
    const username = req.body.username
    const existe = await User.findOne({ username });
    if (existe) {
        return res.status(400).json("user with this username already existe");
    }
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(),
        img: req.body.img
    });


    try {
        const savedUser = await newUser.save();
        const { password, ...others } = savedUser._doc;
        res.status(200).json({ ...others });//don't send password
    } catch (err) {
        res.status(500).json(err);
    }

});

//LOGIN
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        !user && res.status(401)

        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);
        const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

        OriginalPassword !== req.body.password && res.status(401)

        const accessToken = jwt.sign({
            id: user.id,
            isAdmin: user.isAdmin
        }, process.env.JWT_SEC,
            { expiresIn: "3d" });

        const { password, ...others } = user._doc;//don't send password
        res.status(200).json({ ...others, accessToken });
    } catch (err) {
        res.status(500).json(err);
    }
});
module.exports = router;