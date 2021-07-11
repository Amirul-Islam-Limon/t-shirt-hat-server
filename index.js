const express = require('express')
const app = express()
const { MongoClient} = require('mongodb');
const cors = require('cors');
const bodyParser = require('body-parser');
const ObjectID=require('mongodb').ObjectID
require('dotenv').config();


const port = process.env.PORT || 9999;
app.use(cors());
app.use(bodyParser.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mvdkd.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const shirtCollection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_COLLECTION}`);
  const orderCollection = client.db(`${process.env.DB_NAME}`).collection("order");

  app.post('/addProduct',(req, res)=>{
    const product = req.body;
    shirtCollection.insertOne(product)
    .then(results=>{
        console.log(results);
    })
  })

  app.get('/getProducts', (req,res)=>{
    shirtCollection.find({})
    .toArray((error,documents)=>{
      res.send(documents)
    })
  })

  app.post('/addOrder', (req,res)=>{
    const order = req.body;
    orderCollection.insertOne(order)
    .then(result=>{
      console.log(result.insertedCount);
    })
  })

  app.get('/getOrders',(req,res)=>{
    console.log(req.query.email);
    orderCollection.find({email: req.query.email})
    .toArray((err,doc)=>{
      res.send(doc)
    })
  })

  app.delete("/delete/:id",(req, res)=>{
    const id = req.params.id
    console.log(id)
    shirtCollection.deleteOne({_id:ObjectID(id)})
    .then((results)=>{
      console.log(results);
    })
    .catch(err=>{
      console.log(err);
    })
  })

});


app.get('/',(req,res)=>{
  res.send('Hello World!')
})

app.listen(port)
