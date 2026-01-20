import express from "express";
import { getPODashboard, getApprovalDetails, updateApprovalStatus } from "../controllers/PO.Dashboard.Controller";


import { authMiddleware } from "../Middleware/authMiddleware";

const DashboardRoute = express.Router();

DashboardRoute.get("/", authMiddleware, getPODashboard);
DashboardRoute.get("/approval-details/:sno", authMiddleware, getApprovalDetails);
DashboardRoute.post("/update-status", authMiddleware, updateApprovalStatus);

export default DashboardRoute;
