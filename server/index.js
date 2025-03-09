require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");

// Connect to the database
connectDB();

// Middlewares
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Middleware to catch URIError
app.use((err, req, res, next) => {
  if (err instanceof URIError) {
    res.status(400).send("Bad Request: Invalid URL encoding");
  } else {
    next(err);
  }
});

// Swagger configuration
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Reports API",
      version: "1.0.0",
      description: "API for managing reports with items.",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3001}`,
      },
    ],
  },
  apis: ["./routes/*.js", "./model/internal/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes for report management
const reportRoutes = require("./routes/reportRoutes");
app.use("/api/reports", reportRoutes);

// Start the server once connected to MongoDB
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  const server = http.createServer(app);
  const PORT = process.env.PORT || 3001;
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});