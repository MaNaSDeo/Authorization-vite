import httpStatus from "http-status";
import ApiError from "../utils/ApiError";
import User, { type IUser } from "../models/user.model";
import bycrpt from "bcryptjs";
import { Document } from "mongoose";

export interface RegisterProps {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
}

const saltRounds = Number(process.env.SALT_ROUND)!;

export const register = async ({
  firstname,
  lastname,
  username,
  email,
  password,
}: RegisterProps) => {
  if (!email || !firstname || !lastname || !password || !username) {
    throw new ApiError(httpStatus.BAD_REQUEST, "All fields are required");
  }

  if (await User.isEmailTaken(email)) {
    throw new ApiError(httpStatus.CONFLICT, "Email already in use");
  }

  if (await User.findOne({ username })) {
    throw new ApiError(httpStatus.CONFLICT, "Username already in use");
  }

  const salt = await bycrpt.genSalt(saltRounds);
  const hashedPassword = await bycrpt.hash(password, salt);

  const user = await User.create({
    firstname,
    lastname,
    username,
    email,
    hashedPassword,
  });

  return user;
};

export const login = async (
  password: string,
  email?: string,
  username?: string
): Promise<IUser & Document> => {
  const user = await User.findOne({ $or: [{ email }, { username }] });

  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect credentials");
  }

  return user;
};
