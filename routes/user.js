const User = require("../models/User");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("../middlewares/verifyToken");

const router = require("express").Router();

router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASS_SEC
        ).toString();
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id,
            {
                $set: req.body
            }, { new: true });
        const { password, ...others } = updatedUser._doc;
        console.log(updatedUser._doc);
        res.status(200).json(others);
    } catch (err) {
        res.status(500).json(err);
    }
});



//Delete


router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("user has been deleted...")
    } catch (err) {
        res.status(500).json(err)
    }
})

//Get 

router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, ...others } = user._doc;
        res.status(200).json(others);
    } catch (err) {
        res.status(500).json(err)
    }
})

//Get All Users

router.get("/", verifyTokenAndAdmin, async (req, res) => {
    const query = req.query.new;//get new user limit 5
    try {
        const users = query ? await User.find().sort({ _id: -1 }).limit(5) : await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json(err)
    }
})

// get user stats 
router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

    try {
        const data = await User.aggregate([
            { $match: { createdAt: { $gte: lastYear } } },//condition grater than last year
            {
                $project: {
                    month: { $month: "$createdAt" },//get only month
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: 1 } //total user in these month
                }
            }
        ]);
        res.status(200).json(data)
    }
    catch (err) {
        res.status(500).json(err)
    }
})


module.exports = router; 