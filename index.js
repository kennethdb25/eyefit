const express = require("express");
const path = require("path");
const cors = require("cors");
require("./config/database/db.conf");
require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json());

const uploadRoutes = require("./routes/upload");
const UserRouter = require("./routes/User.routes");

app.use("/api", uploadRoutes);
app.use(UserRouter);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// end

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));

  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}
