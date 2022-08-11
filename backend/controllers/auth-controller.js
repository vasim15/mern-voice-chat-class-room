const otpService = require("../services/opt-service");
const hashService = require("../services/hash-service");
const userService = require("../services/user-service");
const tokenService = require("../services/token-service");
const UserDto = require("../dtos/user-dto");

class AuthController {
  async sendOtp(req, res) {
    const { phone } = req.body;
    if (!phone) {
      res.status(403).json({ message: "phone field is required" });
    }
    const otp = await otpService.generateOtp();
    console.log("otp", otp);
    const ttl = 1000 * 60 * 2;
    const expires = Date.now() + ttl;
    const data = `${phone}.${otp}.${expires}`;
    const hash = hashService.hashOtp(data);
    try {
      res.status(200).json({
        hash: `${hash}.${expires}`,
        phone,
        otp,
      });

    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "message sending failed" });
    }
  }

  async verifyOtp(req, res) {
    const { hash, phone, otp } = req.body;
    if (!hash || !phone || !otp) {
      res.status(403).json({ message: "All fileds are required" });
    }
    const [hashOtp, expires] = hash.split(".");
    if (Date.now() > +expires) {
      res.status(422).json({ message: "Otp Has Been Expired" });
    }
    const data = `${phone}.${otp}.${expires}`;
    const isValid = otpService.verifyOtp(hashOtp, data);
    if (!isValid) {
      res.status(403).json({ message: "Please Enter Valie Otp" });
    }
    let user;
    try {
      user = await userService.findUser({ phone });
      if (!user) {
        user = await userService.createUser({ phone });
      }
    } catch (err) {
      console.log(err);
      res.status(200).json({ message: "Sonthing went Wrong" });
    }
    const { accessToken, refreshToken } = tokenService.generateToken({
      _id: user._id,
      activated: false,
    });
    await tokenService.storeRefreshToken(refreshToken, user._id);
    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
    });

    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
    });
    const userDto = new UserDto(user);
    res.status(200).json({ user: userDto, auth: true });
  }

  async refresh(req, res) {
    const { refreshToken: refreshTokenfromCookie } = req.cookies;
    let userData;
    try {
      userData = await tokenService.verifyRefreshToken(refreshTokenfromCookie);
      if (!userData) {
        return res.status(401).json({ message: "Invalid Token" });
      }
    } catch (er) {
      console.log(er);
      return res.status(401).json({ message: "invalid token" });
    }
    try {
      const token = await tokenService.findRefreshToken(
        userData._id,
        refreshTokenfromCookie
      );
      if (!token) {
        return res.status(401).json({ message: "Invalid Token" });
      }
    } catch (err) {
      return res.status(500).json({ message: "Internal error" });
    }

    const user = await userService.findUser({ _id: userData._id });
    if (!user) {
      return res.status(404).json({ message: "Invalid User" });
    }
    const { refreshToken, accessToken } = tokenService.generateToken({
      _id: userData._id,
    });
    try {
      await tokenService.updateRefreshToken(userData._id, refreshToken);
      res.cookie("refreshToken", refreshToken, {
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true,
      });

      res.cookie("accessToken", accessToken, {
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true,
      });
      const userDto = new UserDto(user);
      res.status(200).json({ user: userDto, auth: true });
    } catch (err) {
      return res.status(500).json({ message: "Internal error" });
    }
  }

  async logout (req, res){
      const { refreshToken } = req.cookies;
      
      await tokenService.removeToken(refreshToken);
      res.clearCookie('refreshToken');
      res.clearCookie('accessToken');
      res.json({user:null, auth: false});

  }
}
module.exports = new AuthController();
