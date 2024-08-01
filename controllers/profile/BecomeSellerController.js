import bcrypt from "bcrypt";
import prisma from "../../config/db.config.js";
import Validator from '../../validator/Validator.js'
import generateToken from "../../utils/GenerateToken.js";
import RandomNumber from "../../utils/RandomNumber.js";
import nodemailer from "nodemailer";

class BecomeSellerController {

  static async become_seller(req, res) { 

    try {
        const {
            user_id,
            company_first_name,
            company_last_name,
            company_email,
            company_phone,
            company_country,
            company_city,
            company_address,
            website_url,
            tax_id,
            google_map,
            company_logo,
            company_document,
            facebook_url,
            twitter_url,
            instagram_url,
            youtube_url,
            is_agree,
            description
        } = req.body;

        const isValidate = await Validator.becomeSellerValidation(req.body);
        if (isValidate.success != true) {
            return res.json({ errors: isValidate });
        }
        const is_exist = await prisma.user.findFirst({
            where : {
                company_email : company_email
            }
        });
      
        if(is_exist){
            return res.json('You already request to becoame an organizer! Please wait for approve.');
        }
        const organizer = await prisma.user.update({
            where : {
                id : parseInt(user_id),
            },
            data : {
                company_first_name : company_first_name,
                company_last_name : company_last_name,
                company_email : company_email,
                company_phone : company_phone,
                company_country : company_country,
                company_city : company_city,
                company_address : company_address,
                website_url : website_url,
                tax_id : tax_id || 12345,
                google_map : google_map,
                company_logo : company_logo || LoginController.png,
                company_document : company_document || document.png,
                facebook_url : facebook_url,
                twitter_url : twitter_url,
                instagram_url : instagram_url,
                youtube_url : youtube_url,
                is_agree : parseInt(is_agree),
                is_approve : 0,
                description : description
            },
        });
      
        
        return res.json({ message: "Your request has been successfully send to admin!", });

      } catch (error) {
          return res.status(401).json({ message: "Something wents to wrong!!" });
      }
    }


    static async seller_request_status(req, res) { 

        try {
           
            const user = await prisma.user.findFirst({
                where : {
                    id : req.user.id
                },
                select : {
                    id : true,
                    company_first_name : true,
                    company_last_name : true,
                    company_email : true,
                    company_phone : true,
                    company_country : true,
                    company_city : true,
                    company_address : true,
                    website_url : true,
                    tax_id : true,
                    google_map : true,
                    company_logo : true,
                    company_document : true,
                    facebook_url : true,
                    twitter_url : true,
                    instagram_url : true,
                    youtube_url : true,
                    is_agree : true,
                    is_approve : true,
                    description : true
                  },
            });
            if(user.company_email === '' || user.company_email === null){
                return res.status(200).json('You are not request to be a seller yet!.');
            }
            return res.json({ 
                'become_seller_data' : user
             });
    
          } catch (error) {
              return res.status(401).json({ message: "Something wents to wrong!!" });
          }
        }   

    static async update_profile(req, res) { 

        try {
            const isValidate = await Validator.updateuserinfoValidation(req.body);
            if (isValidate.success != true) {
                return res.status(400).json({ errors: isValidate });
            }
            const {name, email, phone, address} = req.body;
            await prisma.user.update({
                where: {
                    id : req.user.id
                },
                data : {
                    name : name,
                    email : email,
                    phone : phone,
                    address : address
                }
            });
            return res.status(200).json({ message: "Successfully update profile!" });
    
          } catch (error) {
              return res.status(401).json({ message: "Something wents to wrong!!" });
          }
    }
  static async become_seller_mobile(req, res) { 
       
        try {
            const {
                name,
                email,
                password,
                company_first_name,
                company_last_name,
                company_email,
                company_phone,
                company_country,
                company_city,
                company_address,
                website_url,
                tax_id,
                google_map,
                company_logo,
                company_document,
                facebook_url,
                twitter_url,
                instagram_url,
                youtube_url,
                is_agree,
                description
            } = req.body;
    
            const isValidate = await Validator.becomeSellerValidationMobile(req.body);
            if (isValidate.success != true) {
                return res.json({ errors: isValidate });
            }
            
            const is_exist = await prisma.user.findFirst({
                where : {
                    email : email
                }
            });
            
            const hashPassword = bcrypt.hashSync(password, 15);
            if(is_exist){
                return res.json('Account already exist under this email!');
            }
            const verified_token = RandomNumber(10000000,99999999);
            const verified_link = req.protocol+"://"+req.headers.host+"/auth/account/verified/"+verified_token;

            const organizer = await prisma.user.create({
               
                data : {
                    name : name,
                    email : email,
                    password: hashPassword,
                    email_verified : null,
                    is_organizer : 0,
                    is_approved : 0,
                    verified_token : verified_token,
                    company_first_name : company_first_name,
                    company_last_name : company_last_name,
                    company_email : company_email,
                    company_phone : company_phone,
                    company_country : company_country,
                    company_city : company_city,
                    company_address : company_address,
                    website_url : website_url,
                    tax_id : tax_id,
                    google_map : google_map,
                    company_logo : company_logo,
                    company_document : company_document,
                    facebook_url : facebook_url,
                    twitter_url : twitter_url,
                    instagram_url : instagram_url,
                    youtube_url : youtube_url,
                    is_agree : parseInt(is_agree),
                    is_approve : 0,
                    description : description
                },
            });

            const mail_credentials = await prisma.email.findFirst({});
            const transporter = nodemailer.createTransport({
              host: mail_credentials.mail_host,
              port: mail_credentials.mail_port,
              secure: false, // true for 465, false for other ports
              auth: {
                user: mail_credentials.smtp_username,
                pass: mail_credentials.smtp_password
              }
            });
      
            // Set up email options
            const mailOptions = {
              from: mail_credentials.email_from,
              to: email,
              subject: 'User Registration - Verify Your Email',
              html: `Please verify your email by clicking this link: <a href="${verified_link}">Verify Email</a>`
            };
      
            // Send the email asynchronously
            let success = true;
            try {
              await transporter.sendMail(mailOptions);
              console.log('Verification email sent successfully');
            } catch (emailError) {
              console.error('Error sending verification email:', emailError);
              success = false;
            }
          
            
            return res.json({ message: "Your account is created and your request has been successfully send to admin. Please verify your account", });
    
          } catch (error) {
              return res.status(401).json({ message: "Something wents to wrong!!" });
          }
    }
}

export default BecomeSellerController;
