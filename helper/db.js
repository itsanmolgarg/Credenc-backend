const mongoose = require("mongoose");
const URL = "mongodb://localhost:27017/credenc";

const connectDB = (url = URL, options = {}) => {
  return new Promise((resolve, reject) => {
    mongoose.connect(url, options, (err, res) => {
      if (err) {
        console.log("DB Connectivity error");
        reject(err.message);
      }
      if (res) {
        console.log("DB Connected Successfully!!");
        resolve(res);
      }
    });
  });
};

module.exports = connectDB;