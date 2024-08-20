import jwt from 'jsonwebtoken';
import generateToken from "../../utils/GenerateToken.js";
import prisma from "../../config/db.config.js";

class LoginController {
  static async googleAuth(req, res) {
  
    const user = req.user;
    const token = generateToken(user); 
    res.redirect(`http://localhost:3000/${token}`);

  }
  static async getUserFromToken(res,req){

    const getToken = req.params.token;
    const decoded = jwt.verify(getToken, process.env.JWT_SECRET);
    const userId = decoded.id;
    const user = await prisma.user.findUnique({
      where : {
        id : userId
      }
    })
    const token = generateToken(user);
    return res.json({
      user : {
          id : user.id,
          name : user.name,
          email : user.email,
          image : user.image
      },
      token,
      user_type : 'user',
      message: "Logged in successfully!",
    });

  }
}
export default LoginController;
