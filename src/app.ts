import express from 'express';
import swaggerUi from "swagger-ui-express";
import fs from 'fs';
import path from 'path'
import { RegisterRoutes } from './routes/v1/routes';
// import loger from './middlewares/loger';

// Dynamically load swagger.json
const swaggerDocument = JSON.parse(fs.readFileSync(path.join(__dirname, 'docs/swagger.json'), 'utf8'));

// ========================
// Initialize App Express
// ========================
const app = express();


// ========================
// Global Middleware
// ========================
app.use(express.json())  // Help to get the json from request body
// app.use(loger);
// ========================
// Global API V1
// ========================
RegisterRoutes(app)

// ========================
// API Documentations
// ========================
app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ========================
// ERROR Handler
// ========================


export default app;