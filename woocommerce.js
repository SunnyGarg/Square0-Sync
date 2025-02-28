const axios = require("axios");
require("dotenv").config();
const { WOOCOMMERCE_URL, WOOCOMMERCE_KEY, WOOCOMMERCE_SECRET } = process.env;
const { createSquareOrder } = require("./square");

const fetchSingleOrder = async (order_id) => {
console.log("Receiving order id: "+order_id);
  const url = `${WOOCOMMERCE_URL}/wp-json/wc/v3/orders/` + order_id;
  const auth = { username: WOOCOMMERCE_KEY, password: WOOCOMMERCE_SECRET };

  try {
   axios({
            method:'get',
            url,
            auth
        })
        .then(function (response) {
                createSquareOrder(response.data);
        })
        .catch(function (error) {
            console.log(error);
        });
  } catch (error) {
    console.error("Error fetching WooCommerce orders: ", error.response.data);
  }
};

module.exports = { fetchSingleOrder };