const express = require("express");
const cors = require("cors");
const router = require("./routes");
const connectDB = require("./helper/db");
const app = express();

async function connect() {
  try {
    await connectDB();
    app.use(cors());
    app.use(express.json({ limit: "5mb" }));
    app.use(express.urlencoded({ extended: true }));

    app.use("/", router);
    const PORT = 1234;

    app.listen(PORT, () => {
      console.log(`Server is listening at port: ${PORT}`);
    });
  } catch (err) {
    console.error("Some error occurred in server", err.message);
  }
}

connect();