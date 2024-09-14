import jwt, { verify } from "jsonwebtoken";
import { Document, Types } from "mongoose";
import { IUser } from "../models/user.model";
import ApiError from "../utils/ApiError";
import httpStatus from "http-status";
import { authService } from "../services";
import RefreshToken, { IRefreshToken } from "../models/refreshToken.model";

// Types of tokens our system can generate
type TokenType = "access" | "refresh" | "resetPassword";

// Structure of the JWT payload
interface TokenPayload {
  sub: string;
  type: TokenType;
  iat: number; // Issued at timestamp
  exp: number; // Expiration timestamp
}

interface RefreshTokenDoc extends IRefreshToken, Document {}

// Parameters required to generate a token
interface GenerateTokenParams {
  userId: string;
  expires: Date;
  type: TokenType;
  secret: string;
}

// Structure of the auth tokens object returned to the client
interface AuthTokens {
  access: {
    token: string;
    expires: Date;
  };
  refresh?: {
    token: string;
    expires: Date;
  };
}

// Generate a single token
export const generateToken = ({
  userId,
  expires,
  type,
  secret = process.env.JWT_SECRET!,
}: GenerateTokenParams): string => {
  if (!secret) {
    throw new Error("JWT secret is not defined");
  }

  const payload: TokenPayload = {
    sub: userId,
    type: type,
    exp: expires.getTime() / 1000, // Convert expiration to Unix timestamp
    iat: Date.now() / 1000, // Set issued at to current time
  };

  // Sign the token with the payload and secret
  return jwt.sign(payload, secret);
};

// Generate auth tokens (access and optionally refresh)
export const generateAuthTokens = async (
  user: Document & IUser
): Promise<AuthTokens> => {
  // Calculate expiration time for access token
  const accessTokenExpires = new Date(
    Date.now() + Number(process.env.JWT_ACCESS_EXPIRATION_MINUTES!) * 60 * 1000
  );

  const accessToken = generateToken({
    userId: user._id!.toString(),
    expires: accessTokenExpires,
    type: "access",
    secret: process.env.JWT_ACCESS_SECRET!,
  });

  // Prepare the tokens object with access token
  const tokens: AuthTokens = {
    access: {
      token: accessToken,
      expires: accessTokenExpires,
    },
  };

  // If refresh token expiration is set, generate a refresh token
  if (process.env.JWT_REFRESH_EXPIRATION_DAYS!) {
    const refreshTokenExpires = new Date(
      Date.now() +
        Number(process.env.JWT_REFRESH_EXPIRATION_DAYS) * 24 * 60 * 60 * 1000
    );
    const refreshToken = generateToken({
      userId: user._id!.toString(),
      expires: refreshTokenExpires,
      type: "refresh",
      secret: process.env.JWT_REFRESH_SECRET!,
    });

    // Store the refresh token in the database
    await RefreshToken.findOneAndUpdate(
      { user: user._id },
      {
        token: refreshToken,
        expires: refreshTokenExpires,
      },
      { upsert: true, new: true }
    );

    tokens.refresh = {
      token: refreshToken,
      expires: refreshTokenExpires,
    };
  }

  return tokens;
};

export const verifyToken = async (
  token: string,
  type: "access" | "refresh"
): Promise<RefreshTokenDoc> => {
  let secret: string;
  if (type === "access") {
    secret = process.env.JWT_ACCESS_SECRET!;
  } else {
    secret = process.env.JWT_REFRESH_SECRET!;
  }

  try {
    const payload = jwt.verify(token, secret) as TokenPayload;

    if (payload.type !== type) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid token type");
    }
    const refreshTokenDoc = await RefreshToken.findOne({
      // token,
      user: new Types.ObjectId(payload.sub),
    }).exec();

    if (!refreshTokenDoc) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Token not found");
    }
    return refreshTokenDoc as RefreshTokenDoc;
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid Token");
  }
};

export const refreshAuthTokens = async (refreshToken: string) => {
  try {
    const refreshTokenDoc = await verifyToken(refreshToken, "refresh");

    const user = await authService.getUserById(
      refreshTokenDoc.user!.toString()
    );

    if (!user) {
      throw new Error("User not found");
    }
    await RefreshToken.deleteOne({ _id: refreshTokenDoc._id });
    return generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate");
  }
};
