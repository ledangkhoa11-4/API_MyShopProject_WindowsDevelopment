import productModel from "../model/productModel.js";
import express from 'express'

const Router = express.Router();

Router.get("/",async (req,res,next)=>{
    const isBrief = (req.query.brief ==='true')
    let books = null;
    if(isBrief == true){
        books = await productModel.find({}, `_id Name PurchasePrice SellingPrice Author QuantityStock QuantityOrder IsOnStock PublishedYear`).exec();
    }else{
        books = await productModel.find({}).skip(0).limit(1);
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
    const categories = await productModel.find({});
    res.json(categories)
})

export default Router;

