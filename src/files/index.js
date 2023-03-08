import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import express from "express";
import RestaurantModel from "../restaurants/model.js";
import createHttpError from "http-errors";

const filesRouter = express.Router();

const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary, // cloudinary is going to search in .env vars for smt called process.env.CLOUDINARY_URL
    params: {
      folder: "bamboobites/dishes",
    },
  }),
}).single("dishImage");

const cloudinaryRestaurant = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "bamboobites/restaurants",
    },
  }),
}).single("restaurantImage");

filesRouter.post(
  "/:restaurantId/:dishId",
  cloudinaryUploader,
  async (req, res, next) => {
    try {
      console.log(req.file);
      const url = req.file.path;
      const dishId = req.params.dishId;
      const restaurantId = req.params.restaurantId;
      const restaurant = await RestaurantModel.findById(restaurantId);
      if (restaurant) {
        const index = restaurant.dishes.findIndex(
          (dish) => dish._id.toString() === dishId
        );
        if (index !== -1) {
          restaurant.dishes[index] = {
            ...restaurant.dishes[index].toObject(),
            image: url,
          };
          await restaurant.save();
          res.status(201).send(restaurant);
        } else {
          next(createHttpError(404, `Dish with id ${dishId} was not found`));
        }
      } else {
        next(
          createHttpError(
            404,
            `Restaurant with id ${restaurantId} was not found`
          )
        );
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

filesRouter.post(
  "/:restaurantId",
  cloudinaryRestaurant,
  async (req, res, next) => {
    const url = req.file.path;
    const restaurantId = req.params.restaurantId;
    const updatedRestaurant = await RestaurantModel.findByIdAndUpdate(
      restaurantId,
      { image: url },
      { new: true, runValidators: true }
    );
    if (updatedRestaurant) {
      res.status(201).send(updatedRestaurant);
    } else {
      next(
        createHttpError(404, `Restaurant with id ${restaurantId} was not found`)
      );
    }
  }
);
export default filesRouter;
