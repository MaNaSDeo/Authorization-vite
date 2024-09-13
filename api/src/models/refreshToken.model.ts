import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./user.model";

export interface IRefreshToken extends Document {
  token: string;
  user: mongoose.Types.ObjectId | IUser;
  expires: Date;
}

const refreshTokenSchema = new Schema({
  token: { type: String, required: true, unique: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  expires: { type: Date, required: true },
});

const RefreshToken = mongoose.model<IRefreshToken>(
  "RefreshToken",
  refreshTokenSchema
);

export default RefreshToken;
