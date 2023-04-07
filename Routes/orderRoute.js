import orderModel from "../model/orderModel.js";
import express from 'express'

const Router = express.Router();

Router.get("/",async (req,res)=>{
   try{
        const limit = req.query.limit || 6
        const offset = req.query.offset || 0
        console.log(limit,offset)
        const result = await orderModel.find({}).skip(offset).limit(limit)
        res.json(result);
   }catch(er){
        console.log(ex)
   }
})
Router.post("/",async (req,res)=>{
    try{
        console.log(req.body.DetailCart[0].Book)
        const newOrder = new orderModel(req.body);
        const result = await newOrder.save()
        res.json(result)
    }catch(ex){
        console.log(ex);
        res.json()
    }
})

export default Router;

