import orderModel from "../model/orderModel.js";
import productModel from "../model/productModel.js"
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
        const newOrder = new orderModel(req.body);
        const result = await newOrder.save()
        
        for(let cart of result.DetailCart){
            let bookId = cart.Book._id;
            let oldStockObj = await productModel.findOne({_id:bookId},'QuantityStock');
            let newStock = oldStockObj.QuantityStock - cart.QuantityBuy
            let IsOnStock = newStock > 0
            await productModel.updateOne({_id:bookId},{QuantityStock:newStock, QuantityOrder: cart.QuantityBuy, IsOnStock:IsOnStock})
        }
        res.json(result._id.toString())
    }catch(ex){
        console.log(ex);
        res.json()
    }
})

export default Router;

