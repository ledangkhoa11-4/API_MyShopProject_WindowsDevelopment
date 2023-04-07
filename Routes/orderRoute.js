import orderModel from "../model/orderModel.js";
import express from 'express'

const Router = express.Router();

Router.get("/",async (req,res)=>{
   
})
Router.post("/",async (req,res)=>{
    try{
        const newOrder = new orderModel(req.body);
        const result = await newOrder.save()
        res.json(result)
    }catch(ex){
        console.log(ex);
        res.json()
    }
})

export default Router;

