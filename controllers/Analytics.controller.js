const OrderModel = require("../models/OrderModel");
const ProductModel = require("../models/ProductModel")

const SalesAnalytics = async (req, res) => {
    // Replace your try block content with this
    try {
        const { startDate, endDate, company } = req.query;

        // 🔹 Compute default start/end dates (current month)
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const start = startDate ? new Date(startDate) : firstDay;
        const end = endDate ? new Date(endDate) : lastDay;

        console.log("START DATE LOG: ", start);
        console.log("END DATE LOG: ", end);

        let match = {
            createdAt: { $gte: start, $lte: end },
            status: "Completed",
        };

        if (company) {
            match.company = company;
        }

        // 🔹 Aggregate orders by date
        const orders = await OrderModel.aggregate([
            { $match: match },
            {
                $project: {
                    date: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                    },
                    total: 1,
                    products: 1,
                },
            },
            {
                $group: {
                    _id: "$date",
                    totalSales: { $sum: "$total" },
                    totalItems: {
                        $sum: {
                            $reduce: {
                                input: "$products",
                                initialValue: 0,
                                in: { $add: ["$$value", "$$this.quantity"] },
                            },
                        },
                    },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        // 🔹 Return formatted data
        res.json(
            orders.map((o) => ({
                date: o._id,
                total: o.totalSales,
                items: o.totalItems,
            }))
        );
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch orders" });
    }

}

const TopProducts = async (req, res) => {
    try {
        const { startDate, endDate, company } = req.query;

        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const start = startDate ? new Date(startDate) : firstDay;
        const end = endDate ? new Date(endDate) : lastDay;

        const matchStage = {
            createdAt: { $gte: start, $lte: end },
            status: "Completed", // or Completed, depending on your logic
        };

        if (company) {
            matchStage.company = company;
        }

        const topProducts = await OrderModel.aggregate([
            { $match: matchStage },
            { $unwind: "$products" },
            {
                $lookup: {
                    from: "productinfos", // collection name in MongoDB
                    localField: "products.product",
                    foreignField: "_id",
                    as: "productDetails",
                },
            },
            { $unwind: "$productDetails" },
            {
                $group: {
                    _id: "$products.product",
                    name: { $first: "$productDetails.model" }, // ✅ use productName
                    totalQuantity: { $sum: "$products.quantity" },
                },
            },
            { $sort: { totalQuantity: -1 } },
            { $limit: 10 },
        ]);

        res.json(topProducts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch top products" });
    }
}

const CardAnalytics = async (req, res) => {
    try {
        const { company } = req.query;
        if (!company) {
            return res.status(400).json({ message: "Company is required" });
        }

        // Total products for this company
        const totalProducts = await ProductModel.countDocuments({ company });

        // Total completed orders (Delivered)
        const totalOrders = await OrderModel.countDocuments({ company, status: "Completed" });

        // Total unique customers
        const uniqueUsers = await OrderModel.distinct("user", { company });
        const totalCustomers = uniqueUsers.length;

        // Total cancelled orders
        const totalCancelled = await OrderModel.countDocuments({ company, status: "Cancelled" });

        res.json({
            totalProducts,
            totalOrders,
            totalCustomers,
            totalCancelled,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = {
    SalesAnalytics,
    TopProducts,
    CardAnalytics
}