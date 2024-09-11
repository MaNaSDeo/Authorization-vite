import httpStatus from "http-status";
import ApiError from "../utils/ApiError";

export const register = async (userBody: any) => {
  return userBody;
};

export const login = async (email: string, password: string) => {
  return { message: "Login successful" };
};
