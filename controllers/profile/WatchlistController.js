import bcrypt from "bcrypt";
import prisma from "../../config/db.config.js";
import Validator from '../../validator/Validator.js'
import generateToken from "../../utils/GenerateToken.js";

class WatchlistController {

  static async index(req, res) { 

     try {

        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 5;

        const totalItems = await prisma.wishlist.count({
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
        const watchlists = await prisma.wishlist.findMany({
           
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
                    user : {
                      select : {
                        id : true,
                        name : true,
                        image : true
                      }
                    }
                  }
                }, 
              },
        });
        return res.status(200).json({
            watchlists : watchlists,
        });
        } catch (error) {
            return res.status(400).json({ message: "Something wents to wrong!!" });
        }
  }

  static async store(req, res) { 
    
    try {

       const {event_id} = req.body;
       const check_wishlist = await prisma.wishlist.findFirst({
        where: {
            user_id : req.user.id,
            event_id : parseInt(event_id)
          }
       });

       if(check_wishlist){
         return res.status(400).json({message:"Already added this item"});
       }
       const store_watchlist = await prisma.wishlist.create({
        data: {
            user_id : req.user.id,
            event_id : parseInt(event_id),
          },
       });
       return res.status(200).json({
           message : "Successfully save to watch list!",
           watchlists : store_watchlist
       });
       } catch (error) {
           return res.status(400).json({ message: "Something wents to wrong!!" });
       }
 }
 static async destroy(req, res) { 
    
  try {

    const Id = parseInt(req.params.id);
     const check_wishlist = await prisma.wishlist.delete({
      where: {
          id : Id
        }
     });
     if(!check_wishlist){
       return res.status(400).json({message:"Item not found in your wishlist!"});
     }
     return res.status(200).json({
         message : "Successfully delete from watch list!",
     });
     } catch (error) {
         return res.status(400).json({ message: "Something wents to wrong!!" });
     }
  }
}

export default WatchlistController;
