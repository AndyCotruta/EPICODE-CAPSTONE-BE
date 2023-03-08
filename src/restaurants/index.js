import express, { request } from "express";
import httpErrors from "http-errors";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import RestaurantModel from "./model.js";

const cloudinaryRestaurant = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "bamboobites/restaurants",
    },
  }),
}).single("restaurantImage");

const restaurantRouter = express.Router();

const { NotFound, Unauthorized, BadRequest } = httpErrors;

restaurantRouter.post("/", cloudinaryRestaurant, async (req, res, next) => {
  try {
    const url = req.file.path;
    const newRestaurant = new RestaurantModel({ ...req.body, image: url });
    const { _id } = await newRestaurant.save();
    res.status(201).send(`Restaurant with id ${_id} was created successfully`);
  } catch (error) {
    console.log(error);
    next(error);
  }
});
restaurantRouter.get("/", async (req, res, next) => {
  try {
    const restaurants = await RestaurantModel.find().populate("dishes");
    res.send(restaurants);
  } catch (error) {
    console.log(error);
    next(error);
  }
});
restaurantRouter.get("/:restaurantId", async (req, res, next) => {
  try {
    const restaurantId = req.params.restaurantId;
    const restaurant = await RestaurantModel.findById(restaurantId).populate(
      "dishes"
    );
    if (restaurant) {
      res.send(restaurant);
    } else {
      next(NotFound(`Restaurant with id ${restaurantId} was not found`));
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});
restaurantRouter.put(
  "/:restaurantId",
  cloudinaryRestaurant,
  async (req, res, next) => {
    try {
      const url = req.file.path;
      const restaurantId = req.params.restaurantId;
      const updatedRestaurant = await RestaurantModel.findByIdAndUpdate(
        restaurantId,
        { ...req.body, image: url },
        { new: true, runValidators: true }
      );
      if (updatedRestaurant) {
        res.status(201).send(updatedRestaurant);
      } else {
        next(NotFound(`Restaurant with id ${restaurantId} was not found`));
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);
restaurantRouter.delete("/:restaurantId", async (req, res, next) => {
  try {
    const restaurantId = req.params.restaurantId;
    const deletedRestaurant = await RestaurantModel.findByIdAndDelete(
      restaurantId
    );
    if (deletedRestaurant) {
      res.status(204).send();
    } else {
      next(NotFound(`Restaurant with id ${restaurantId} was not found`));
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

export default restaurantRouter;
