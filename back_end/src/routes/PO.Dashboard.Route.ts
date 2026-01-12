import express from "express";
import { getPODashboard } from "../controllers/PO.Dashboard.Controller";


import { authMiddleware } from "../Middleware/authMiddleware";

const DashboardRoute = express.Router();
DashboardRoute.get("/", authMiddleware, getPODashboard);
    
export default DashboardRoute;
