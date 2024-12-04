const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv").config();
const colors = require("colors");
const connectDB = require("./config/connectDB");

const app = express();

connectDB();

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());


app.use("/api/v1/users", require("./routes/userRoute"));
app.use("/api/v1/transactions", require("./routes/transactionRoutes"));

const PORT = 8080 || process.env.PORT;


app.listen(PORT, () => {
  console.log(`Server running on: ${PORT}`);
});