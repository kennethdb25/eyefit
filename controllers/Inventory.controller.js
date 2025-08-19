const InventoryModel = require("../models/InventoryModel");

const GetInventoryPerCompany = async (req, res) => {
    try {
        const company = req.query.company || "";

        const allOrder = await InventoryModel.find({ company })
            .populate("user") // optional: if you also want full user data
            .populate("products.product"); // <-- this populates product details

        return res.status(200).json({ success: true, body: allOrder });
    } catch (error) {
        console.log(error);
        return res.status(404).json(error);
    }
};

module.exports = { GetInventoryPerCompany };