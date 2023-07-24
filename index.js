require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
//middleware
app.use(express.json());
app.use(cors());
//mongodb code here
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const e = require("express");
const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_USER_PASSWORD}@cluster0.inzz8jh.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
const dbConnect = async () => {
  try {
    client.connect();
    console.log("Database Connected Successfully✅");
  } catch (error) {
    console.log(error.name, error.message);
  }
};
dbConnect();
  const userCollection = client.db("Dreamers").collection("user");
  const admissionDetailsCollection= client.db("Dreamers").collection("admissionDetails");
  const collegesCollection = client.db("Dreamers").collection("college")
  app.put('/users/:email',async(req,res)=>{
      const email = req.params.email;
      const userInfo = req.body;
      const query = {email:email}
      const options = { upsert: true };
      const updataDoc={
          $set:userInfo
      }
      const result = await userCollection.updateOne(query, updataDoc,options);
      res.send(result);
  })
  app.post('/admissionDetails',async(req,res)=>{
    const admissionDetailsInfo = req.body;
    const result = await admissionDetailsCollection.insertOne(admissionDetailsInfo)
    res.send(result);
  })
  app.get('/colleges',async(req,res)=>{
    const result = await collegesCollection.find().toArray();
    res.send(result);
  })
  app.get("/singleCollege/:id",async(req,res)=>{
    const id = req.params.id;
    const query = {_id:new ObjectId(id)};
    const result = await collegesCollection.findOne(query);
    res.send(result)
  })
  app.get('/addmissionDetails/:email', async(req,res)=>{
    const email = req.params.email;
    const query = {email:email};
    const result = await admissionDetailsCollection.find(query).toArray();
    res.send(result)

  })
app.get('/', (req,res)=>{
    res.send(`Welcome to our application`)
})
app.listen(port,()=>{
    console.log(`server listening on ${port}`);
});