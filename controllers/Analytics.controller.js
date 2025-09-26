const OrderModel = require("../models/OrderModel");
const ProductModel = require("../models/ProductModel");

// 🔹 Utility: get start/end dates
const getDateRange = (startDate, endDate) => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return {
        start: startDate ? new Date(startDate) : firstDay,
        end: endDate ? new Date(endDate) : lastDay,
    };
};

// 🔹 Utility: build match filter
const buildMatch = ({ startDate, endDate, company }) => {
    const { start, end } = getDateRange(startDate, endDate);
    const match = { createdAt: { $gte: start, $lte: end }, status: "Completed" };
    if (company) match.company = company;
    return match;
};

const SalesAnalytics = async (req, res) => {
    try {
        const match = buildMatch(req.query);

        const orders = await OrderModel.aggregate([
            { $match: match },
            {
                $project: {
                    date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
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
};

const TopProducts = async (req, res) => {
    try {
        const match = buildMatch(req.query);

        const topProducts = await OrderModel.aggregate([
            { $match: match },
            { $unwind: "$products" },
            {
                $lookup: {
                    from: "productinfos", // ✅ matches your ProductInfo collection
                    localField: "products.product",
                    foreignField: "_id",
                    as: "productDetails",
                },
            },
            { $unwind: "$productDetails" },
            {
                $group: {
                    _id: "$products.product",
                    name: { $first: "$productDetails.model" },
                    brand: { $first: "$productDetails.brand" },
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
};

const CardAnalytics = async (req, res) => {
    try {
        const { company } = req.query;
        if (!company) {
            return res.status(400).json({ message: "Company is required" });
        }

        // 🔹 Run in parallel for speed
        const [totalProducts, totalOrders, uniqueUsers, totalCancelled] =
            await Promise.all([
                ProductModel.countDocuments({ company }),
                OrderModel.countDocuments({ company, status: "Completed" }),
                OrderModel.distinct("user", { company }),
                OrderModel.countDocuments({ company, status: "Cancelled" }),
            ]);

        res.json({
            totalProducts,
            totalOrders,
            totalCustomers: uniqueUsers.length,
            totalCancelled,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    SalesAnalytics,
    TopProducts,
    CardAnalytics,
};
