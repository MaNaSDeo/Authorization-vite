import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync";
import { authService, tokenService } from "../services";
import { Response, Request } from "express";
import ApiError from "../utils/ApiError";

const isProduction = process.env.NODE_ENV === "production";

export const register = catchAsync(async (req: Request, res: Response) => {
  const { firstname, lastname, username, email, password } = req.body;

  const user = await authService.register({
    firstname,
    lastname,
    username,
    email,
    password,
  });

  res.status(httpStatus.CREATED).send({
    user: {
      firstname: user.firstname,
      lastname: user.lastname,
      username: user.username,
      email: user.email,
    },
  });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  const user = await authService.login(password, email, username);

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
    user: {
      firstname: user.firstname,
      lastname: user.lastname,
      username: user.username,
      email: user.email,
    },
  });
});

export const logout = catchAsync(async (req: Request, res: Response) => {
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");

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
