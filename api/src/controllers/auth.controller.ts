import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync";
import { authService, tokenService } from "../services";
import { Response, Request } from "express";

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

  const tokens = await tokenService.generateAuthTokens(user);

  // Convert user document to a plain object and remove sensitive fields
  const userResponse = user.toObject();
  delete userResponse.password;
  delete userResponse.__v;

  res.status(httpStatus.OK).send({ user: userResponse, tokens });
});
