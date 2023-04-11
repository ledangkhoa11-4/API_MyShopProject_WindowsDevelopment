import categoryModel from "../model/categoryModel.js";
import productModel from"../model/productModel.js";
import express from "express";

const Router=express.Router();

Router.get("/category", async (req,res)=>{
    var content=req.query.cats
    
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
    
    console.log(catIDList);
    var bookjson=await productModel.find({ CatID: { $in: catIDList } })
    
    res.json(bookjson)
}
    catch(error){
        console.log(error);
    }
})

export default Router;