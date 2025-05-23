const express = require("express");
const cookieParser = require("cookie-parser");
const { connectToDatabase } = require("./utils/db");
const cors = require("cors");

const authRouter = require("./routes/auth-routes");
const billRouter = require("./routes/bill-routes");
const invoiceRouter = require("./routes/invoice-routes");

const dotenv = require("dotenv");
dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(
  cors({
    origin: ["https://nasiry-ltd.vercel.app", "http://localhost:3000"],
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/bill", billRouter);
app.use("/invoice", invoiceRouter);

app.get("/", (req, res) => {
  res.json("Hello Server");
});

connectToDatabase()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`Server is now running on http://localhost:${PORT}`)
    );
  })
  .catch((error) => {
    console.error("Failed to connect to database. Server not started.", error);
  });
