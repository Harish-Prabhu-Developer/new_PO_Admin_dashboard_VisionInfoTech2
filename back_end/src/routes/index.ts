// src/routes/index.ts
import { Router } from 'express';
import HeaderRoute from './PO.Header.Route';
import Detail1Route from './PO.Detail1.Route';
import AddCostDetail2Route from './PO.AddCostDetail2.Route';
import ConversationDetail3Route from './PO.ConversationDetail3.Route';
import FilesUploadDetail4Route from './PO.FilesUploadDetail4.Route';
import DashboardRoute from './PO.Dashboard.Route';
import authRoute from './authRoute';

const Route = Router();

Route.use("/PO/Header", HeaderRoute);
Route.use("/PO/Detail1", Detail1Route);
Route.use("/PO/AddCostDetail2", AddCostDetail2Route);
Route.use("/PO/ConversationDetail3", ConversationDetail3Route);
Route.use("/PO/FilesUploadDetail4", FilesUploadDetail4Route);
Route.use("/PO/Dashboard", DashboardRoute);
Route.use("/auth", authRoute);

export default Route;
