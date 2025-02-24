const axios = require("axios");
require("dotenv").config();
const { SQUARE_ACCESS_TOKEN, LOCATION_ID, SQUARE_URL } = process.env;

const createSquareOrder = async (order) => {
  const url = `${SQUARE_URL}`;
  const headers = {
    Authorization: `Bearer ${SQUARE_ACCESS_TOKEN}`,
    "Content-Type": "application/json",
  };

  var address={};
  address['address_line_1'] = order.billing.address_1;
  address['address_line_2'] = order.billing.address_2;
  address['country'] = order.billing.country;
  address['postal_code'] = order.billing.postcode;
  address['locality'] = order.billing.state;
  address['sublocality'] = order.billing.city;

  var recipient={};
  recipient['display_name'] = order.billing.first_name + ' '+order.billing.last_name;
  recipient['email_address'] = order.billing.email;
  recipient['phone_number'] = order.billing.phone;
  recipient['address'] = address;

  var pickup_details = {};
  pickup_details['schedule_type'] = 'ASAP';
  pickup_details['recipient'] = recipient;

  var fulfillments = [];
  fulfillments.push({type: 'PICKUP', pickup_details: pickup_details});

  const squareOrder = {
    order: {
      location_id: LOCATION_ID,
      state: 'OPEN',
      customer_id: order.customer_id.toString(),
      reference_id: order.transaction_id.toString(),
      line_items: order.line_items.map((item) => ({
        name: item.name,
        quantity: item.quantity.toString(),
        base_price_money: {
          amount: Math.round(item.price * 100), // Convert to cents
          currency: "USD",
        },
      })),
      fulfillments: fulfillments
    },
  };
  console.log("Square create API payload: "+ JSON.stringify(squareOrder, null, "  "));
  try {
    const response = await axios.post(url, squareOrder, { headers });
    console.log("Order synced to Square:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating Square order:", error.response.data);
  }
};

module.exports = { createSquareOrder };