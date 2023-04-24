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
        
        var bookjson=await productModel.find({ CatID: { $in: catIDList }, PurchasePrice: { $gte: pricestart, $lte: priceend } },
            `_id Name CatID PurchasePrice SellingPrice Author QuantityStock QuantityOrder IsOnStock PublishedYear Description`)
            .skip(pageIndex*limit).limit(limit)
        res.json(bookjson)
    }
    else if(catIDList.length>0 && priceend===pricestart){
        var bookjson=await productModel.find({ CatID: { $in: catIDList } },
            `_id Name CatID PurchasePrice SellingPrice Author QuantityStock QuantityOrder IsOnStock PublishedYear Description`)
            .skip(pageIndex*limit).limit(limit)
        console.log("cc2");
        res.json(bookjson)
    }
    else {
        var bookjson=await productModel.find({ PurchasePrice: { $gte: pricestart, $lte: priceend } },
            `_id Name CatID PurchasePrice SellingPrice Author QuantityStock QuantityOrder IsOnStock PublishedYear Description`)
            .skip(pageIndex*limit).limit(limit)
        console.log("cc3");
        res.json(bookjson)
    }
    
}
    catch(error){
        console.log(error);
    }
})
Router.get("/product/count",async (req,res)=>{
    var content=req.query.content
    var pricestart=parseInt( req.query.pricestart)
    var priceend=parseInt(req.query.priceend)
    
    if(priceend!=pricestart){
        var bookjson=await productModel.count({
            Name: {$regex: '.*' + content + '.*'},
            PurchasePrice: { $gte: pricestart, $lte: priceend }
        })
        console.log("cc")
        res.json(bookjson)
    }
    else{
        var bookjson=await productModel.count({
            Name: {$regex: '.*' + content + '.*'}
        })
        console.log(bookjson)
        res.json(bookjson)
    }
    
})
Router.get("/product",async (req,res)=>{
    var content=req.query.content
    var regexFindString=new RegExp(/.*content.*/i)
    var pricestart=parseInt( req.query.pricestart)
    var priceend=parseInt(req.query.priceend)
    var pageIndex=parseInt(req.query.pageIndex)
    var limit=parseInt(req.query.limit)
    console.log(content);
    if(priceend!=pricestart){
        var bookjson=await productModel.find({
            Name: {$regex: new RegExp(".*" + content.toLowerCase()+".*", "i")},
            PurchasePrice: { $gte: pricestart, $lte: priceend }
        },`_id Name CatID PurchasePrice SellingPrice Author QuantityStock QuantityOrder IsOnStock PublishedYear Description`)
        .skip(pageIndex*limit).limit(limit)
        console.log(bookjson.length)
        res.json(bookjson)
    }
    else{
        var bookjson=await productModel.find({
            Name: {$regex: new RegExp(".*" + content.toLowerCase()+".*", "i")}
        },`_id Name CatID PurchasePrice SellingPrice Author QuantityStock QuantityOrder IsOnStock PublishedYear Description`)
        .skip(pageIndex*limit).limit(limit)
        console.log(bookjson.length)
        res.json(bookjson)
    }
    
})

export default Router;