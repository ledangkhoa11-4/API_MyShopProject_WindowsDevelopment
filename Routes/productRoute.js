import productModel from "../model/productModel.js";
import express from 'express'

const Router = express.Router();

Router.get("/",async (req,res,next)=>{
    const isBrief = (req.query.brief ==='true')
    let books = null;
    if(isBrief == true){
        books = await productModel.find({}, `_id Name PurchasePrice SellingPrice Author QuantityStock QuantityOrder IsOnStock PublishedYear`).exec();
    }else{
        books = await productModel.find({}).skip(0).limit(3);
    }  
    res.json(books)
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
    const isBrief = (req.query.brief ==='true')
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
        const newProduct = new productModel(req.body)
        const result = await newProduct.save()
        res.json(result)
    }catch(ex){
        console.log(ex);
        res.json()
    }
})

export default Router;

