import productModel from "../model/productModel.js";
import orderModel from "../model/orderModel.js"
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

Router.get("/stock",async (req,res)=>{
    try{
        const result = await productModel.aggregate([
            {
              $group: {
                _id: null,
                totalQty: { $sum: '$QuantityStock' },
              },
            },
        ]);
        const totalTls = await productModel.count({ QuantityStock: { $gt: 0 } })
        result[0].totalTls = totalTls
        res.json(result[0])
    }catch(er){
        console.log(er)
        res.json([])
    }
 })

 Router.get("/best-sale",async (req,res)=>{
    try{
        let filterby = req.query.filterby
        let today = new Date()
        let cartAtTime
        let countBook = {}
        let countBookSorted = []
        let resultReturn = []
        if(filterby == 'week'){
            today = today.toISOString().slice(0, 10);
            let weekday = getWeekDates(today)
            cartAtTime = await orderModel.find({
                PurchaseDate: {
                    $gte: weekday.start + "T00:00:00.000Z",
                    $lte: weekday.end + "T23:59:59.999Z"
                }
            },'DetailCart')
        }
        if(filterby == 'month'){
            let monthDate = getFirstAndLastDayOfMonth(today)
            cartAtTime = await orderModel.find({
                PurchaseDate: {
                    $gte: monthDate.start,
                    $lte: monthDate.end
                }
            },'DetailCart')
        }
        if(filterby == 'year'){
            const year = today.getFullYear()
            let yearDate = {
                start: `${year}-01-01T00:00:00.000Z`,
                end: `${year}-12-31T23:59:59.999Z`
            }
            cartAtTime = await orderModel.find({
                PurchaseDate: {
                    $gte: yearDate.start,
                    $lte: yearDate.end
                }
            },'DetailCart')
        }
        for(let cart of cartAtTime){
            let details = cart.DetailCart
            for(let detail of details)
                if(countBook[detail.Book._id]==undefined)
                    countBook[detail.Book._id] = detail.QuantityBuy
                else
                    countBook[detail.Book._id] += detail.QuantityBuy
        }
        console.log(countBook)
        for (var id in countBook)
            countBookSorted.push([id, countBook[id]]);
        countBookSorted.sort(function(a, b) {
            return b[1] - a[1];
        });
        
        for(let idx = 0; idx <= Math.min(4,countBookSorted.length);idx++){
            const book = await productModel.find({_id: countBookSorted[idx][0]}, `_id Name PurchasePrice SellingPrice Author QuantityStock QuantityOrder IsOnStock PublishedYear`).exec();
            resultReturn.push(book[0])
        }
        res.json(resultReturn);
    }catch(ex){
        console.log(ex);
        res.json("")
    }
})

function getWeekDates(dateString) {
    const date = new Date(dateString);
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1));
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(date);
    endOfWeek.setDate(date.getDate() - date.getDay() + 7);
    endOfWeek.setHours(23, 59, 59, 999);
    const startDateString = startOfWeek.toISOString().slice(0, 10);
    const endDateString = endOfWeek.toISOString().slice(0, 10);
    return { start: startDateString, end: endDateString };
}
function getFirstAndLastDayOfMonth(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = `${year}-${pad(month+1)}-01T00:00:00.000Z`;
    const lastDay = `${year}-${pad(month+1)}-${getDaysInMonth(year,month+1)}T23:59:59.999Z`;
  
    return { start:firstDay, end:lastDay };
}
function getDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
}
function pad(d) {
    return (d < 10) ? '0' + d.toString() : d.toString();
}
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

export default Router;

