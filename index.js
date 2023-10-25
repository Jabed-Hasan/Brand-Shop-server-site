const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 4000;


//Middleware
 app.use(cors());
 app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mfkuy6b.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function run() {
  try {
    
    await client.connect();
     
    const productCollection = client.db('productDB').collection('products');
   

    app.delete('/products/:id',async(req,res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await productCollection.deleteOne(query);
      res.send(result);
    })

    
    app.get('/products/update/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await  productCollection.findOne(query);
      res.send(result)
    })


    app.get('/products',async(req,res)=>{
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/products/:brandName', async(req, res) => {
      const id = req.params.brandName;
      const query = {brandName : id}
      const cursor = productCollection.find(query);
      const result = await cursor.toArray();
    
      res.json(result);
    });

    // productCollection.find({brandName:req.params.brand})
    // app.get('/myCart/:id', async(req,res)=>{
    //   const id = req.params.id;
    //   const query = {_id: new ObjectId(id)}
    //   const result = await  coffeeCollection.findOne(query);
    //   res.send(result)
    // })


    app.post('/products',async(req,res) =>{
        const newProduct = req.body;
        console.log(newProduct);
        const result = await productCollection.insertOne(newProduct);
        res.send(result);

    })

    app.put('/products/update/:id',async(req,res) =>  {
            const id = req.params.id;
            const filter ={_id: new ObjectId(id)}
            const options = {upsert:true};
            const updatedProduct = req.body;
            const products = {
              $set: {
                name : updatedProduct.name,
                brand: updatedProduct.brandName,
                rating: updatedProduct.rating,
                price: updatedProduct.price,
                details: updatedProduct.details,
                image: updatedProduct.image

              }
            }
            const result = await productCollection.updateOne(filter,products,options);
            res.send(result);
    })
    
    // app.delete('/myCart/:id',async(req,res) =>{
    //   const id = req.params.id;
    //   const query = {_id: id}
    //   const result = await coffeeCollection.deleteOne(query);
    //   res.send(result);
    // })

    // Send a ping to confirm a successful connection
    //await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get ('/',(req,res) => {
   res.send('Brand Shop server is runing')
})

app.listen(port,() => {
   console.log(`Brand Shop Server is runing on port: ${port}`)
})


// const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mfkuy6b.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri)

// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function run() {
//   try {
    
//     await client.connect();
     
//     const coffeeCollection = client.db('coffeeDB').collection('coffee');


//     app.get('/coffee',async(req,res)=>{
//       const cursor = coffeeCollection.find();
//       const result = await cursor.toArray();
//       res.send(result);
//     })


//     app.get('/coffee/:id', async(req,res)=>{
//       const id = req.params.id;
//       const query = {_id: new ObjectId(id)}
//       const result = await  coffeeCollection.findOne(query);
//       res.send(result)
//     })


//     app.post('/coffee',async(req,res) =>{
//         const newCoffee = req.body;
//         console.log(newCoffee);
//         const result = await coffeeCollection.insertOne(newCoffee);
//         res.send(result);

//     })

//     app.put('/coffee/:id',async(req,res) =>  {
//             const id = req.params.id;
//             const filter ={_id: new ObjectId(id)}
//             const options = {upsert:true};
//             const updatedCoffee = req.body;
//             const Coffee = {
//               $set: {
//                 name : updatedCoffee.name,
//                 supplier: updatedCoffee.supplier,
//                 taste: updatedCoffee.taste,
//                 category: updatedCoffee.category,
//                 details: updatedCoffee.details,
//                 photo_url: updatedCoffee.photo_url

//               }
//             }
//             const result = await coffeeCollection.updateOne(filter,Coffee,options);
//             res.send(result);
//     })
    


//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     // await client.close();
//   }
// }
// run().catch(console.dir);


//  app.get ('/',(req,res) => {
//     res.send('Brand Shop server is runing')
//  })

//  app.listen(port,() => {
//     console.log(`Brand Shop Server is runing on port: ${port}`)
//  })
