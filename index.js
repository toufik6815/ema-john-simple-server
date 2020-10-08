const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();




//Add your connection string into your application code
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.px7nq.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;









//medal
const app = express();
app.use(bodyParser.json());
app.use(cors());

const port = 5000;



//ROOT
app.get('/', (req, res) => {
    res.send("Hello form db working")
})




//Add your connection string into your application code
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

client.connect((err) => {
  const productsCollection = client.db("emaJohnStore").collection("products");

  const ordersCollection = client.db("emaJohnStore").collection("orders");
  

    //POST-1
    app.post('/addProduct', (req, res) => {
        const products = req.body;

        productsCollection.insertOne(products)
        .then(result => {
            console.log(result.insertedCount);
            res.send(result.insertedCount)
        })
    });
    


    //Read product-1
    app.get("/products", (req, res) => {
        const search = req.query.search;
        productsCollection.find({name: {$regex: search} })
        .toArray((err, documents) => {
            res.send(documents);
        })
    });



    //Read product-2
    app.get("/product/:key", (req, res) => {
        productsCollection.find({key: req.params.key})
        .toArray((err, documents) => {
            res.send(documents[0]);
        })
    });



    //POST-2
    app.post("/productKeys", (req, res) => {
      const productKeys = req.body;
      productsCollection
        .find({ key: { $in: productKeys } })
        .toArray((err, documents) => {
          res.send(documents);
        });
    });



    //POST-3
    app.post('/addOrder', (req, res) => {
        const order = req.body;

        ordersCollection.insertOne(order)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
    });
});















//Hosting
app.listen(process.env.PORT || port);