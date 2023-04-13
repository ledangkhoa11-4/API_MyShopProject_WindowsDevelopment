import productModel from "../model/productModel.js";
import express from 'express'

const Router = express.Router();

Router.get("/count",async (req,res)=>{
    try{
         const result = await productModel.count({}).exec()
         res.json(result);
    }catch(er){

         console.log(er)
    }
 })
Router.get("/",async (req,res,next)=>{
    try{
        const isBrief = (req.query.brief ==='true')
        const pageIndex = req.query.pgIdx;
        const limit = req.query.limit;
        let books = null;
        if(isBrief == true){
            books = await productModel.find({}, `_id Name CatID PurchasePrice SellingPrice Author QuantityStock QuantityOrder IsOnStock PublishedYear`).exec();
        }else{
            books = await productModel.find({}, `_id Name CatID PurchasePrice SellingPrice Author QuantityStock QuantityOrder IsOnStock PublishedYear`).skip(pageIndex*limit).limit(limit);  
        } 
        res.json(books)
    }catch(er){
        console.log(er);
        res.json([])
    }
    
})
Router.get("/get/outstock",async (req,res,next)=>{
    try{
        let books = null;
        books = await productModel.find({}, `_id Name CatID PurchasePrice SellingPrice Author QuantityStock QuantityOrder IsOnStock PublishedYear`).sort({ quantity: 1 }).limit(5);
        res.json(books)
    }catch(er){
        console.log(er);
        res.json([])
    }
})
Router.get("/image/:id",async (req,res,next)=>{
    try{
        let image = await productModel.find({_id:`${req.params.id}`}, 'ImageBase64').exec()
        if(image.length > 0){
            res.json(image[0].ImageBase64)
        }else{
            res.json("")
        }
    }catch(ex){
        console.log(ex);
        res.json("")
    }
    
})
Router.get("/:id",async (req,res,next)=>{  
    const isBrief = (req.query.brief ==='True' || req.query.brief ==='true')
    if(isBrief == true){
        const book = await productModel.find({_id: req.params.id}, `_id Name PurchasePrice SellingPrice Author QuantityStock QuantityOrder IsOnStock PublishedYear`).exec();
        res.json(book[0]);
    }   else{
        const categories = await productModel.find({});
        res.json(categories)
    } 
   
})
Router.post("/",async (req,res)=>{
    try{
        const product = new productModel(req.body) 
       
        console.log(req.body)
        const result = await product.save()
        res.json(result)
    }catch(ex){
        console.log(ex);
        res.json("")
    }
})
Router.post("/edit",async (req,res)=>{
    try{
        const productId = req.query.id;
        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).send({ message: 'Product not found' });
        }
        Object.assign(product, req.body);
        const result = await product.save()
        res.json(result)
    }catch(ex){
        console.log(ex);
        res.json("")
    }
})
Router.post("/delete",async (req,res)=>{
    try{
        const productId = req.query.id;
        const deletedProduct = await productModel.findOneAndDelete({ _id: productId });
        if (!deletedProduct) {
            return res.status(404).send({ message: 'Product not found' });
        }
        res.json(deletedProduct);
    }catch(ex){
        console.log(ex);
        res.json("err")
    }
})

export default Router;

