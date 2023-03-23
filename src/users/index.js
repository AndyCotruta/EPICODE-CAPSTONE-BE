import express from "express";
import UsersModel from "./model.js";
import OrdersModel from "../orders/model.js";
import SharedOrderModel from "../sharedOrder/model.js";
import passport from "passport";
import { adminOnlyMiddleware } from "../lib/middlewares/adminOnly.js";
import { createAccessToken } from "../lib/auth/authTools.js";
import createHttpError from "http-errors";
import { JWTAuthMiddleware } from "../lib/auth/jwtAuth.js";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const cloudinaryUser = multer({
  storage: new CloudinaryStorage({
    cloudinary, // cloudinary is going to search in .env vars for smt called process.env.CLOUDINARY_URL
    params: {
      folder: "bamboobites/users",
    },
  }),
}).single("userImage");

// ..........................................Creating CRUD operations...............................
const usersRouter = express.Router(); //declaring the Router that connects our operations to the server

// /me ENDPOINTS................................................................

usersRouter.get("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const user = await UsersModel.findById(req.user._id)
      .populate({
        path: "activeOrder",
        populate: {
          path: "restaurantId",
        },
      })
      .populate({ path: "orderHistory", populate: { path: "restaurantId" } })
      .populate({
        path: "sharedOrder",
        populate: { path: "order", populate: { path: "restaurantId" } },
      })
      .populate({
        path: "sharedOrder",
        populate: { path: "initiatedBy" },
      })
      .populate({
        path: "sharedOrder",
        populate: { path: "users" },
      });

    res.send(user);
  } catch (error) {
    next(error);
  }
});

usersRouter.put(
  "/me",
  JWTAuthMiddleware,
  cloudinaryUser,
  async (req, res, next) => {
    try {
      console.log(req.file);
      if (req.file !== undefined) {
        const url = req.file.path;
        const updatedUser = await UsersModel.findByIdAndUpdate(
          req.user._id,
          { ...req.body, avatar: url },
          {
            new: true,
            runValidators: true,
          }
        );
        res.send(updatedUser);
      } else if (
        typeof req.body.userImage === "string" &&
        req.body.userImage !== undefined
      ) {
        const updatedUser = await UsersModel.findByIdAndUpdate(
          req.user._id,
          { ...req.body, avatar: req.body.userImage },
          {
            new: true,
            runValidators: true,
          }
        );
        res.send(updatedUser);
      } else {
        const updatedUser = await UsersModel.findByIdAndUpdate(
          req.user._id,
          req.body,
          {
            new: true,
            runValidators: true,
          }
        );
        res.send(updatedUser);
      }
    } catch (error) {
      next(error);
    }
  }
);

usersRouter.delete("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    await UsersModel.findByIdAndUpdate(req.user._id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

usersRouter.post(
  "/me/activeOrder",
  JWTAuthMiddleware,
  async (req, res, next) => {
    try {
      const newOrder = new OrdersModel({ ...req.body, userId: req.user._id });
      const { _id } = await newOrder.save();
      const updatedUser = await UsersModel.findByIdAndUpdate(
        req.user._id,
        { activeOrder: _id },
        { new: true, runValidators: true }
      );
      if (updatedUser) {
        res.send(updatedUser);
      } else {
        next(
          createHttpError(404, `User with id ${req.user._id} was not found`)
        );
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

usersRouter.post(
  "/me/orderHistory",
  JWTAuthMiddleware,
  async (req, res, next) => {
    try {
      const user = await UsersModel.findById(req.user._id);
      const deliveredOrder = await OrdersModel.findByIdAndUpdate(
        req.body.orderId,
        { status: "delivered" },
        { new: true, runValidators: true }
      );
      if (deliveredOrder) {
        if (
          user.activeOrder !== null &&
          req.body.orderId === user.activeOrder._id.toString()
        ) {
          const updatedUser = await UsersModel.findByIdAndUpdate(
            req.user._id,
            {
              $push: { orderHistory: req.body.orderId },
              activeOrder: null,
            },
            { new: true, runValidators: true }
          );
          if (updatedUser) {
            res.send(updatedUser);
          } else {
            next(
              createHttpError(404, `User with id ${req.user._id} was not found`)
            );
          }
        } else {
          next(
            createHttpError(
              403,
              `You cannot move the order ${req.body.orderId} because it is already in the orderHistory collection`
            )
          );
        }
      } else {
        next(
          createHttpError(
            404,
            `Order with id ${req.body.orderId} was not found`
          )
        );
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

usersRouter.post(
  "/me/sharedOrder",
  JWTAuthMiddleware,
  async (req, res, next) => {
    try {
      const newOrder = new OrdersModel({
        ...req.body,
        userId: req.user._id,
        sharedOrder: true,
      });
      const newOrderObj = await newOrder.save();
      const newSharedOrder = new SharedOrderModel({
        ...req.body,
        initiatedBy: req.user._id,
        order: newOrderObj._id,
      });
      const { _id } = await newSharedOrder.save();
      const users = req.body.users;
      users.forEach(async (user) => {
        const updatedUser = await UsersModel.findByIdAndUpdate(
          user,
          { sharedOrder: _id },
          { new: true, runValidators: true }
        );
        if (updatedUser) {
          console.log(updatedUser);
        } else {
          next(
            createHttpError(404, `Participant user ${user} cannot be found `)
          );
        }
      });
      const updatedInitiatorUser = await UsersModel.findByIdAndUpdate(
        req.user._id,
        { sharedOrder: _id },
        { new: true, runValidators: true }
      );
      if (updatedInitiatorUser) {
        res.send(updatedInitiatorUser);
      } else {
        next(
          createHttpError(
            404,
            `Initiator user with id ${req.user._id} cannot be found`
          )
        );
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

usersRouter.post(
  "/me/sharedOrderHistory",
  JWTAuthMiddleware,
  async (req, res, next) => {
    try {
      const currentUser = req.user._id;
      const initiatedBy = req.body.initiatedBy;
      const orderId = req.body.orderId;
      const users = req.body.users;
      const deliveredOrder = await OrdersModel.findByIdAndUpdate(
        orderId,
        { status: "delivered" },
        { new: true, runValidators: true }
      );
      console.log("Delivered order: " + deliveredOrder);
      if (deliveredOrder) {
        const index = users.findIndex((user) => user === currentUser);
        if (index !== -1) {
          users.forEach(async (user) => {
            const updatedUser = await UsersModel.findByIdAndUpdate(
              user,
              { $push: { orderHistory: orderId }, sharedOrder: null },
              { new: true, runValidators: true }
            );
            res.send(updatedUser);
            if (!updatedUser) {
              next(
                createHttpError(404, `User with id ${user} could not be found`)
              );
            }
          });
        } else {
          const updatedInitiatorUser = await UsersModel.findByIdAndUpdate(
            initiatedBy,
            { $push: { orderHistory: orderId }, sharedOrder: null },
            { new: true, runValidators: true }
          );
          if (updatedInitiatorUser) {
            res.send(updatedInitiatorUser);
          } else {
            next(
              createHttpError(
                404,
                `User with id ${initiatedBy} could not be found`
              )
            );
          }
        }
      } else {
        next(
          createHttpError(
            404,
            "An active order with id: ",
            orderId,
            " could not be found"
          )
        );
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

usersRouter.post(
  "/me/dailyFood/",
  JWTAuthMiddleware,
  async (req, res, next) => {
    try {
      const userId = req.user._id;
      const updatedUser = await UsersModel.findByIdAndUpdate(
        userId,
        { $push: { dailyFood: req.body } },
        { new: true, runValidators: true }
      );
      if (updatedUser) {
        res.send(updatedUser);
      } else {
        next(createHttpError(404, `User with id ${userId} was not found`));
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

usersRouter.put(
  "/me/dailyFood/:dailyFoodId",
  JWTAuthMiddleware,
  async (req, res, next) => {
    try {
      const userId = req.user._id;
      const foodId = req.params.dailyFoodId;
      const user = await UsersModel.findById(userId);
      if (user) {
        const index = user.dailyFood.findIndex(
          (food) => food._id.toString() === foodId.toString()
        );
        if (index !== -1) {
          user.dailyFood[index] = {
            ...user.dailyFood[index].toObject(),
            ...req.body,
          };
          await user.save();
          res.send(user);
        } else {
          next(createHttpError(404, `Daily food with id ${foodId} not found`));
        }
      } else {
        next(createHttpError(404, `User with id ${userId} not found`));
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

usersRouter.delete(
  "/me/dailyFood/:dailyFoodId",
  JWTAuthMiddleware,
  async (req, res, next) => {
    try {
      const userId = req.user._id;
      const foodId = req.params.dailyFoodId;
      const updatedUser = await UsersModel.findByIdAndUpdate(
        userId,
        { $pull: { dailyFood: { _id: foodId } } },
        { new: true }
      );
      if (updatedUser) {
        res.send(updatedUser);
      } else {
        next(createHttpError(404, `User with id ${userId} not found`));
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

//.......................................... Google Login................................

usersRouter.get(
  "/googleLogin",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
// The purpose of this endpoint is to redirect users to Google Consent Screen

usersRouter.get(
  "/googleRedirect",
  passport.authenticate("google", { session: false }),
  async (req, res, next) => {
    console.log(req.user);

    // res.redirect(
    //   `http://localhost:19006/?acccessToken=${req.user.accessToken}`
    // );
    res.send({ accessToken: req.user.accessToken });
  }
);

// 1. Create

usersRouter.post("/googleLogin", async (req, res, next) => {
  try {
    const user = await UsersModel.findOne({ email: req.body.email });
    if (!user) {
      const newUser = new UsersModel(req.body);
      const { _id, role } = await newUser.save();
      const payload = { _id, role };
      const accessToken = await createAccessToken(payload);
      res.send(accessToken);
    } else {
      const payload = { _id: user._id, role: user.role };

      const accessToken = await createAccessToken(payload);
      res.send({ accessToken });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

usersRouter.post("/register", cloudinaryUser, async (req, res, next) => {
  try {
    const user = await UsersModel.findOne({ email: req.body.email });
    if (!user) {
      const newUser = new UsersModel(req.body);
      const { _id, role } = await newUser.save();
      const payload = { _id, role };
      const accessToken = await createAccessToken(payload);
      res.send(accessToken);
    } else {
      next(createHttpError(404, "An user with that email already exists"));
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

usersRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UsersModel.checkCredentials(email, password);

    if (user) {
      const payload = { _id: user._id, role: user.role };

      const accessToken = await createAccessToken(payload);
      res.send({ accessToken });
    } else {
      next(createHttpError(401, "Credentials are not ok!"));
    }
  } catch (error) {
    next(error);
  }
});

// 2. Read
usersRouter.get(
  "/",
  JWTAuthMiddleware,
  adminOnlyMiddleware,
  async (req, res, next) => {
    try {
      const users = await UsersModel.find({});
      res.send(users); //sending the JSON body
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

// 3. Read individual user
usersRouter.get(
  "/:id",
  JWTAuthMiddleware,
  adminOnlyMiddleware,
  async (req, res, next) => {
    try {
      const userId = req.params.id;
      const searchedUser = await UsersModel.findById(userId);
      if (searchedUser) {
        res.send(searchedUser);
      } else {
        next(NotFound(`User with id ${userId} not found`));
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

// 4. Update
usersRouter.put(
  "/:id",
  JWTAuthMiddleware,
  adminOnlyMiddleware,
  async (req, res, next) => {
    try {
      const userId = req.params.id;
      const updatedUser = await UsersModel.findByIdAndUpdate(userId, req.body, {
        new: true,
        runValidators: true,
      });
      if (updatedUser) {
        res.send(updatedUser);
      } else {
        next(NotFound(`User with id ${userId} not found`));
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

// 5.DELETE
usersRouter.delete(
  "/:id",
  JWTAuthMiddleware,
  adminOnlyMiddleware,
  async (req, res, next) => {
    try {
      const userId = req.params.id;
      const deletedUser = await UsersModel.findByIdAndDelete(userId);
      if (deletedUser) {
        res.status(204).send();
      } else {
        next(NotFound(`User with id ${userId} not found`));
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

export default usersRouter;
