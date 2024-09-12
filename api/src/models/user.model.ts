import mongoose, { Schema, Document, Model } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  _id: string;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  hashedPassword: string;
  isPasswordMatch: (password: string) => Promise<boolean>;
}

const UserSchema: Schema<IUser> = new mongoose.Schema<IUser>(
  {
    firstname: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
    },
    lastname: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
    },
    username: {
      type: String,
      unique: true,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      required: true,
      validate: {
        validator: (value: string) => validator.isEmail(value),
        message: "Invalid Email Address",
      },
    },
    hashedPassword: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

interface IUserModel extends Model<IUser> {
  isEmailTaken: (email: string) => Promise<boolean>;
}

UserSchema.statics.isEmailTaken = async function (email: string) {
  // static method to check if an email is already taken in the database
  const user = await this.findOne({ email: email });
  // Returns true if user exists, otherwise false
  return !!user;
};

UserSchema.methods.isPasswordMatch = async function (password: string) {
  const user = this;
  return await bcrypt.compare(password, user.hashedPassword);
};

const UesrModel: IUserModel = mongoose.model<IUser, IUserModel>(
  "User",
  UserSchema
);

export default UesrModel;
