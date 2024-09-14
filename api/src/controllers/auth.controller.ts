import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync";
import { authService, tokenService } from "../services";
import { Response, Request } from "express";
import ApiError from "../utils/ApiError";
import { IUser } from "../models/user.model";

const isProduction = process.env.NODE_ENV === "production";

export const register = catchAsync(async (req: Request, res: Response) => {
  const { firstname, lastname, username, email, password } = req.body;

  const response = (await authService.register({
    firstname,
    lastname,
    username,
    email,
    password,
  })) as IUser;

  const user = { ...response.toObject() };

  delete user.hashedPassword;
  delete user.__v;
  delete user.updatedAt;

  res.status(httpStatus.CREATED).send({
    user,
  });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  const response = await authService.login(password, email, username);

  const user = { ...response.toObject() };

  delete user.hashedPassword;
  delete user.__v;
  delete user.updatedAt;

  // Generate access and refresh tokens
  const tokens = await tokenService.generateAuthTokens(user);

  // Set cookies
  res.cookie("access_token", tokens.access.token, {
    httpOnly: true, // Prevents client-side JavaScript from accessing the cookie, which is crucial for security.
    secure: isProduction, // Use secure cookies in production
    sameSite: isProduction ? "none" : "lax", // Must be 'none' to enable cross-site delivery
    maxAge: 15 * 60 * 1000, // 15 minutes
    path: "/api/v1", // This matches your API path structure
    domain: isProduction ? "domainname" : "localhost", // Adjust in production
  });

  res.cookie("refresh_token", tokens.refresh!.token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
    path: "/api/v1",
    domain: isProduction ? "domainname" : "localhost",
  });

  res.status(httpStatus.OK).send({
    user,
  });
});

export const logout = catchAsync(async (req: Request, res: Response) => {
  // Clear access_token cookie
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/api/v1",
    domain:
      process.env.NODE_ENV === "production" ? "your-domain.com" : "localhost",
  });

  // Clear refresh_token cookie
  res.clearCookie("refresh_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/api/v1",
    domain:
      process.env.NODE_ENV === "production" ? "your-domain.com" : "localhost",
  });

  res.status(httpStatus.OK).send({ message: "Logged out successfully" });
});

export const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refresh_token;

  if (!refreshToken) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Refresh token not found");
  }

  const tokens = await tokenService.refreshAuthTokens(refreshToken);

  res.cookie("access_token", tokens.access.token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 15 * 60 * 1000,
    path: "/api/v1",
    domain: isProduction ? "domanin name" : "localhost",
  });

  res.cookie("refresh_token", tokens.refresh!.token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 3 * 24 * 60 * 60 * 1000,
    path: "/api/v1",
    domain: isProduction ? "domanin name" : "localhost",
  });

  res.status(httpStatus.OK).send({ message: "Tokens refreshed successfully" });
});

export const checkAuth = catchAsync(async (req: Request, res: Response) => {
  const accessToken = req.cookies.access_token;
  const refreshToken = req.cookies.refresh_token;

  if (!accessToken && !refreshToken) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Not authenticated");
  }

  try {
    // First, try to verify the access token
    const userData = await tokenService.verifyToken(accessToken, "access");
    const user = (await authService.getUserById(
      userData.user.toString()
    )) as IUser;

    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }
    // If successful, send user data
    const userResponse = { ...user.toObject() };
    delete userResponse.hashedPassword;
    delete userResponse.__v;
    delete userResponse.updatedAt;

    res.status(httpStatus.OK).send({ user: userResponse });
  } catch (error) {
    // If access token is invalid, try refreshing tokens
    if (refreshToken) {
      try {
        const tokens = await tokenService.refreshAuthTokens(refreshToken);

        // Set new cookies
        res.cookie("access_token", tokens.access.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
          maxAge: 15 * 60 * 1000,
          path: "/api/v1",
          domain:
            process.env.NODE_ENV === "production"
              ? "your-domain.com"
              : "localhost",
        });

        res.cookie("refresh_token", tokens.refresh!.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
          maxAge: 3 * 24 * 60 * 60 * 1000,
          path: "/api/v1",
          domain:
            process.env.NODE_ENV === "production"
              ? "your-domain.com"
              : "localhost",
        });

        // Fetch and return user data
        const userData = await tokenService.verifyToken(
          tokens.access.token,
          "access"
        );

        const user = (await authService.getUserById(
          userData.user.toString()
        )) as IUser;

        if (!user) {
          throw new ApiError(httpStatus.NOT_FOUND, "User not found");
        }

        const userResponse = { ...user.toObject() };
        delete userResponse.hashedPassword;
        delete userResponse.__v;
        delete userResponse.updatedAt;

        res.status(httpStatus.OK).send({ user: userResponse });
      } catch (error) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid refresh token");
      }
    } else {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid access token");
    }
  }
});
