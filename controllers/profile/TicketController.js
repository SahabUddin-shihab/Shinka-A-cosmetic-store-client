import bcrypt from "bcrypt";
import prisma from "../../config/db.config.js";
import Validator from '../../validator/Validator.js';
import generateToken from "../../utils/GenerateToken.js";
import axios from "axios";
import dotenv from 'dotenv';
import crypto from 'crypto';


const calculateSecret = (nonce, appKey) => {
  const input = nonce + appKey;
  return crypto.createHash('sha512').update(input).digest('hex');
};

const GLOBALPAY_APP_ID = "qGG6k7r9T4xG7G23JBaBsLItlTuUZfRJ"; //process.env.GLOBALPAY_APP_ID;
const GLOBALPAY_APP_KEY = "cqhdCEng158rqGln"; //process.env.GLOBALPAY_APP_KEY;
const GLOBALPAY_ENVIRONMENT = 'TEST';
const GLOBALPAY_API_URL = 'https://api.globalpay.com/v1/payments';
const GLOBALPAY_TOKEN_URL = 'https://apis.sandbox.globalpay.com/ucp/accesstoken';

async function generateAccessToken() {

  const nonce = new Date().toISOString();
  const app_id = '4DHOnp0PhJ7h6CXth2mVOXBdnjyywa9e';
  const app_key = 'bi8RVAKaGaMG61SJ';
  const secret = crypto.createHash('sha512').update(nonce + app_key).digest('hex');

  const payload = {
    app_id: app_id,
    nonce: nonce,
    secret: secret,
    grant_type: 'client_credentials'
  };

  console.log(payload);
  try {
    const response = await axios.post(GLOBALPAY_TOKEN_URL, payload, {
      headers: {
        'X-GP-Version ': '2021-03-22',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'accept-encoding': 'gzip'
      }
    });

    console.log('Response object:', response);
  } catch (error) {
    if (error.response) {
      // Server responded with a status code other than 2xx
      console.error('Error response data:', error.response.data);
      console.error('Error response data:', error.response);
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', error.response.headers);
    } else if (error.request) {
      // No response received from server
      console.error('Error request:', error.request);
    } else {
      // Other errors
      console.error('Error message:', error.message);
    }
    console.error('Error config:', error.config);
  }
}

async function makePayment(accessToken, paymentDetails) {
 
    const response = await axios.post('https://apis.sandbox.globalpay.com/ucp/transactions', paymentDetails, {
      headers: {
       'Authorization': `Bearer ${accessToken}`,
        'X-GP-Version': '2021-03-22',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    return response.data;
  
}

function formatCardDate(card_date) {
  const [month, year] = card_date.split('-');
  return `${month}-${year}`;
}


class TicketController {

  static async profile(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 5;

      const totalItems = await prisma.order.count({
        where: {
          user_id: req.user.id,
        }
      });
      const totalPages = Math.ceil(totalItems / pageSize);

      const tickets = await prisma.order.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy : {
          id : 'desc'
        },
        where: {
          user_id: req.user.id,
        },
        include: {
          event: {
            select: {
              title: true,
              image: true,
              qr_code: true,
              arrange_time: true,
              user: {
                select: {
                  id: true,
                  name: true,
                }
              },
              venue: {
                select: {
                  name: true,
                }
              },
            },
          },
        },
      });
      
      return res.status(200).json({
        'tickets': tickets,
        totalItems,
        totalPages,
        currentPage: page,
        pageSize,
      });
    } catch (error) {
      return res.status(401).json({ message: "Something went wrong!!" });
    }
  }

  static async store(req, res) {

    const {
      billing_email,
      card_date,
      card_Number,
      card_CVC,
      amount,
      event_id,
      organizer_id,
      first_name,
      last_name,
      quantity,
      address,
      phone,
      currency,
      spacification_id
    } = req.body;

    const finding_event = await prisma.event.findFirst({
      where : {
        id : parseInt(event_id)
      },
      select : {
        organizer_id : true
      }
    });

    const stripeCredentials = await prisma.stripe.findFirst({
      where : {
        user_id : parseInt(finding_event.organizer_id)
      }
    });
    if(!stripeCredentials){
      return res.status(404).json({message : 'Organizer payment credential not found!'});
    }
    const app_key = stripeCredentials.stipe_secrate;
    const nonce = '2029-03-14T13:24:10.832'; //new Date().toISOString();
    const secret = calculateSecret(nonce, app_key);
  
    const payload = {
      app_id: stripeCredentials.stripe_key ,//'i9R0byBBor6RqTQNj3g4MuVBwH5rd7yR',
      nonce: nonce, 
      secret: secret ,//'e776ce1d9e94d5072ee132258e446cd92668d7c28b2e475a345319b475ba601956c16e3983926ce279db6301d78b7f47cfb729e41b4169814e373f0a0bf38716',
      grant_type: 'client_credentials',
    };

    const response = await axios.post('https://apis.sandbox.globalpay.com/ucp/accesstoken', payload, {
      headers: {
        'X-GP-Version': '2021-03-22',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    const accessToken = "MS18nKEj5SKCBdzfLxCAlslFcsK3";//response.data.token;
    //return res.json(response.data);
    try {
      const isValidate = await Validator.orderValidation(req.body);
      if (!isValidate.success) {
        return res.status(400).json({ errors: isValidate });
      }

      

      const payment_credential = await prisma.stripe.findFirst({
        where : {
          user_id : organizer_id
        }
      });

      const [month, year] = card_date.split('-');
      
      const paymentDetails = {
        "account_name": "Transaction_Processing",
        "type": "SALE",
        "channel": "CNP",
        "capture_mode": "AUTO",
        "amount": "1999",
        "currency": "USD",
        "reference": "93459c78-f3f9-427c-84df-ca0584bb55bf",
        "description": "SKU#BLK-MED-G123-GUC",
        "order_reference": "INV#88547",
        "country": "US",
        "ip_address": "123.123.123.123",
        "payment_method": {
           "id": "PMT_41db09dd-784e-47f7-a5b8-39f4853fbdc0",
           "first_name": "James",
           "last_name": "Mason",
           "entry_mode": "ECOM",
           "authentication": {
              "xid": "vJ9NXpFueXsAqeb4iAbJJbe+66s=",
              "cavv": "AAACBUGDZYYYIgGFGYNlAAAAAAA=",
              "eci": "5",
              "message_version": "1.0.0"
           }
        }
      };


      const paymentResponse = await makePayment(accessToken, paymentDetails);
      return res.json(paymentResponse)

      const checkTicket = await prisma.event.findFirst({
        where: {
          id: parseInt(event_id)
        }
      });

      if (checkTicket.no_sites < parseInt(quantity)) {
        return res.json({ message: "Quantity is greater than available tickets" });
      }

      const specification = await prisma.specification.findFirst({
        where : {
          id : parseInt(spacification_id)
        }
      });

      await prisma.order.create({
        data: {
          user_id: req.user.id,
          event_id: parseInt(event_id),
          first_name,
          last_name,
          email: billing_email,
          address,
          phone,
          quantity: parseInt(quantity),
          unit_price: checkTicket.ticket_price,
          type : specification.level,
          order_status: 1,
          payment_status: 1,
          transaction_id: 'k732jd823jhewq9234',//transactionId,
          payment_method: 'globalpay',
          created_at: new Date()
        }
      });
      await prisma.event.update({
        where: {
          id: parseInt(event_id)
        },
        data: {
          //no_sites: checkTicket.no_sites - parseInt(quantity),
          booked_sites: checkTicket.booked_sites + parseInt(quantity),
        }
      });

      await prisma.specification.update({
        where : {
          id : parseInt(spacification_id)
        },
        data : {
          sold_ticket : parseInt(specification.sold_ticket) + parseInt(quantity),
          //seats : parseInt(specification.seats) - parseInt(quantity)
        }
      });

      return res.status(200).json({ message: "Your order is successfully placed" });

    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

export default TicketController;
