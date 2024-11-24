import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import dotenv from "dotenv";
import paymentRoute from "./routes/paymentRoute.js";
import deliveryRoute from "./routes/deliveryRoute.js";
import expensesRoute from "./routes/expenseRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import supplierRouter from "./routes/supplierRoutes.js"
import suppplierOrderRoute from "./routes/supplierOrderRoutes.js";
import report from "./routes/report.js"
import employeeRouter from "./routes/employeeRoutes.js";


//load envirement variabel
dotenv.config();

// App configuration
const app = express();
const port = 4000;

// Middleware
app.use(express.json());
app.use(cors());

// Database connection
connectDB();

// API endpoints
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/payment", paymentRoute);
app.use("/api/delivery", deliveryRoute);
app.use("/api/expenses", expensesRoute);
app.use("/api/admin", adminRouter);
app.use("/api/suppliers", supplierRouter)
app.use("/api/supplier-orders", suppplierOrderRoute)
app.use("/api/employees", employeeRouter);
//sithija reports
app.use('/api/report', report);

app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(port, () => {
  console.log(`Server Started on http://localhost:${port}`);
});
