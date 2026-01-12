// src/routes/PO.FilesUploadDetail4.Route.ts
import express from "express";
import { 
    createPOFilesUploadDetail4, deletePOFilesUploadDetail4, getPOFilesUploadDetail4ById, getPOFilesUploadDetails4, updatePOFilesUploadDetail4
} from "../controllers/PO.FilesUploadDetail4.Controller";

const FilesUploadDetail4Route=express.Router();

FilesUploadDetail4Route.get("/", getPOFilesUploadDetails4);
FilesUploadDetail4Route.get("/:id", getPOFilesUploadDetail4ById);
FilesUploadDetail4Route.post("/", createPOFilesUploadDetail4);
FilesUploadDetail4Route.put("/:id", updatePOFilesUploadDetail4);
FilesUploadDetail4Route.delete("/:id", deletePOFilesUploadDetail4);


export default FilesUploadDetail4Route;