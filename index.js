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

console.log('Loading AccountRouter');
app.use(AccountRouter);
console.log('Loading ProductRouter');
app.use(ProductRouter);
console.log('Loading AppointmentRouter');
app.use(AppointmentRouter);
console.log('Loading UserRouter');
app.use(UserRouter);
console.log('Loading OrderRouter');
app.use(OrderRouter);
console.log('Loading DeliveryRouter');
app.use(DeliveryRouter);
console.log('Loading NotificationRouter');
app.use(NotificationRouter);
console.log('Loading InventoryRouter');
app.use(InventoryRouter);

// app.use(express.static(path.join(__dirname, 'public')));
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));