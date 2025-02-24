const express = require("express");
const { fetchOrders } = require("./woocommerce");
const { fetchSingleOrder } = require("./woocommerce");
const { createSquareOrder } = require("./square");
const https = require('https');
const fs = require('fs');
require("dotenv").config();
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;
app.use(bodyParser.json());

const options = {
    key: fs.readFileSync('/etc/letsencrypt/live/amirthacurrybar.com/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/amirthacurrybar.com/fullchain.pem'),
    ca: fs.readFileSync('/etc/letsencrypt/live/amirthacurrybar.com/fullchain.pem'),
};

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

https.createServer(options, app).listen(3001, () => {
    console.log("Server running on https://yourdomain.com:3001");
});