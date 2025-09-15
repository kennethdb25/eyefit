const express = require("express");
const favicon = require('serve-favicon');
const fs = require("fs");
const path = require("path");
const cors = require("cors");
require("./config/database/db.conf");
require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

const AccountRouter = require("./routes/Account.routes");
const ProductRouter = require("./routes/Product.routes");
const AppointmentRouter = require("./routes/Appointment.routes");
const UserRouter = require("./routes/User.routes");
const OrderRouter = require("./routes/Order.routes");
const DeliveryRouter = require("./routes/Delivery.routes");
const NotificationRouter = require("./routes/Notification.routes");
const InventoryRouter = require("./routes/Inventory.routes");
const AnalyticsRouter = require("./routes/Analytics.routes");

app.use(AccountRouter);
app.use(ProductRouter);
app.use(AppointmentRouter);
app.use(UserRouter);
app.use(OrderRouter);
app.use(DeliveryRouter);
app.use(NotificationRouter);
app.use(InventoryRouter);
app.use(AnalyticsRouter);

app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));

  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));