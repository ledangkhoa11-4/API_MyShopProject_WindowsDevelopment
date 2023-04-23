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
Router.get("/search",async (req,res)=>{
    try{
        const limit = req.query.limit || 6
        const offset = req.query.offset || 0
        const result = await orderModel.find({"PurchaseDate": {"$gte":req.query.start + "T00:00:00.000Z","$lt":req.query.end + "T23:59:59.999Z"}}).skip(offset).limit(limit)
        res.json(result);
    }catch(er){
        res.json([]);
    }
})
Router.get("/filtercount",async (req,res)=>{
    try{
        const result = await orderModel.count({"PurchaseDate": {"$gte":req.query.start + "T00:00:00.000Z","$lt":req.query.end + "T23:59:59.999Z"}})
        res.json(result);
    }catch(er){
        res.json(0);
    }
})
Router.post("/update/:id",async (req,res)=>{
    try{
        let result = await orderModel.findByIdAndUpdate({_id:req.params.id},req.body)
        
        //hoàn sp đơn cũ
        for(let cart of result.DetailCart){
            let bookId = cart.Book._id;
            let oldStockObj = await productModel.findOne({_id:bookId},'QuantityStock QuantityOrder');
            if(oldStockObj != null){
                let newStock = oldStockObj.QuantityStock  + cart.QuantityBuy
                let newOrder = oldStockObj.QuantityOrder - cart.QuantityBuy
                let IsOnStock = newStock > 0
                await productModel.updateOne({_id:bookId},{QuantityStock:newStock, QuantityOrder: newOrder, IsOnStock:IsOnStock})
            }
         }

        //Trừ sản phẩm đơn mới
        let afterCart = req.body.DetailCart
        for(let cart of afterCart){
            let bookId = cart.Book._id
            let oldStockObj = await productModel.findOne({_id:bookId},'QuantityStock QuantityOrder');
            let rollBackStock = oldStockObj.QuantityStock - cart.QuantityBuy
            let rollBackOrder= oldStockObj.QuantityOrder + cart.QuantityBuy
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
 Router.get("/count/month",async(req,res)=>{
    const currentDateTime = new Date();
    
    console.log("Current datetime:", );
    var result= await orderModel.count({
        $expr: {$eq: [{ $month: '$PurchaseDate' }, currentDateTime.getMonth()+1]}
})
    res.json(result)
    
 })
 Router.get("/count/week",async(req,res)=>{
    const currentDate = new Date("April, 17,2023");
    const currentDay = currentDate.getDay(); // 0 (Sunday) to 6 (Saturday)
    console.log(currentDay);
    const daysToSunday = currentDay ; // Number of days from current day to Sunday
    const daysToSaturday = 6 - currentDay; // Number of days from current day to Saturday


    const startOfWeek = new Date(currentDate);
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

    const endOfWeek = new Date(currentDate);
    endOfWeek.setHours(23, 59, 59, 999);
    endOfWeek.setDate(endOfWeek.getDate() + (6 - endOfWeek.getDay()));
    console.log(startOfWeek.getDate()+" "+endOfWeek.getDate());
    var result= await orderModel.count({ PurchaseDate: { $gte: startOfWeek , $lt: endOfWeek } })
    res.json(result)
    
 })
export default Router;

