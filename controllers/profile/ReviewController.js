import bcrypt from "bcrypt";
import prisma from "../../config/db.config.js";
import Validator from '../../validator/Validator.js'


class ReviewController {

  static async index(req, res) { 

     try {

        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 5;

        const totalItems = await prisma.review.count({
        where : {
            user_id : req.user.id,
        }
        }); 
        const totalPages = Math.ceil(totalItems / pageSize);

        const user = await prisma.user.findUnique({
            
            where : {
                id : req.user.id
            },
            select : {
                name : true,
                email : true,
                phone : true,
                address : true
            }
        });
        const reviews = await prisma.review.findMany({
            skip: (page - 1) * pageSize,
            take: pageSize,
            where : {
                user_id : req.user.id
            },
            include: {
                event: {
                  select : {
                    id : true,
                    title : true,
                    ticket_price : true,
                    no_sites : true,
                    booked_sites : true,
                    image : true,
                    arrange_time : true,
                    duration : true,
                  }
                },
                user : {
                    select : {
                        id : true,
                        name : true,
                        image : true
                    }
                } 
              },
        });
        return res.status(200).json({
            reviews : reviews,
            totalItems,
            totalPages,
            currentPage: page,
            pageSize,
        });
    } catch (error) {
        return res.status(401).json({ message: "Something wents to wrong!!" });
    }
  }

  static async store(req, res) { 
    
    try {

       const {event_id,comment,rating} = req.body;
       
       const store_review = await prisma.review.create({
        data: {
            user_id : req.user.id,
            event_id : parseInt(event_id),
            comment : comment,
            rating : parseFloat(rating)
          },
       });
       return res.status(200).json({
           message : "Successfully save to store your review!",
           review : store_review
       });
       } catch (error) {
           return res.status(401).json({ message: "Something wents to wrong!!" });
       }
 }
 static async destroy(req, res) { 
    
    try {
      const Id = parseInt(req.params.id);
       const check_review = await prisma.review.delete({
        where: {
            id : Id
          }
       });
       if(!check_review){
         return res.status(400).json({message:"Item not found in your riview!"});
       }
       return res.status(200).json({
           message : "Successfully delete from review list!",
       });
       } catch (error) {
           return res.status(401).json({ message: "Something wents to wrong!!" });
       }
    }
}
export default ReviewController;
