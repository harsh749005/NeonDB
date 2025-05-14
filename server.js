const express = require("express");
const {Pool} = require("pg");
require("dotenv").config();

const app = express();
app.use(express.json());
// neon db connection
const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;
const pool = new Pool({
  host: PGHOST,
  database: PGDATABASE,
  user: PGUSER,
  password: PGPASSWORD,
  port: 5432, // default Postgres port
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.connect()
.then(client=>{
     console.log("DB connected");
    client.release(); // Release the client back to the pool
})
  .catch(err => {
    console.error("Error connecting to DB", err);
  });


app.get("/users",async (req,res)=>{
    try{
        const users = await pool.query("SELECT * FROM chat_messages");
        res.json({success:true,clients:users.rows})
    }catch(err){
        res.status(500).json({ error: err.message });
    }

})


app.get("/",(req,res)=>{
    res.send("Hey this is backend");
})

const PORT = 3000;

app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
})