import accountModel from "../model/accountModel.js";
import express from 'express'

const Router = express.Router();
console.log("test");
Router.get("/",async(req,res,next)=>{
    try{
        const account = await accountModel.findOne({ Username: req.query.username});
        res.json(account)
    }catch(ex){
        const result = []
        res.json(result)
    }
})

Router.post('/',async(req,res,next)=>{
   try{
        var user = new accountModel(req.body)
        const add = await user.save()
        res.json(add)
   }catch(ex){
        const result = []
        res.json(result)
   }
})

export default Router;