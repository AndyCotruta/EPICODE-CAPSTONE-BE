import express from "express";
import httpErrors from "http-errors";

import FeaturedCategoriesModel from "../featuredCategories/model.js";

const featuredCategoriesRouter = express.Router();

const { NotFound, Unauthorized, BadRequest } = httpErrors;

featuredCategoriesRouter.post("/", async (req, res, next) => {
  try {
    const newCategory = new FeaturedCategoriesModel(req.body);
    const { _id } = await newCategory.save();
    res.status(201).send(`Category with id ${_id} was successfully created`);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

featuredCategoriesRouter.get("/", async (req, res, next) => {
  try {
    const categories = await FeaturedCategoriesModel.find().populate(
      "restaurants"
    );
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

featuredCategoriesRouter.get("/:categoryId", async (req, res, next) => {
  try {
    const categoryId = req.params.categoryId;
    const category = await FeaturedCategoriesModel.findById(
      categoryId
    ).populate("restaurants");
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

featuredCategoriesRouter.put("/:categoryId", async (req, res, next) => {
  try {
    const categoryId = req.params.categoryId;
    const updatedCategory = await FeaturedCategoriesModel.findByIdAndUpdate(
      categoryId,
      req.body,
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
});

featuredCategoriesRouter.delete("/:categoryId", async (req, res, next) => {
  try {
    const categoryId = req.params.categoryId;
    const deletedCategory = await FeaturedCategoriesModel.findByIdAndDelete(
      categoryId
    );
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

export default featuredCategoriesRouter;
