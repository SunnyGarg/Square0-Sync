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
    console.log(`Received a ${req.method} request for ${req.url}`);
    const orderPayload = JSON.stringify(req.body);

    try {
        console.log("Passing order id: "+ req.body.id);
        const order = fetchSingleOrder(req.body.id);
        // Sync each order to Square
        //console.log("Woocommerece Order: "+ JSON.stringify(order, null, "  "));
        //for (const order of orders) {
        //    console.log("Order id: "+order.id);
            //if(order.id == '1596'){
          //      createSquareOrder(order);
            //}
        //}
        res.send("Orders synced successfully!");
      } catch (error) {
        res.status(500).send("Error syncing orders: " + error);
      }
});

app.get("/sync-orders", async (req, res) => {
  try {
    // Fetch WooCommerce orders
    const orders = await fetchOrders();
    // Sync each order to Square
    //console.log("Woocommerece Orders: "+ JSON.stringify(orders, null, "  "));
    for (const order of orders) {
    console.log("Order id: "+order.id);
      if(order.id == '1596'){
      console.log("Going inside id");
        await createSquareOrder(order);
      }
    }
    res.send("Orders synced successfully!");
  } catch (error) {
    res.status(500).send("Error syncing orders: " + error);
  }
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});