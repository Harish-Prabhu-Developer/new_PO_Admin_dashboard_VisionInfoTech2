// src/routes/PO.Header.Route.ts
import express from "express";
import { createPOHeader, deletePOHeader, getPOHeaderByRefNo, getPOHeaders, updatePOHeader } from "../controllers/PO.Header.Controller";


const HeaderRoute = express.Router();
HeaderRoute.get('/', getPOHeaders);
HeaderRoute.get('/:po_ref_no', getPOHeaderByRefNo);
HeaderRoute.post('/', createPOHeader);
HeaderRoute.put('/:po_ref_no', updatePOHeader);
HeaderRoute.delete('/:po_ref_no', deletePOHeader);
export default HeaderRoute;