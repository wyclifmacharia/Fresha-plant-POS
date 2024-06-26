// routes to handle customer requests

import { Router } from "express";
import OrderLogic from "../logic/OrderLogic.js"; 
var OrderHandler = Router();

OrderHandler.get("/create", function (req, res) {
  OrderLogic.create(req.body, function (result) {
    res.json(result);
  });
});

OrderHandler.get("/list", function (req, res) {
  OrderLogic.list(req.query, function (result) {
    res.json(result);
  });
});

OrderHandler.get("/list/:orderId", function (req, res) {
  OrderLogic.getOrder(req.params.orderId, function (result) {
    res.json(result);
  });
});
 
 

export default OrderHandler;
