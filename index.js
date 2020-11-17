
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0oz1r.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()

app.use(bodyParser.json());
app.use(cors());
app.use(fileUpload());

const port = 50001;

app.get('/',(req,res)=>{
    res.send('i m shakil')
})

const client = new MongoClient(uri, { useNewUrlParser: true ,useUnifiedTopology: true });
client.connect(err => {
  const apartmentCollection = client.db("apartmentStore").collection("appointment");
  const bookingCollection = client.db("apartmentStore").collection("booking");
  console.log("data base connect");
//booking apartment
app.post('/bookApartment',(req,res)=>{
    const book=req.body;
    bookingCollection.insertOne(book)
    .then(result => {
      res.send(result.insertedCount > 0)
  })
})
 //get user single  apartment
 app.get('/singleApartment',(req, res) => {
    const userEmail=req.query.email;
    console.log(userEmail)
    bookingCollection.find({Email:userEmail})
      .toArray((err, documents) => {
          res.send(documents);
      })
  })
   
//user apartment
app.get('/userapartment', (req, res) => {
    bookingCollection.find({})
      .toArray((err, documents) => {
          res.send(documents);
      })
     
})
   // add apartment
   app.post('/addApartment',(req,res)=>{
    const file = req.files.file;
    const title = req.body.title;
    const price = req.body.price;
    const location = req.body.location;
    const bedroom = req.body.bedroom;
    const bathroom = req.body.bathroom;
    // console.log(title,file,price,location,bedroom,bathroom);      
    const newImg = file.data;
    const encImg = newImg.toString('base64');
    const image = {
        contentType: file.mimetype,
        size: file.size,
        img: Buffer.from(encImg, 'base64')
    };
    apartmentCollection.insertOne({title,price,location,bedroom,bathroom, image})
    .then(result => {
        res.send(result.insertedCount > 0);
    })

})
//get service
app.get('/apartment',(req, res) => {
    apartmentCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })
});
 

app.listen(process.env.PORT || port)