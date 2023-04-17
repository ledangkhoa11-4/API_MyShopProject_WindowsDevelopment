import categoryModel from "../model/categoryModel.js";
import productModel from"../model/productModel.js";
import express from "express";

const Router=express.Router();
Router.get("/category/count", async (req,res)=>{
    var content=req.query.cats
    var pricestart=parseInt( req.query.pricestart)
    var priceend=parseInt(req.query.priceend)
    try{
        const mycontent=content.split(",")
        mycontent.pop()
    var catIDList=[]
    for(var i=0;i<mycontent.length;i++){
        var CatName = new RegExp(`^${mycontent[i].trim()}`);
        var catID = await categoryModel.findOne({ Name: CatName });
        if (catID) {
          catIDList.push(catID._id);
        }
    }
    
    console.log(priceend+" "+pricestart)
    console.log(catIDList)
    if(catIDList.length>0 && priceend!=pricestart){
        var bookjson=await productModel.count({ CatID: { $in: catIDList }, PurchasePrice: { $gte: pricestart, $lte: priceend } }).exec()
        console.log("cc0");
        console.log(bookjson);
        res.json(bookjson)
    }
    else if(catIDList.length>0 && priceend===pricestart){
        var bookjson=await productModel.count({ CatID: { $in: catIDList } }).exec()
        console.log("cc1");
        console.log(bookjson);
        res.json(bookjson)
    }
    else {
        var bookjson=await productModel.count({ PurchasePrice: { $gte: pricestart, $lte: priceend } }).exec()
        console.log("cc2");
        console.log(bookjson);
        res.json(bookjson)
    }
    
}
    catch(error){
        console.log(error);
    }
})
Router.get("/category", async (req,res)=>{
    var content=req.query.cats
    var pricestart=parseInt( req.query.pricestart)
    var priceend=parseInt(req.query.priceend)
    var pageIndex=parseInt(req.query.pageIndex)
    var limit=parseInt(req.query.limit)
    try{
        const mycontent=content.split(",")
        mycontent.pop()
    var catIDList=[]
    for(var i=0;i<mycontent.length;i++){
        var CatName = new RegExp(`^${mycontent[i].trim()}`);
        var catID = await categoryModel.findOne({ Name: CatName });
        if (catID) {
          catIDList.push(catID._id);
        }
    }
    
    console.log(priceend+" "+pricestart)
    console.log(catIDList)
    if(catIDList.length>0 && priceend!=pricestart){
        
        var bookjson=await productModel.find({ CatID: { $in: catIDList }, PurchasePrice: { $gte: pricestart, $lte: priceend } }).exec()
        console.log("cc1");
        res.json(bookjson)
    }
    else if(catIDList.length>0 && priceend===pricestart){
        var bookjson=await productModel.find({ CatID: { $in: catIDList } }).skip(pageIndex*limit).limit(limit)
        console.log("cc2");
        res.json(bookjson)
    }
    else {
        var bookjson=await productModel.find({ PurchasePrice: { $gte: pricestart, $lte: priceend } }).exec()
        console.log("cc3");
        res.json(bookjson)
    }
    
}
    catch(error){
        console.log(error);
    }
})

export default Router;