const express = require('express')
const mongoose = require('mongoose')
const app = express()

// here we are importing product model that we made to store in mongoDB
const Product = require('./models/productModel')
// here app.use() make use of express.json() middleware to make our app able to read json files
app.use(express.json())
//here express.urlencoded() parses the form content to make it readable for app
app.use(express.urlencoded({extended:false}))

// getting response on client side or testing our app
app.get("/",(req,res)=>{
    res.send(`Hello Everyone`)
})

// fetching all datas from database->>
app.get("/products",async(req,res)=>{
    try {
        const products = await Product.find({})
        res.status(200).json(products)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message:error.message})
    }
})

// fetching data by id from database--> 
app.get("/product/:id",async(req,res)=>{
    try {
        const {id} = req.params
        const product = await Product.findById(id);
        res.status(200).json(product)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message:error.message})
    }
})

// post the data on datbase ->>
app.post("/products",async(req,res)=>{
    try {
        //here we are calling Product model and using await since it is interacting with database and with await it is necessary to use async along with callback function.
        const product = await Product.create(req.body) // here we are passing the req.body
        res.status(200).json(product)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message:error.message})
    }
})

// here app.put() updates the previously made object with help of particular id 
app.put("/product/:id",async(req,res)=>{
    try {
        const {id} = req.params
        const updateProduct = await Product.findByIdAndUpdate(id,req.body)
        if(!updateProduct){
            return res.status(404).json({message:`Product not found with Id: ${id}`})
        }
        const updatedProduct = await Product.findById(id)
        res.status(200).json(updatedProduct)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message:error.message})
    }
})
// here we delete product with particular id from database
app.delete("/product/:id",async(req,res)=>{
    try {
        const {id} = req.params
        const productToDelete = await Product.findByIdAndDelete(id)
        if(!productToDelete){
            return res.status(404).json({message:`Product not found with Id: ${id}`})
        }
        res.status(200).json(productToDelete)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message:error.message})
    }
})

// connecting mongoDB 
mongoose.
connect('mongodb+srv://fakoochand:adminfakoo@satvikapi.buewrv3.mongodb.net/node-api?retryWrites=true&w=majority')
.then(()=>{
    console.log('connected to mongoDB')
    app.listen(4000,()=>{
        console.log(`listening on http://localhost:4000`);
    })
}).catch((error)=>{
    console.log(error)
})

// object data : 
// {
//     "name":"rice",
//     "quantity":10,
//     "price":45,
//     "image":"https://www.apnikheti.com/upload/crops/9517idea99peach.jpg"
//   }