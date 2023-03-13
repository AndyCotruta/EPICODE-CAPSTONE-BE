import express from "express";
import httpErrors from "http-errors";
import CategoriesModel from "../categories/model.js";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const cloudinaryCategory = multer({
  storage: new CloudinaryStorage({
    cloudinary, // cloudinary is going to search in .env vars for smt called process.env.CLOUDINARY_URL
    params: {
      folder: "bamboobites/categories",
    },
  }),
}).single("categoryImage");

const categoriesRouter = express.Router();

const { NotFound, Unauthorized, BadRequest } = httpErrors;

categoriesRouter.post("/", cloudinaryCategory, async (req, res, next) => {
  try {
    const url = req.file.path;
    const newCategory = new CategoriesModel({ ...req.body, image: url });
    const { _id } = await newCategory.save();
    res.status(201).send(`Category with id ${_id} was successfully created`);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

categoriesRouter.get("/", async (req, res, next) => {
  try {
    const categories = await CategoriesModel.find().populate("restaurants");
    if (categories) {
      res.send(categories);
    } else {
      next(NotFound("Error while getting categories"));
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

categoriesRouter.get("/:categoryId", async (req, res, next) => {
  try {
    const categoryId = req.params.categoryId;
    const category = await CategoriesModel.findById(categoryId).populate(
      "restaurants"
    );
    if (category) {
      res.send(category);
    } else {
      next(NotFound(`Category with id ${categoryId} was not found`));
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

categoriesRouter.put(
  "/:categoryId",
  cloudinaryCategory,
  async (req, res, next) => {
    try {
      const url = req.file.path;
      const categoryId = req.params.categoryId;
      const updatedCategory = await CategoriesModel.findByIdAndUpdate(
        categoryId,
        { ...req.body, image: url },
        { new: true, runValidators: true }
      );
      if (updatedCategory) {
        res.status(201).send(updatedCategory);
      } else {
        next(NotFound(`Category with id ${categoryId} was not found`));
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

categoriesRouter.delete("/:categoryId", async (req, res, next) => {
  try {
    const categoryId = req.params.categoryId;
    const deletedCategory = await CategoriesModel.findByIdAndDelete(categoryId);
    if (deletedCategory) {
      res.status(204).send();
    } else {
      next(NotFound(`Category with id ${categoryId} was not found`));
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

export default categoriesRouter;
