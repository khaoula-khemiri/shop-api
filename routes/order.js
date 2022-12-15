const Order = require("../models/Order");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("../middlewares/verifyToken");

const router = require("express").Router();

//create
router.post("/", verifyToken, async (req, res) => {
    const newOrder = new Order(req.body)
    try {
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder);
    } catch (err) {
        res.status(500).json(err)
    }
})
//update

router.put("/:id", verifyTokenAndAdmin, async (req, res) => {

    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id,
            {
                $set: req.body
            }, { new: true });
        res.status(200).json(updatedOrder);
    } catch (err) {
        res.status(500).json(err);
    }
});

//Delete

router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json("Order has been deleted...")
    } catch (err) {
        res.status(500).json(err)
    }
})

//Get 

router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const Orders = await Order.findOne({ userId: req.params.userId });

        res.status(200).json(Orders);
    } catch (err) {
        res.status(500).json(err)
    }
})

//Get All Order

router.get("/", verifyTokenAndAdmin, async (req, res) => {

    try {
        const Orders = await Order.find()
        res.status(200).json(Orders);
    } catch (err) {
        res.status(500).json(err)
    }
})

//get monthly income
// GET MONTHLY INCOME

router.get("/income", verifyTokenAndAdmin, async (req, res) => {
    const productId = req.query.pid;
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

    try {
        const income = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: previousMonth },//grater than last month
                    ...(productId && {
                        products: { $elemMatch: { productId } },
                    }),
                },
            },
            {
                $project: {
                    month: { $month: "$createdAt" },//get month 
                    sales: "$amount",
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: "$sales" },//total income in this month
                },
            },
        ]);
        res.status(200).json(income);
    } catch (err) {
        res.status(500).json(err);
    }
});


module.exports = router; 