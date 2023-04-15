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
  
export default Router;