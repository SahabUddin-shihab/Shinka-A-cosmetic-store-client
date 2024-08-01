import bcrypt from "bcrypt";
import prisma from "../../config/db.config.js";
import Validator from '../../validator/Validator.js'
import generateToken from "../../utils/GenerateToken.js";

class ProfileController {

    static async profile(req, res) { 

        try {
            const user_info = await prisma.user.findUnique({
                where: {
                    id : req.user.id
                },
                select : {
                    id : true,
                    name : true,
                    email : true,
                    phone : true,
                    country : true,
                    city : true,
                    address : true,
                    postal_code : true,
                    image : true,
                }
            });
            return res.status(200).json({ user_info: user_info });
    
          } catch (error) {
              return res.status(401).json({ message: "Something wents to wrong!!" });
          }
        }
    
     static async cities(req, res) { 

        try {
            const cities = await prisma.city.findMany({});
            return res.status(200).json({ cities : cities });
    
          } catch (error) {
              return res.status(401).json({ message: "Something wents to wrong!!" });
          }
        }
  
  static async chnage_password(req, res) { 

    try {
        const isValidate = await Validator.chnagepasswordValidation(req.body);
        if (isValidate.success != true) {
            return res.status(400).json({ errors: isValidate });
        }

        const {old_password, new_password} = req.body;
        const user = await prisma.user.findUnique({
            where: {
                id : req.user.id
            },
            select : {
                password : true,
            }
        });
        if (bcrypt.compareSync(old_password, user.password)) {
           await prisma.user.update({
            where : {
                id : req.user.id
            },
            data : {
                password :bcrypt.hashSync(new_password, 15) 
            }
           });
        return res.status(200).json({ message: "Successfully update password!" });

        }
        return res.status(401).json({ message: "Your old password does not match" });

      } catch (error) {
          return res.status(401).json({ message: "Something wents to wrong!!" });
      }
    }

    static async update_profile(req, res) { 

        try {
            const {user_id,name, email, phone,address,country,city,postal_code,image} = req.body;

            const isValidate = await Validator.updateuserinfoValidation(req.body);
            if (isValidate.success != true) {
                return res.json({ errors: isValidate });
            }
            const updated_profile = await prisma.user.update({
                where: {
                    id : parseInt(user_id),
                },
                data : {
                    name : name,
                    email : email,
                    phone : phone,
                    address : address,
                    country : country,
                    city : city,
                    postal_code : postal_code,
                    image : image
                },
                select : {
                    name : true,
                    email : true,
                    phone : true,
                    country : true,
                    city : true,
                    postal_code : true,
                    address : true,
                    image : true
                }
            });
            return res.json({ message: "Successfully update your profile!",updated_profile });
    
          } catch (error) {
              return res.json({ message: "Something wents to wrong!!" });
          }
    }   
}

export default ProfileController;
