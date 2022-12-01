const mongoose = require("mongoose");
const express = require("express");
require("dotenv").config();

const cookieParser = require("cookie-parser");
const cors = require("cors");

const auth = require("./src/middlewares/auth");
const wineController = require("./src/controllers/wine");
const usersController = require("./src/controllers/users");

const port = process.env.PORT;
const connectionString = process.env.DB_HOST;

async function start() {
  try {
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("DB Ready");
  } catch (err) {
    console.log("Error connecting to database");
    return process.exit(1);
  }

  const app = express();

  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use(express.json());
  app.use(
    cors({
      origin: ["http://localhost:4200", "https://angular-project-wine.web.app"],
      credentials: true,
    })
  );

  app.set("trust proxy", 1);

  app.use(auth());

  app.use("/data/catalog", wineController);
  app.use("/users", usersController);

  app.listen(port, () => console.log(`REST Service started on port ${port}`));
}

start();
