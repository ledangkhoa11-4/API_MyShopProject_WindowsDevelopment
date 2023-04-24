import productModel from "../model/productModel.js";
import orderModel from "../model/orderModel.js"
import express from 'express'

const Router = express.Router();
Router.get('/sales', async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
  
      const result = await orderModel.aggregate([
        // Filter the orders that were purchased between the start and end dates
        {
          $match: {
            PurchaseDate: {
              $gte: new Date(startDate),
              $lte: new Date(endDate),
            },
          },
        },
        // Unwind the DetailCart array
        {
          $unwind: '$DetailCart',
        },
        // Group the products in each order by their _id field, and calculate the total number of sales
        {
          $group: {
            _id: '$DetailCart.Book._id',
            totalSales: {
              $sum: '$DetailCart.QuantityBuy',
            },
          },
        },
        // Lookup the product details for each group
        {
          $lookup: {
            from: 'Books', // The name of the Products collection
            localField: '_id',
            foreignField: '_id',
            as: 'product',
          },
        },
        // Project the fields that we want to keep in the result
        {
          $project: {
            _id: 1,
            name: { $arrayElemAt: ['$product.name', 0] },
            totalSales: 1,
          },
        },
      ]);
  
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

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