import _ from "./config/config.js"
import  express from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import categoryRoute from "./Routes/categoryRoute.js"
import productRoute from "./Routes/productRoute.js"
import couponRoute from "./Routes/couponRoute.js"
import accountRoute from "./Routes/accountRoute.js"
import bodyParser from "body-parser"
const app = express()

try{
  await mongoose.connect(process.env.MONGO_URL, {useUnifiedTopology: true, useNewUrlParser: true})
  console.log("Database connected...")
}catch(e){
  console.log("Error connected database")
  console.log(e)
  process.exit(-1)
}
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(morgan('dev'))
app.use(express.json())
app.get("/",(req,res,next)=>{
    let obj = {
      status: "Connect successfully"
    }
    res.json(obj)
})
app.use("/product",producRoute)

app.use("/category",categoryRoute)
app.use("/product",productRoute)
app.use("/coupon",couponRoute)
app.use("/account",accountRoute)

  app.listen(process.env.PORT, ()=>{
    console.log(`Server running at http://127.0.0.1:${process.env.PORT}`);
})
//ĐĂNG NHÂP: PHƯỚC

//LẤY DỮ LIỆU TỪ EXCEL/ACCESS: DƯƠNG

//DASHBOARD (LÀM CHO ĐẸP)
/*
- Có tổng cộng bao nhiêu sản phẩm đang bán         PHƯỚC       
- Có tổng cộng bao nhiêu đơn hàng mới trong tuần / tháng    DƯƠNG
- Liệt kê top 5 sản phẩm đang sắp hết hàng (số lượng < 5)   QUÂN

-Báo cáo doanh thu và lợi nhuận theo ngày đến ngày, theo tuần, theo tháng, theo năm (vẽ biểu đồ)    KHOA
 Xem các sản phẩm và số lượng bán theo ngày đến ngày, theo tuần, theo tháng, theo năm (vẽ biểu đồ)  QUÂN
*/


//VỪA LÀM MÀN HÌNH VỪA LÀM NODE
//Xem danh sách các sản phẩm theo loại sản phẩm có phân trang.    Dương
//URL: .../search/category?tenloai

//Cho phép thêm một loại sản phẩm, xóa một loại sản phẩm, hiệu chỉnh loại sản phẩm    Phước
// URL: .../category/(add, del, update)/*

//Cho phép thêm một sản phẩm, xóa một sản phẩm, hiệu chỉnh thông tin sản  phẩm     Quân
//URL: .../product/*

//Cho phép tìm kiếm sản phẩm theo tên (Lọc theo giá )    Dương
//URL: .../search/product?tensp?filter

//- [ ]  Tạo ra các đơn hàng  Cho phép xóa một đơn hàng, cập nhật một đơn hàng  Khoa
//URL: .../order/(create,...)

//Cho phép xem danh sách các đơn hàng có phân trang, xem chi tiết một đơn hàng   Quân
//URL: .../order
//URL: .../order/:id

//Tìm kiếm các đơn hàng từ ngày đến ngày      Phước
//URL: .../search/order


//Báo cáo doanh thu và lợi nhuận theo ngày đến ngày, theo tuần, theo tháng, theo năm    KHOA  
//UR: .../report
//Xem các sản phẩm và số lượng bán theo ngày đến ngày, theo tuần, theo tháng, theo năm    QUÂN






/*
app.use(express.urlencoded({ extended: true })); // for application/x-www-form-urlencoded
app.use(express.json()); //from fetch, ... post in js  // for application/json

app.use(morgan("Imcoming request: :method :url")) 
app.get('/', async function (req, res) {
    // const id = req.params.id
    // let studentRes = await ProductModel.findOne({}).exec();
    // if (!studentRes)
    //     studentRes = {fullname: `Cannot find student with id: ${id}`}

    // res.json(studentRes)
  })

app.get('/add', async function (req, res) {
    const newBook = new ProductModel({
      BookID: 2,
      Name: "Tôi thấy hoa vàng trên cỏ xanh",
      PurchasePrice: 159000,
      SellingPrice: 20000,
      Author: "Nguyễn Nhật Ánh",
      PublishedYear: 2014,
      Quantity: 7,
      CatID:1,
      Description:"Tôi thấy hoa vàng trên cỏ xanh” truyện dài mới nhất của nhà văn vừa nhận giải văn chương ASEAN Nguyễn Nhật Ánh - đã được Nhà xuất bản Trẻ mua tác quyền và giới thiệu đến độc giả cả nước. Cuốn sách viết về tuổi thơ nghèo khó ở một làng quê, bên cạnh đề tài tình yêu quen thuộc, lần đầu tiên Nguyễn Nhật Ánh đưa vào tác phẩm của mình những nhân vật phản diện và đặt ra vấn đề đạo đức như sự vô tâm, cái ác. 81 chương ngắn là 81 câu chuyện nhỏ của những đứa trẻ xảy ra ở một ngôi làng: chuyện về con cóc Cậu trời, chuyện ma, chuyện công chúa và hoàng tử, bên cạnh chuyện đói ăn, cháy nhà, lụt lội,... “Tôi thấy hoa vàng trên cỏ xanh” hứa hẹn đem đến những điều thú vị với cả bạn đọc nhỏ tuổi và người lớn bằng giọng văn trong sáng, hồn nhiên, giản dị của trẻ con cùng nhiều tình tiết thú vị, bất ngờ và cảm động trong suốt hơn 300 trang sách. Cuốn sách, vì thế có sức ám ảnh, thu hút, hấp dẫn không thể bỏ qua.",
      Cover: ""
    })
    try{
      const result = await newBook.save()
      res.json(result)
    }catch(err){
      res.json(err.message)
    }
   
  })
*/
