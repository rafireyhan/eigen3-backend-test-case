const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { default: mongoose } = require("mongoose");
require("dotenv/config");
const swaggerjsdoc = require("swagger-jsdoc");
const swaggerui = require("swagger-ui-express");

//Middleware
app.use(bodyParser());

//Port
const port = process.env.port || 3001;

//Routes
const libraryRoutes = require("./routes/libraryRoutes");
app.use("/library", libraryRoutes);

//Swagger Setup
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Eigen Backend Test Case Api Doc",
      version: "1",
      description: "This is a Test Case API application made with ExpressJS abd documented with Swagger",
      contact: {
        name: "Rafi Reyhan",
        url: "https://rafireyhan.github.io/portfolio-tailwind-css/",
        email: "rafireyhanwork@gmail.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3001/",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const spacs = swaggerjsdoc(options);
app.use("/api-docs", swaggerui.serve, swaggerui.setup(spacs));

//Listen Port
app.listen(port, () => {
  console.log(`Berjalan pada port ${port}`);
});

//Mongo URL
const mongoURL = process.env.MONGO_URI || process.env.DB_CONNECTION;

//DB Connection
mongoose.connect(mongoURL);
let db = mongoose.connection;
db.on("error", console.error.bind(console, "Koneksi database gagal!!"));
db.once("open", () => {
  console.log("Database berhasil terkoneksi!");
});
