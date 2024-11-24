import express from "express";
import {
  addFood,
  listFood,
  removeFood,
  editFood,
  findAFood,
  filterFoodByDate,
} from "../controllers/foodController.js";
import multer from "multer";

// Image Storage Engine
const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
      return cb(null, `${Date.now()}_${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

const foodRouter = express.Router();

// Define routes
foodRouter.post("/add", upload.single("image"), addFood);
foodRouter.get("/list", listFood);
foodRouter.get("/find/:id", findAFood);
foodRouter.post("/remove", removeFood);
foodRouter.put("/edit/:id", upload.single("image"), editFood);
foodRouter.post('/filterByDate', filterFoodByDate);

export default foodRouter;
