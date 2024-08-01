import bcrypt from "bcrypt";
import prisma from "../../config/db.config.js";
import Validator from '../../validator/Validator.js';
import generateToken from "../../utils/GenerateToken.js";
import axios from "axios";
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const GLOBALPAY_APP_ID = "qGG6k7r9T4xG7G23JBaBsLItlTuUZfRJ"; //process.env.GLOBALPAY_APP_ID;
const GLOBALPAY_APP_KEY = "cqhdCEng158rqGln"; //process.env.GLOBALPAY_APP_KEY;
const GLOBALPAY_ENVIRONMENT = 'TEST';
const GLOBALPAY_API_URL = 'https://api.globalpay.com/v1/payments';
const GLOBALPAY_TOKEN_URL = 'https://apis.sandbox.globalpay.com/ucp/accesstoken';

async function generateAccessToken() {

  const nonce = new Date().toISOString();
  const app_id = "MN500Q8lk5jp0rEmB5LGvTo27gdQgZln";
  const app_key = "QtOSeNmh3DY6AuMO";
  const secret = crypto.createHash('sha512').update(nonce + app_key).digest('hex');

  const payload = {
    app_id: app_id,
    nonce: nonce,
    secret: secret,
    grant_type: 'client_credentials',
    permissions: ["PMT_POST_Create_Single"],
    interval_to_expire: "10_MINUTES",
    restricted_token: "YES"
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
  try {
    const response = await axios.post(GLOBALPAY_API_URL, paymentDetails, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error making payment:', error);
    throw new Error('Failed to make payment');
  }
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
    try {
      const isValidate = await Validator.orderValidation(req.body);
      if (!isValidate.success) {
        return res.status(400).json({ errors: isValidate });
      }

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
        currency
      } = req.body;

      const payment_credential = await prisma.stripe.findFirst({
        where : {
          user_id : organizer_id
        }
      });

      const cardExpDate = formatCardDate(card_date);

      const paymentDetails = {
        amount: parseInt(amount),
        currency,
        source: {
          cardNumber: card_Number,
          expirationDate: cardExpDate,
          cvv: card_CVC,
        },
      };

      const accessToken = await generateAccessToken();
      const paymentResponse = await makePayment(accessToken, paymentDetails);

      const transactionId = paymentResponse.transactionId;

      const checkTicket = await prisma.event.findFirst({
        where: {
          id: parseInt(event_id)
        }
      });

      if (checkTicket.no_sites < parseInt(quantity)) {
        return res.json({ message: "Quantity is greater than available tickets" });
      }

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
          order_status: 1,
          payment_status: 1,
          transaction_id: transactionId,
          payment_method: 'globalpay'
        }
      });

      await prisma.event.update({
        where: {
          id: parseInt(event_id)
        },
        data: {
          no_sites: checkTicket.no_sites - parseInt(quantity),
          booked_sites: checkTicket.booked_sites + parseInt(quantity),
        }
      });

      return res.status(200).json({ message: "Your order is successfully placed" });

    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

export default TicketController;
