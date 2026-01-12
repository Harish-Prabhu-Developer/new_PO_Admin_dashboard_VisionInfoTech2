// src/routes/PO.Detail1.Route.ts
import express from "express";
import { createPODetail1, deletePODetail1, getPODetail1BySno, getPODetails1, updatePODetail1 } from "../controllers/PO.Detail1.Controller";


const Detail1Route = express.Router();
Detail1Route.get('/detail1', getPODetails1);
Detail1Route.get('/:sno', getPODetail1BySno);
Detail1Route.post('/', createPODetail1);
Detail1Route.put('/:sno', updatePODetail1);
Detail1Route.delete('/:sno', deletePODetail1);
export default Detail1Route;