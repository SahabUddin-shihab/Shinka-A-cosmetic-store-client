import { json } from "express";
import prisma from "../config/db.config.js";
import send_mail from "../config/Mail.js";
import nodemailer from "nodemailer";
import Validator from '../validator/Validator.js';
import session from "express-session";

class HomeController {

  static async index(req, res) {
    try {

       
        const categories = await prisma.category.findMany({
            where: { 
                status : 1
            },
            select : {
                id : true,
                name : true,
                icon : true,
                slug : true,
                _count : {
                  select : {
                    event : true,
                  },
                },
            },
        });

        
       
        const sliders = await prisma.slider.findMany({
            where : {
                status : 1,
            },
            select : {
              id : true,
              image : true,
              link : true
            }
        });

       
        
        let cat_id = 1;
        const cat = await prisma.category.findFirst({});
        if(cat){
          cat_id = cat.id
        }
        const subcategory = await prisma.subcategory.findMany({
                where : {
                   category_id  : cat_id,
                   status : 1,
                },
                select : { 
                    id : true,
                    name : true,
                    slug : true,
                    icon : true,
                    _count : {
                      select : {
                        event : true,
                      },
                    },
                },
                
            
        });
        
        const currentDate = new Date().toISOString();
        const trending_events = await prisma.event.findMany({
          include: {
            user: {
              select : {
                id : true,
                name : true,
                image : true
              }
            }, 
            category: {
              select : {
                name : true,
              }
            }, 
            subcategory: {
              select : {
                name : true,
              }
            },
            venue : {
              select : {
                id : true,
                name : true,
                seat : true,
                address : true,
                google_map : true,
                latitude : true,
                longitude : true,
                venu_tickets : {
                  select : {
                    id : true,
                    name : true,
                    seats : true
                  }
                },
                country : {
                  select : {
                    id : true,
                    name : true
                  }
                },
                state : {
                  select : {
                    id : true,
                    country_id : true,
                    name : true
                  }
                },
                city : {
                  select : {
                    id : true,
                    name : true
                  }
                }
              }
            },
            specification : {
              select : {
                id : true,
                venue_id : true,
                ticket_id : true,
                level : true,
                price : true,
              }
            }
          },
          orderBy :{
            views : 'desc',
          },
          where : {
            arrange_time : {
              gt: currentDate,
            },
          },
          take : 3
        });
       
        const populer_events = await prisma.event.findMany({
          include: {
            user: {
              select : {
                id : true,
                name : true,
                image : true
              }
            }, 
            category: {
              select : {
                name : true,
              }
            }, 
            subcategory: {
              select : {
                name : true,
              }
            },
            venue: {
              select : {
                name : true,
              }
            }, 
            ticket_type: {
              select : {
                name : true,
              }
            },
          },
          orderBy : {
            booked_sites : 'desc'
          },
          where : {
            arrange_time : {
              gt: currentDate,
            },
          },
          take : 3
        });


        
        const all_letest_events = await prisma.event.findMany({
          include: {
            user: {
              select : {
                id : true,
                name : true,
              }
            }, 
            category: {
              select : {
                name : true,
              }
            }, 
            subcategory: {
              select : {
                name : true,
              }
            },
            venue : {
              select : {
                id : true,
                name : true,
                seat : true,
                address : true,
                google_map : true,
                latitude : true,
                longitude : true,
                venu_tickets : {
                  select : {
                    id : true,
                    name : true,
                    seats : true
                  }
                },
                country : {
                  select : {
                    id : true,
                    name : true
                  }
                },
                state : {
                  select : {
                    id : true,
                    country_id : true,
                    name : true
                  }
                },
                city : {
                  select : {
                    id : true,
                    name : true
                  }
                }
              }
            },
            specification : {
              select : {
                id : true,
                venue_id : true,
                ticket_id : true,
                level : true,
                price : true,
              }
            },
            ticket_type: {
              select : {
                name : true,
              }
            },
          },
          orderBy : {
            id : 'desc'
          },
          where : {
            arrange_time : {
              gt: currentDate,
            },
          },
          take : 9,
        });

        const banner = await prisma.ads.findMany({
          where: {
            id: {
              in: [4,5] 
            }
          }
        });
        const footer_banner = await prisma.footer_banner.findFirst({});

      
      return res.status(200).json({
        categories : categories,
        sliders : sliders,
        subcategory : subcategory,
        recent_events : trending_events,
        populer_events : populer_events,
        all_letest_events : all_letest_events,
        banner : banner,
        cta : footer_banner
       
      });


    } catch (error) {
      return res.status(500).json({ message: "Something went wrong." });
    }
  }

  static async websiteSetup(req, res) {

    try {
        const categories = await prisma.category.findMany({
            where: { 
                status : 1
            },
            select : {
                id : true,
                name : true,
                icon : true
            }
        });

      const subcategories = await prisma.subcategory.findMany({
        where: { 
            status : 1
        },
        select : {
            id : true,
            name : true,
            slug : true,
            icon : true,
            _count : {
                    select : {
                      event : true,
                    },
                  },
        }
      });

      let maximum_price = 0;
      const maxPriceEvent = await prisma.event.findFirst({
            orderBy: {
                ticket_price: 'desc'
            }
        });
        if(maxPriceEvent){
          maximum_price = maxPriceEvent.ticket_price;
        }  

        const currentDate = new Date().toISOString();
        const featured_event = await prisma.event.findMany({
          where : {
            is_feature : 1,
          },
          include: {
            user: {
              select : {
                id : true,
                name : true,
                image : true,
              }
            }, 
            category: {
              select : {
                name : true,
              }
            }, 
            subcategory: {
              select : {
                name : true,
              }
            },
            venue: {
              select : {
                name : true,
              }
            }, 
            ticket_type: {
              select : {
                name : true,
              }
            },
          },
          orderBy : {
            booked_sites : 'desc'
          },
          where : {
            arrange_time : {
              gt: currentDate,
            },
          },
          take : 3
        });
        const sidebar_banner = await prisma.ads.findFirst({
          where : {
            status : 1
          }
        });
        const footers = await prisma.footer.findMany({
            include: {
                footer_item: {
                    select : {
                        id : true,
                        name : true,
                        link : true,
                    },
                },
              },
        });
        const social_medias = await prisma.social_media.findMany({
            where : {
                status : 1,
            },
            select : {
                name : true,
                icon : true,
                link : true,
                status : true
            }
        });
        const settings = await prisma.setting.findFirst({});

      const footer_banner = await prisma.footer_banner.findFirst({});

      return res.status(200).json({
        categories : categories,
        subcategories : subcategories,
        featured_event : featured_event,
        sidebar_banner : sidebar_banner,
        footers : footers,
        social_medias : social_medias,
        setting : settings,
        cta : footer_banner,
        maxPrice : maximum_price
      });

    } catch (error) {
      return res.status(500).json({ message: "Something went wrong." });
    }
  }

  static async about_us(req, res) {

    try {

        const about_us = await prisma.about.findFirst({});
        return res.status(200).json({about_us : about_us,});

    } catch (error) {
      return res.status(500).json({ message: "Something went wrong." });
    }
  }

  static async contact_us(req, res) {

    try {
        const contact_us = await prisma.contact.findFirst({});

        return res.status(200).json({contact_us : contact_us,});

    } catch (error) {
      return res.status(500).json({ message: "Something went wrong." });
    }
  }

  static async terms_condition(req, res) {

    try {
        const terms_condition = await prisma.terms.findFirst({});

        return res.status(200).json({terms_condition : terms_condition});

    } catch (error) {
      return res.status(500).json({ message: "Something went wrong." });
    }
  }

  static async privacy(req, res) {

    try {
        const privacy_data = await prisma.privacy.findFirst({});

        return res.status(200).json({privacy_data : privacy_data,});

    } catch (error) {
      return res.status(500).json({ message: "Something went wrong." });
    }
  }

  
  static async events(req, res) {
    
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 9;

      const currentDate = new Date().toISOString();

      const sort_by = req.query.sort_by;
      const category_id = req.query.category_id;
      const country_id = req.query.country_id;
      const state_id = req.query.state_id;
      const city_id = req.query.city_id;
      const price = req.query.price;
      const search = req.query.search;
      const price_filter = req.query.price_filter;

      
      
      let where = {
        arrange_time : {
          gt: currentDate,
        },
      };
    
      if (category_id) {
        where.category_id = parseInt(category_id);
      }

      if (country_id) {
        where.country_id = parseInt(country_id);
      }
      if (state_id) {
        where.state_id = parseInt(state_id);
      }
      if (city_id) {
        where.city_id = parseInt(city_id);
      }
      if (price) {
        where.ticket_price = {
          lte: parseFloat(price)
        };
      }

      if (search) {
      where.OR = [
        { title: { contains: search.trim() } },
        ];
      }

      let orderBy = {};
      if (sort_by === 'newest') {
        orderBy = { id: 'desc' };
      } else if (sort_by === 'oldest') {
        orderBy = { id: 'asc' };
      } else {
        orderBy = { id: 'desc' }; 
      }

      if(price_filter == 'high_to_low'){
          orderBy ={ticket_price : 'desc'} 
      }else{
        orderBy ={ticket_price : 'asc'}
      }
      //return res.json(where);

      const events = await prisma.event.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy,
        where,
        select: {
          id : true,
          title: true,
          slug: true,
          ticket_price: true,
          no_sites: true,
          booked_sites: true,
          created_at: true,
          category_id: true,
          country_id : true,
          state_id : true,
          city_id: true,
          image : true,
          arrange_time : true,
          duration : true,
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            }
          }
        }
        });

      const totalItems = await prisma.event.count({ where });
        const totalPages = Math.ceil(totalItems / pageSize);
      
      return res.status(200).json({
        letest_events : events,
        totalItems,
        totalPages,
        currentPage: page,
        pageSize,
      });

    } catch (error) {
      return res.status(500).json({ message: "Something went wrong." });
    }
  }
  static async search(req, res) {
    
    try {
     
      const subcategories = await prisma.subcategory.findMany({
          where : {
            status : 1
          },
          select : {
            id : true,
            name : true,
            slug :true
          }
        });
      const cities = await prisma.city.findMany({
        select : {
          id : true,
          name : true
        }
      });
      return res.status(200).json({
        subcategories : subcategories,
        cities : cities,
      });

    } catch (error) {
      return res.status(500).json({ message: "Something went wrong." });
    }
  }
  static async latest_events(req, res) {

    try {
      let start, end;
      const now = new Date();

      const {timeFrame} = req.query;

      switch (timeFrame) {
        case 'today':
          start = new Date();
          start.setHours(0, 0, 0, 0);
          end = new Date();
          end.setHours(23, 59, 59, 999);
          break;
          
        case 'tomorrow':
          start = new Date(now);
          start.setDate(now.getDate() + 1);
          start.setHours(0, 0, 0, 0);
          end = new Date(now);
          end.setDate(now.getDate() + 1);
          end.setHours(23, 59, 59, 999);
          break;
          
        case 'this_week':
          const dayOfWeek = now.getDay(); // Get current day of the week (0 is Sunday, 1 is Monday, etc.)
          start = new Date(now);
          start.setDate(now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)); // Adjust when it's Sunday
          start.setHours(0, 0, 0, 0);
          end = new Date(start);
          end.setDate(start.getDate() + 6); // End of the week
          end.setHours(23, 59, 59, 999);
          break;
          
        case 'this_month':
          start = new Date(now.getFullYear(), now.getMonth(), 1); // First day of the current month
          end = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Last day of the current month
          end.setHours(23, 59, 59, 999);
          break;
          
        default:
          throw new Error('Invalid time frame');
      }

      // Fetch events from the database
      const latest_events = await prisma.event.findMany({
        orderBy: {
          created_at: 'desc',
        },
        take : 9,
        where: {
          created_at: {
            gte: start,
            lte: end,
          },
        },
        select: {
          id : true,
          title: true,
          slug: true,
          ticket_price: true,
          no_sites: true,
          booked_sites: true,
          created_at: true,
          category_id: true,
          city_id: true,
          vip_price : true,
          vvip_price : true,
          normalticket_name : true,
          vipticket_name : true,
          vvipticket_name : true,
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            }
          }
        }
      });

    return res.status(200).json({
      latest_events : latest_events,
    });

    } catch (error) {
      return res.status(500).json({ message: "Something went wrong." });
    }
   
  }
  static async recent_events(req, res) {

    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 5;

      const totalItems = await prisma.event.count(); 
      const totalPages = Math.ceil(totalItems / pageSize);

      const sort_by = req.query.sort_by;
      const category_id = req.query.category_id;
      const city_id = req.query.city_id;
      const price = req.query.price;
      
      let where = {};
    
      if (category_id) {
        where.category_id = parseInt(category_id);
      }
      if (price) {
        where.ticket_price = {
          lte: parseFloat(price)
        };
      }

      let orderBy = {};
      if (sort_by === 'newest') {
        orderBy = { id: 'desc' };
      } else if (sort_by === 'oldest') {
        orderBy = { id: 'asc' };
      } else {
        orderBy = { id: 'desc' }; 
      }
      const latest_events = await prisma.event.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy,
        where,
        orderBy: {
          views: 'desc',
        },
        select : {
          title : true,
          slug :true,
          ticket_price : true,
          no_sites : true,
          booked_sites : true,
          created_at : true,
          category_id : true,
          city_id : true,
          image : true,
          arrange_time : true,
          vip_price : true,
          vvip_price : true,
          normalticket_name : true,
          vipticket_name : true,
          vvipticket_name : true,
          user : {
            select : {
              id : true,
              name : true,
              image : true
            }
          }
        }
        });
  
      return res.status(200).json({
        latest_events : latest_events,
        totalItems,
        totalPages,
        currentPage: page,
        pageSize,
      });

    } catch (error) {
      return res.status(500).json({ message: "Something went wrong." });
    }
   
  }
  static async populer_events(req, res) {

    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 5;

      const totalItems = await prisma.event.count(); 
      const totalPages = Math.ceil(totalItems / pageSize);

      const sort_by = req.query.sort_by;
      const category_id = req.query.category_id;
      const city_id = req.query.city_id;
      const price = req.query.price;
      
      let where = {};
    
      if (category_id) {
        where.category_id = parseInt(category_id);
      }
      if (price) {
        where.ticket_price = {
          lte: parseFloat(price)
        };
      }

      let orderBy = {};
      if (sort_by === 'newest') {
        orderBy = { id: 'desc' };
      } else if (sort_by === 'oldest') {
        orderBy = { id: 'asc' };
      } else {
        orderBy = { id: 'desc' }; 
      }
      const latest_events = await prisma.event.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy,
        where,
        orderBy: {
          booked_sites: 'desc',
        },
        select : {
          title : true,
          slug :true,
          ticket_price : true,
          no_sites : true,
          booked_sites : true,
          created_at : true,
          category_id : true,
          city_id : true,
          image : true,
          arrange_time : true,
          vip_price : true,
          vvip_price : true,
          normalticket_name : true,
          vipticket_name : true,
          vvipticket_name : true,
          user : {
            select : {
              id : true,
              name : true,
              image : true
            }
          }
        }
        });
  
      return res.status(200).json({
        latest_events : latest_events,
        totalItems,
        totalPages,
        currentPage: page,
        pageSize,
      });

    } catch (error) {
      return res.status(500).json({ message: "Something went wrong." });
    }
   
  }
  static async event(req, res) {
    
    try {
      const Id = parseInt(req.params.id);

      const single_event = await prisma.event.findUnique({
        where : {
            id: Id,
        },
        include: {
          user: {
            select : {
              id : true,
              image : true,
              name : true,
            }
          }, 
          category: {
            select : {
              name : true,
            }
          }, 
          subcategory: {
            select : {
              name : true,
            }
          },
          venue: {
            select : {
              name : true,
              seat : true,
              normal_seat : true,
              vip_seat : true,
              vvip_seat : true,
            }
          }, 
          ticket_type: {
            select : {
              name : true,
            }
          },
          review: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  created_at : true,
                },
              },
            },
          },
        },
      });

      await prisma.event.update({
        where : {
          id : Id
        },
        data : {
          views : parseInt(single_event.views) + 1
        }
      });

      const releted_event = await prisma.event.findMany({
        where : {
          category_id : single_event.category_id
        },
        take : 3
      });

      const featured_event = await prisma.event.findFirst({
        where : {
          is_feature : 1
        }
      });

      


      const banner = await prisma.ads.findMany({
        where: {
          id: {
            in: [2,3] 
          }
        }
      });
      const footer_banner = await prisma.footer_banner.findFirst({});


      return res.status(200).json({
        event_details : single_event,
        releted_event : releted_event,
        featured_event : featured_event,
        ads : banner,
        // banner : banner,
        // cta : footer_banner
      });

    } catch (error) {
      return res.status(500).json({ message: "Something went wrong." });
    }
  }
  static async event_review(req, res) {
   
    try {
      const Id = parseInt(req.params.id);

      const { page = 1, pageSize = 5 } = req.query;
      const pageNumber = parseInt(page);
      const pageSizeNumber = parseInt(pageSize);
      const skip = (pageNumber - 1) * pageSizeNumber;

      const reviews = await prisma.review.findMany({
        skip,
        take: pageSizeNumber,
        where : {
            event_id: Id,
        },
        select : {
          id : true,
          comment : true,
          user : {
            select : {
              id : true,
              name : true,
              image : true,
            },
          },
        }
        
      });
      const totalItems = await prisma.review.count({ 
        where : {
          event_id : Id
        }
       });
      const totalPages = Math.ceil(totalItems / pageSizeNumber);

      return res.status(200).json({
        reviews : reviews,
        pagination: {
          currentPage: pageNumber,
          totalPages,
          totalItems,
        },
      });

    } catch (error) {
      return res.status(500).json({ message: "Something went wrong." });
    }
  }
  static async organizers(req, res) {
    try {
      
      const organizers = await prisma.user.findMany({
        where : {
          is_organizer : 1,
        },
        select : {
          name : true,
          email : true,
          phone : true,
          address : true,
        }
      });
      return res.status(200).json({
        organizers : organizers,
      });

    } catch (error) {
      return res.status(500).json({ message: "Something went wrong." });
    }
  }
  static async organizer(req, res) {
    try {

      const Id = parseInt(req.params.id);
      const category_id = req.query.category_id;

      let where = {
        organizer_id : Id,
      };
    
      if (category_id) {
        where.category_id = parseInt(category_id);
      }
      const organizer = await prisma.user.findUnique({
        where : {
            id : Id,
        },
        select : {
          name : true,
          email : true,
          phone : true,
          image : true,
          address : true,
        }
      });

      const events = await prisma.event.findMany({
        where,
        include: {
          user: {
            select : {
              id : true,
              name : true,
            }
          }, 
          category: {
            select : {
              name : true,
            }
          }, 
          subcategory: {
            select : {
              name : true,
            }
          },
          venue: {
            select : {
              name : true,
            }
          }, 
          ticket_type: {
            select : {
              name : true,
            }
          },
        },
        orderBy :{
          id : 'desc',
        },
      });

      const featured_event = await prisma.event.findFirst({
        where : {
          is_feature : 1
        }
      });

      const ads = await prisma.ads.findFirst({});
      

      return res.status(200).json({
        organizer : organizer,
        events : events,
        featured_event : featured_event,
        ads : ads
      });
      
    } catch (error) {
      return res.status(500).json({ message: "Something went wrong." });
    }
  }
  static async subcategories(req, res) {
    try {

      const Id = parseInt(req.params.id);
      const subcategories = await prisma.subcategory.findMany({
        where: { 
            status : 1
        },
        select : {
            id : true,
            name : true,
            slug : true,
            icon : true,
            _count : {
                    select : {
                      event : true,
                    },
                  },
        }
      });
      const featured_event = await prisma.event.findFirst({
        where : {
          is_feature : 1
        }
      });

      const ads = await prisma.ads.findFirst({});
      

      return res.status(200).json({
        subcategories : subcategories,
        featured_event : featured_event,
        ads : ads
      });
      
    } catch (error) {
      return res.status(500).json({ message: "Something went wrong." });
    }
  }
  static async send_contactmail(req, res) {
    try {

      const {seller_id,name,email,phone,subject,body} = req.body;

      let id = 0;
      if (!seller_id) {
        id = 0;
      } else {
        id = seller_id;
      }
      
      var success = true;

      const isValidate = await Validator.contactmailValidation(req.body);
      if (isValidate.success != true) {
          return res.status(400).json({ errors: isValidate });
      }
      const mail_credentials = await prisma.email.findFirst({});
      var transporter = send_mail();
      var mailOptions = {
        from: mail_credentials.email_from,
        to: email,
        subject: subject,
        text: body
      };
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          success = false;
        } else {
          success = true
        }
      });
      if(success == false) {
        return res.status(500).json({ message: "Something went wrong." });
      }
      await prisma.contactmail.create({
        data: {
          seller_id : parseInt(id),
          name : name,
          email : email,
          phone : phone || '+8801xxxxxxxxx',
          subject : subject || 'default subject',
          body : body
        },
      });
      return res.status(200).json({ message: "Send contact email successfully" });
      
    } catch (error) {
      return res.status(500).json({ message: "Something went wrong." });
    }
  }
  static async send_subscribermail(req, res) {
    try {
      
      const {email} = req.body;
      var success = true;
     const settings = await prisma.setting.findFirst({});
      const verified_link = req.protocol+"://"+req.headers.host+"/subscriber/verified/"+email;
      const isValidate = await Validator.subscribermailValidation(req.body);
      if (isValidate.success != true) {
          return res.status(400).json({ errors: isValidate });
      }
      const find_subscriber = await prisma.subscriber.findFirst({
        where: {
          email : email
        }
      });
      if(find_subscriber){
        return res.status(400).json({ message: "Already subscribed!" });
      }

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
        subject: 'Subscription - Verify Your Email',
        html: `Please verify your email by clicking this link: <a href="${verified_link}">Verify Email</a>`
      };

      // Send the email asynchronously
      
      try {
        await transporter.sendMail(mailOptions);
        console.log('Verification email sent successfully');
      } catch (emailError) {
        console.error('Error sending verification email:', emailError);
        success = false;
      }
      
      if(success == false) {
        return res.status(500).json({ message: "Something went wrong." });
      }
      await prisma.subscriber.create({
        data : {
          email : email,
          is_verified : 0,
          status : 1,
        }
      })
      return res.status(200).json({ message: "Subscription successfully" });
      
    } catch (error) {
      return res.status(500).json({ message: "Something went wrong." });
    }
  }

  static async subscriber_verify(req, res) {
    try {

      const email = req.params.email;
      const find_subscriber = await prisma.subscriber.findFirst({
        where : {
          email : email
        },
       
      });
      if(!find_subscriber){
        return res.status(400).json({ message: "Request is not valid!" });
      }
      await prisma.subscriber.update({
        where : {
          id : find_subscriber.id
        },
        data : {
          is_verified : 1,
          status : 1,
        }
      });
     
       res.redirect("https://event-ticketing-silk.vercel.app/?verified=true");

    } catch (error) {
      return res.status(500).json({ message: "Something went wrong." });
    }
  }

  static async countries(req, res) {
    try {
      const countries =  await prisma.country.findMany({
          select : {
            id : true,
            name : true,
            slug : true,
            states : {
              select : {
                id : true,
                country_id : true,
                name : true,
                slug : true,
                city : {
                  select : {
                    id : true,
                    state_id : true,
                    name : true
                  }
                }
              }
            }
          }
      });
      return res.status(200).json({ countries: countries });

    } catch (error) {
      return res.status(500).json({ message: "Something went wrong." });
    }
  }

}
export default HomeController;
