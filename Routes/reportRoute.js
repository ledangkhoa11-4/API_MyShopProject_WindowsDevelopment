import productModel from "../model/productModel.js";
import orderModel from "../model/orderModel.js"
import express from 'express'

const Router = express.Router();
Router.get('/profit/day', async (req, res) => {
  let startDay = req.query.start //+ "T00:00:00.000Z"
  let endDate = req.query.end //"T23:59:59.999Z"
  let result = []

  let numday = calculateDaysBetweenDates(startDay, endDate)
  for(let i = 0; i <=numday; i++ ){
    let day = addDay(startDay,i)

    let carts = await orderModel.find({
      PurchaseDate:{
        $gte: day + "T00:00:00.000Z",
        $lte: day + "T23:59:59.999Z"
      }
    }, 'DetailCart.QuantityBuy DetailCart.Book._id ').exec()

    let totalSelling = 0
    let totalPurchase = 0
    if(carts.length != 0){
      for(let cart of carts){
        for(let detailCart of cart.DetailCart){
            let product = await productModel.findById({_id: detailCart.Book._id})
            totalSelling += detailCart.QuantityBuy * product.SellingPrice
            totalPurchase += detailCart.QuantityBuy * product.PurchasePrice
        }
      }
    }
    let totalProfit = totalSelling - totalPurchase
    const item = {
      time: day,
      profit: totalProfit
    }
      result.push(item)
  }
  res.json(result)
});
Router.get("/profit/month", async (req, res)=>{
  let month = +req.query.month-1
  let year = +req.query.year
  let dateMonth = getFirstAndLastDayOfMonth(year, month)
  let result = []
  for(let week = 1 ; week <= 4; week++){
    let startWeek = addDay(dateMonth.start, 7*(week-1));
    let endWeek =  addDay(startWeek, 6);
    if(week == 4)
      endWeek = dateMonth.end
      let carts = await orderModel.find({
        PurchaseDate:{
          $gte: startWeek + "T00:00:00.000Z",
          $lte: endWeek + "T23:59:59.999Z"
        }
      }, 'DetailCart.QuantityBuy DetailCart.Book._id').exec()
  
      let totalSelling = 0
      let totalPurchase = 0
      if(carts.length != 0){
        for(let cart of carts){
          for(let detailCart of cart.DetailCart){
            let product = await productModel.findById({_id: detailCart.Book._id})
            totalSelling += detailCart.QuantityBuy * product.SellingPrice
            totalPurchase += detailCart.QuantityBuy * product.PurchasePrice
          }
        }
      }
      let totalProfit = totalSelling - totalPurchase
      const item = {
        time: "Week " + week,
        profit: totalProfit
      }
        result.push(item)
  }
  res.json(result)
})
Router.get("/statistic/day", async (req, res)=>{
  let bookid = req.query.id
  let startDay = req.query.start //+ "T00:00:00.000Z"
  let endDate = req.query.end //"T23:59:59.999Z"
  let result = []
  let numday = calculateDaysBetweenDates(startDay, endDate)
  for(let i = 0; i <=numday; i++ ){
    let day = addDay(startDay,i)

    let carts = await orderModel.find({
      'DetailCart.Book._id': bookid,
      PurchaseDate:{
        $gte: day + "T00:00:00.000Z",
        $lte: day + "T23:59:59.999Z"
      }
    }, 'DetailCart.QuantityBuy DetailCart.Book._id').exec()

    let totalBuyPerDay = 0
    if(carts.length != 0){
      for(let cart of carts){
        for(let detailCart of cart.DetailCart){
           if(detailCart.Book._id == bookid) {
            totalBuyPerDay += detailCart.QuantityBuy
           }
        }
      }
    }
    const item = {
      category: day,
      quantitySelling: totalBuyPerDay
    }
      result.push(item)
  }
  res.json(result)
})
  
Router.get("/statistic/month", async (req, res)=>{
  let bookid = req.query.id
  let month = +req.query.month-1
  let year = +req.query.year
  let dateMonth = getFirstAndLastDayOfMonth(year, month)
  let result = []
  for(let week = 1 ; week <= 4; week++){
    let startWeek = addDay(dateMonth.start, 7*(week-1));
    let endWeek =  addDay(startWeek, 6);
    if(week == 4)
      endWeek = dateMonth.end 
      let carts = await orderModel.find({
        'DetailCart.Book._id': bookid,
        PurchaseDate:{
          $gte: startWeek + "T00:00:00.000Z",
          $lte: endWeek + "T23:59:59.999Z"
        }
      }, 'DetailCart.QuantityBuy DetailCart.Book._id').exec()
  
      let totalBuyPerDay = 0
      if(carts.length != 0){
        for(let cart of carts){
          for(let detailCart of cart.DetailCart){
             if(detailCart.Book._id == bookid) {
              totalBuyPerDay += detailCart.QuantityBuy
             }
          }
        }
      }
      const item = {
        category: "Week " + week,
        quantitySelling: totalBuyPerDay
      }
        result.push(item)
  }
  res.json(result)
})

function addDay(inputDate, i) {
  let date = new Date(inputDate);
  date.setDate(date.getDate() + i);
  let year = date.getFullYear();
  let month = String(date.getMonth() + 1).padStart(2, "0");
  let day = String(date.getDate()).padStart(2, "0");
  let result = `${year}-${month}-${day}`;
  return result;
}
function calculateDaysBetweenDates(dayA, dayB) {
  let dateA = new Date(dayA);
  let dateB = new Date(dayB);
  let timeDifference = dateB - dateA;
  let daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  return daysDifference;
}
function getFirstAndLastDayOfMonth(year, month) {
  const firstDay = `${year}-${pad(month+1)}-01`;
  const lastDay = `${year}-${pad(month+1)}-${getDaysInMonth(year,month+1)}`;

  return { start:firstDay, end:lastDay };
}
function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}
function pad(d) {
  return (d < 10) ? '0' + d.toString() : d.toString();
}
export default Router;