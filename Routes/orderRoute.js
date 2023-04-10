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
        console.log(er)
   }
})
Router.get("/count",async (req,res)=>{
    try{
         const result = await orderModel.count({})
         res.json(result);
    }catch(er){
         console.log(0)
         res.json(0);
    }
 })
Router.post("/",async (req,res)=>{
    try{
        const newOrder = new orderModel(req.body);
        const result = await newOrder.save()
        
        for(let cart of result.DetailCart){
            let bookId = cart.Book._id;
            let oldStockObj = await productModel.findOne({_id:bookId},'QuantityStock QuantityOrder');
            console.log(oldStockObj)
            let newStock = oldStockObj.QuantityStock - cart.QuantityBuy
            let newOrder = oldStockObj.QuantityOrder + cart.QuantityBuy
            let IsOnStock = newStock > 0
            await productModel.updateOne({_id:bookId},{QuantityStock:newStock, QuantityOrder: newOrder, IsOnStock:IsOnStock})
        }
        let id = result._id.toString();
        id = id.replaceAll('"','"')
        res.json(id)
    }catch(ex){
        console.log(ex);
        res.json()
    }
})
Router.post("/update/:id",async (req,res)=>{
    try{
        let result = await orderModel.findByIdAndUpdate({_id:req.params.id},req.body)
        
        //hoàn sp đơn cũ
        for(let cart of result.DetailCart){
            let bookId = cart.Book._id;
            let oldStockObj = await productModel.findOne({_id:bookId},'QuantityStock QuantityOrder');
            let newStock = oldStockObj.QuantityStock  + cart.QuantityBuy
            let newOrder = oldStockObj.QuantityOrder - cart.QuantityBuy
            console.log(newStock)
            console.log(newOrder)
            let IsOnStock = newStock > 0
            await productModel.updateOne({_id:bookId},{QuantityStock:newStock, QuantityOrder: newOrder, IsOnStock:IsOnStock})
         }

        //Trừ sản phẩm đơn mới
        let afterCart = req.body.DetailCart
        for(let cart of afterCart){
            let bookId = cart.Book._id
            let oldStockObj = await productModel.findOne({_id:bookId},'QuantityStock QuantityOrder');
            let rollBackStock = oldStockObj.QuantityStock - cart.QuantityBuy
            let rollBackOrder= oldStockObj.QuantityOrder + cart.QuantityBuy
            console.log(rollBackStock)
            console.log(rollBackOrder)
            let IsOnStock = rollBackStock > 0
            await productModel.updateOne({_id:bookId},{QuantityStock:rollBackStock, QuantityOrder: rollBackOrder, IsOnStock:IsOnStock})
        }
        res.json(result)
    }catch(ex){
        console.log(ex);
        res.json()
    }
})
Router.get("/delete/:id",async (req,res)=>{
    try{
        const id = req.params.id
         const result = await orderModel.deleteOne({_id:id})
         console.log(result)
         res.json(result);
    }catch(er){
         console.log(er)
         res.json();
    }
 })
export default Router;

