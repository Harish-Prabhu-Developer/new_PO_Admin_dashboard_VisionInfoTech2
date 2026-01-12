// src/routes/PO.AddCostDetail2.Route.ts
import express from "express";
import { createPOAddCostDetail2, deletePOAddCostDetail2, getPOAddCostDetail2BySno, getPOAddCostDetails2, updatePOAddCostDetail2 } from "../controllers/PO.AddCostDetail2.Controller";

const AddCostDetail2Route = express.Router();
AddCostDetail2Route.get('/', getPOAddCostDetails2);
AddCostDetail2Route.get('/:sno', getPOAddCostDetail2BySno);
AddCostDetail2Route.post('/', createPOAddCostDetail2);
AddCostDetail2Route.put('/:sno', updatePOAddCostDetail2);
AddCostDetail2Route.delete('/:sno', deletePOAddCostDetail2);
export default AddCostDetail2Route;