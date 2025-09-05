const express = require("express");
const path = require("path");
const cors = require("cors");
require("../config/database/db.conf");
require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json());

// const uploadRoutes = require("./routes/upload");
const AccountRouter = require("../routes/Account.routess");
const ProductRouter = require("../routes/Product.routess");
const AppointmentRouter = require("../routes/Appointment.routes");
const UserRouter = require("../routes/User.routess");
const OrderRouter = require("../routes/Order.routess");
const DeliveryRouter = require(".Account.routess");
const NotificationRouter = require("../routes/Notification.routes");
const InventoryRouter = require("../routes/Inventory.routes");

// app.use("/api", uploadRoutes);
app.use(AccountRouter);
app.use(ProductRouter);
app.use(AppointmentRouter);
app.use(UserRouter);
app.use(OrderRouter);
app.use(DeliveryRouter);
app.use(NotificationRouter);
app.use(InventoryRouter);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// end

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));

  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}
