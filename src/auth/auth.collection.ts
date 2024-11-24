import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { compare, hash } from "bcrypt";
import { DecodedToken } from "../types/user";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { prisma } from "../config/prisma";
import { generateTokens } from "../utils/index";

class UserController {
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (!user) {
        res.status(httpStatus.NOT_FOUND).json({
          message: "User with the provided email doesn't exist",
        });
      }
      const confirmPasswords = await compare(password, user.password);
      if (!confirmPasswords) {
        res.status(httpStatus.BAD_REQUEST).json({
          message: "Passwords do not match",
        });
      }
      const { refreshToken, accessToken } = generateTokens(user.id);

      await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken },
      });

      res.status(httpStatus.OK).json({
        id: user.id,
        email: user.email,
        phone: user.phone,
        username: user.username,
        fullname: user.fullname,
        avatarUrl: user.avatarUrl,
        role: user.role,
        location: user.location,
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified,
        privateProfile: user.privateProfile,
        accessToken,
        refreshToken,
      });
    } catch (error: any) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        error: "An error occurred",
        message: error.message,
      });
    }
  }

  async register(req: Request, res: Response): Promise<void> {
    try {
      const { username, email, password, fullname, role, phone } = req.body;
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (user) {
        res.status(httpStatus.CONFLICT).json({
          message: "A user with the same email exists",
        });
      }

      await prisma.user.create({
        data: {
          email,
          password: await hash(password, 10),
          username,
          fullname,
          role,
          phone,
        },
      });
      res.status(httpStatus.OK).json("User created successfully");
    } catch (error: any) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        error: "An error occurred",
        message: error.message,
      });
    }
  }

  async googleLogin(req: Request, res: Response): Promise<void> {
    try {
      const { displayName, email, emailVerified, photoURL, role } = req.body;
      let user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            email,
            username: displayName,
            fullname: displayName,
            avatar: photoURL,
            emailVerified,
            password: "",
            role: role === "" ? "User" : role,
          },
        });
      }

      const { refreshToken, accessToken } = generateTokens(user.id);

      await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken },
      });

      res.status(httpStatus.OK).json({
        id: user.id,
        email: user.email,
        username: user.username,
        fullname: user.fullname,
        avatar: user.avatarUrl,
        role: user.role,
        location: user.location,
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified,
        privateProfile: user.privateProfile,
        accessToken,
        refreshToken,
      });
    } catch (error: any) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        error: "An error occurred",
        message: error.message,
      });
    }
  }

  async whoami(req: Request, res: Response): Promise<void> {
    try {
      const { accessToken, refreshToken } = req.body;

      if (!accessToken || !refreshToken) {
        res.status(httpStatus.UNAUTHORIZED).json({
          message: "Unauthorized - no tokens provided",
        });
      }

      let decoded: DecodedToken;

      try {
        decoded = jwt.verify(
          accessToken,
          `${process.env.JWT_SECRET}`
        ) as DecodedToken;
        res
          .status(httpStatus.OK)
          .json({ message: "Token is valid", user: decoded });
      } catch (error) {
        if (error instanceof TokenExpiredError) {
          // Access token is expired, verify the refresh token
          try {
            decoded = jwt.verify(
              refreshToken,
              `${process.env.JWT_REFRESH}`
            ) as DecodedToken;
          } catch (refreshError) {
            if (refreshError instanceof TokenExpiredError) {
              res.status(httpStatus.UNAUTHORIZED).json({
                message: "Unauthorized - refresh token expired",
              });
              return;
            } else {
              res.status(httpStatus.UNAUTHORIZED).json({
                message: "Unauthorized - invalid refresh token",
              });
              return;
            }
          }

          const user = await prisma.user.findUnique({
            where: {
              id: decoded.id,
              refreshToken,
            },
          });

          if (!user) {
            res.status(httpStatus.NOT_FOUND).json({
              message: "User with the provided refresh token doesn't exist",
            });
          }

          const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
            generateTokens(user.id);

          await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken: newRefreshToken },
          });

          res.status(httpStatus.OK).json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          });
        } else {
          res.status(httpStatus.UNAUTHORIZED).json({
            message: "Unauthorized - invalid access token",
          });
        }
      }
    } catch (error: any) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        error: "An error occurred",
        message: error.message,
      });
    }
  }
}

export const userController = new UserController();
