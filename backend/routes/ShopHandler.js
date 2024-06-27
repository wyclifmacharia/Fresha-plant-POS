import { Router } from "express";
import ShopLogic from "../logic/ShopLogic.js"; // Adjust path as per your project structure

var ShopHandler = Router();

// Route handler for creating a shop
ShopHandler.post("/create", (req, res) => {
    ShopLogic.create(req.body, (result) => {
        res.json(result);
    });
});

// Route handler for listing shops
ShopHandler.get("/list", (req, res) => {
    ShopLogic.list(req.query, (result) => {
        res.json(result);
    });
});

export default ShopHandler;
