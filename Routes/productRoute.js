import productModel from "../model/productModel.js";
import express from 'express'

const Router = express.Router();

Router.get("/",async (req,res,next)=>{
    const isBrief = (req.query.brief ==='true')
    let books = null;
    if(isBrief == true){
        books = await productModel.find({}, `_id Name PurchasePrice SellingPrice Author QuantityStock QuantityOrder IsOnStock PublishedYear`).exec();
    }else{
        books = await productModel.find({}).skip(0);
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
Router.post("/",async (req,res)=>{
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
    }catch(ex){
        console.log(ex);
        res.json("")
    }
})

export default Router;

