const express = require("express");
const {pool} = require("pg");
require("dotenv").config;

const app = express();

// neon db connection

app.get("/",(req,res)=>{
    res.send("Hey this is backend");
})

const PORT = 3000;

app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
})