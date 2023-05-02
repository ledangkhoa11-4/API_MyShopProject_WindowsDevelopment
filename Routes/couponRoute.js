import couponModel from "../model/couponModel.js";
import express from 'express'

const Router = express.Router();

Router.get("/",async (req,res)=>{
    try{
        const result = await couponModel.find({});
        res.json(result)
    }catch(ex){
        const result = []
        res.json(result)
    }
})
Router.post("/",async (req,res)=>{
    try{
        delete(req.body.DateAdd)
        delete(req.body._id)
        const newCoupon = new couponModel(req.body)
        const result = await newCoupon.save()
        let id = result._id.toString();
        id = id.replaceAll('"','"')
        res.json(id)
    }catch(ex){
        console.log(ex);
        res.json()
    }
})

export default Router;

