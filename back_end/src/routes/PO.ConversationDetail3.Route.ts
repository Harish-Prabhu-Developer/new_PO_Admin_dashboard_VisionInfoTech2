// src/routes/PO.ConversationDetail3.Route.ts
import express from "express";
import { 
    createPOConversationDetail3, deletePOConversationDetail3, getPOConversationDetail3ById, getPOConversationDetails3, updatePOConversationDetail3
} from "../controllers/PO.ConversationDetail3.Controller";

const ConversationDetail3Route = express.Router();

ConversationDetail3Route.get("/", getPOConversationDetails3);
ConversationDetail3Route.get("/:id", getPOConversationDetail3ById);
ConversationDetail3Route.post("/", createPOConversationDetail3);
ConversationDetail3Route.put("/:id", updatePOConversationDetail3);
ConversationDetail3Route.delete("/:id", deletePOConversationDetail3);

export default ConversationDetail3Route;