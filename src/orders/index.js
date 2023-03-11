import express from "express";
import UsersModel from "../users/model.js";
import OrdersModel from "./model.js";
import createHttpError from "http-errors";
import { JWTAuthMiddleware } from "../lib/auth/jwtAuth.js";
import { adminOnlyMiddleware } from "../lib/middlewares/adminOnly.js";

const ordersRouter = express.Router();

ordersRouter.get(
  "",
  JWTAuthMiddleware,
  adminOnlyMiddleware,
  async (req, res, next) => {
    try {
      const orders = await OrdersModel.find();
      res.send(orders);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

ordersRouter.get(
  "/:orderId",
  JWTAuthMiddleware,
  adminOnlyMiddleware,
  async (req, res, next) => {
    try {
      const order = await OrdersModel.findById(req.params.orderId);
      if (order) {
        res.send(order);
      } else {
        next(
          createHttpError(
            404,
            `Order with id ${req.params.orderId} was not found`
          )
        );
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

ordersRouter.put(
  "/:orderId",
  JWTAuthMiddleware,
  adminOnlyMiddleware,
  async (req, res, next) => {
    try {
      console.log("1st step");
      const order = await OrdersModel.findById(req.params.orderId);
      if (order.status !== "delivered") {
        const updatedOrder = await OrdersModel.findByIdAndUpdate(
          req.params.orderId,
          req.body,
          { new: true, runValidators: true }
        );
        if (updatedOrder) {
          res.send(updatedOrder);
        } else {
          next(
            createHttpError(
              404,
              `Order with id ${req.params.orderId} was not found`
            )
          );
        }
      } else {
        next(
          createHttpError(403, "You cannot modify an order that was delivered")
        );
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

ordersRouter.delete(
  "/:orderId",
  JWTAuthMiddleware,
  adminOnlyMiddleware,
  async (req, res, next) => {
    try {
      const order = await OrdersModel.findById(req.params.orderId);
      if (order.status !== "delivered") {
        const targetUser = await UsersModel.findOne({
          activeOrder: req.params.orderId,
        });
        if (targetUser) {
          const deletedOrder = await OrdersModel.findByIdAndRemove(
            req.params.orderId
          );
          const updatedUser = await UsersModel.findByIdAndUpdate(
            targetUser._id,
            { activeOrder: null },
            { new: true, runValidators: true }
          );
          res.send(updatedUser);
        } else {
          next(
            createHttpError(
              404,
              `No user was found with and active orderId: ${req.params.orderId}`
            )
          );
        }
      } else {
        next(
          createHttpError(403, "You cannot delete an order that was delivered")
        );
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

export default ordersRouter;
