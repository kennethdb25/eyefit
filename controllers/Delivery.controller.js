const DeliverModel = require("../models/DeliverModel");

const GetAllDeliveryPerCompany = async (req, res) => {
  try {
    const company = req.query.company || "";

    const allOrder = await DeliverModel.find({ company }).populate({
      path: "order",
      model: "OrderInfo",
      populate: [
        { path: "user", model: "User" }, // populate user details
        { path: "products.product", model: "ProductInfo" }, // populate each product in products array
      ],
    });
    return res.status(200).json({ status: 200, body: allOrder });
  } catch (error) {
    console.log(error);
    return res.status(404).json(error);
  }
};

module.exports = { GetAllDeliveryPerCompany };
