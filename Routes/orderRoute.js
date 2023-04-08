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
Router.get("/count",async (req,res)=>{
    try{
         const result = await orderModel.count({})
         res.json(result);
    }catch(er){
         console.log(0)
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
        // let cartBefore = req.body.DetailCart;
        // for(let cart of result.DetailCart){
        //     let bookId = cart.Book._id;
        //     let oldStockObj = await productModel.findOne({_id:bookId},'QuantityStock');

        //     let afterQuantityBuy = 0;
        //     for(let cart2 of cartBefore){
        //         console.log(cart2.Book._id)
        //         if(cart2.Book._id == bookId){
        //             beforeQuantityBuy = cart2.QuantityBuy
        //             break
        //         }  
        //     }
        //     console.log(oldStockObj.QuantityStock)
        //     console.log(beforeQuantityBuy)
        //     console.log(cart.QuantityBuy)
        //     let newStock = oldStockObj.QuantityStock + (beforeQuantityBuy - cart.QuantityBuy)
        //     let IsOnStock = newStock > 0
        //     await productModel.updateOne({_id:bookId},{QuantityStock:newStock, QuantityOrder: cart.QuantityBuy, IsOnStock:IsOnStock})
        // }
        res.json(result)
    }catch(ex){
        console.log(ex);
        res.json()
    }
})
export default Router;

