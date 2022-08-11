const jwt = require("jsonwebtoken");
const tokenModel = require("../models/token-model");
const RefreshTokenModel = require("../models/token-model");

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

class TokenService {
  generateToken(payload) {
    const accessToken = jwt.sign(payload, accessTokenSecret, {
      expiresIn: "1m",
    });
    const refreshToken = jwt.sign(payload, refreshTokenSecret, {
      expiresIn: "1y",
    });
    return { accessToken, refreshToken };
  }
  async storeRefreshToken(token, userId) {
    try {
      await RefreshTokenModel.create({ token, userId });
    } catch (err) {
      console.log(err);
    }
  }
  async verifyAccessToken(token) {
    return await jwt.verify(token, accessTokenSecret);
  }
  async verifyRefreshToken(token) {
    return await jwt.verify(token, refreshTokenSecret);
  }
  async findRefreshToken(userId, token) {
    return await tokenModel.findOne({
      userId,
      token,
    });
  }
  async updateRefreshToken(userId, token) {
    return await tokenModel.updateOne({
      userId,
      token,
    });
  }
  async removeToken(token) {
    return tokenModel.deleteOne({ token });
  }
}

module.exports = new TokenService();
