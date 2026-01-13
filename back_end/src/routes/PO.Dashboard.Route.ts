import express from "express";
import { getPODashboard, getApprovalDetails } from "../controllers/PO.Dashboard.Controller";


import { authMiddleware } from "../Middleware/authMiddleware";

const DashboardRoute = express.Router();

DashboardRoute.get("/", authMiddleware, getPODashboard);
DashboardRoute.get("/approval-details/:sno", authMiddleware, getApprovalDetails);
    
export default DashboardRoute;
