const express = require("express");
const { fetchOrders } = require("./woocommerce");
const { fetchSingleOrder } = require("./woocommerce");
const { createSquareOrder } = require("./square");
require("dotenv").config();
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;
app.use(bodyParser.json());

app.post("/get-orders", (req, res) => {
    console.log('Env: ' + process.env.ENV_VARIABLE)
    console.log(`Received a ${req.method} request for ${req.url}`);
    const orderPayload = JSON.stringify(req.body);

    try {
       const order = fetchSingleOrder(req.body.id);
       res.send("Orders synced successfully!");
      } catch (error) {
        res.status(500).send("Error syncing orders: " + error);
      }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});