const mongoose = require("mongoose");

async function connectToDatabase() {
  if (mongoose.connection.readyState >= 1) return;

  mongoose.connection.on("connecting", function () {
    console.log("connecting to MongoDB...");
  });

  mongoose.connection.on("error", function (error) {
    console.error("Error in MongoDb connection: " + error);
    mongoose.disconnect();
  });

  mongoose.connection.on("connected", function () {
    console.log("MongoDB connected!");
  });

  mongoose.connection.once("open", function () {
    console.log("MongoDB connection opened!");
  });

  mongoose.connection.on("reconnected", function () {
    console.log("MongoDB reconnected!");
  });

  mongoose.connection.on("disconnected", function () {
    console.log("MongoDB disconnected!");
    setTimeout(() => {
      return mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoReconnect: true,
        reconnectTries: Number.MAX_VALUE,
        reconnectInterval: 1000,
      });
    }, 3000);
  });

  return mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoReconnect: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1000,
  });
}

module.exports = connectToDatabase;
