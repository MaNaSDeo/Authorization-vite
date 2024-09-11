import httpStatus from "http-status";
import ApiError from "../utils/ApiError";
import catchAsync from "../utils/catchAsync";
import { authService } from "../services";
import { Response, Request } from "express";

export const register = catchAsync(async (req: Request, res: Response) => {
  const user = await authService.register(req.body);
  res.status(httpStatus.CREATED).send({ user });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await authService.login(email, password);
  res.send({ user });
});
