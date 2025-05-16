const express = require("express");
const {Pool} = require("pg");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// app.options("/*", cors()); // Allow OPTIONS on all route
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
//insert chats
app.post('/chat', async (req, res) => {
  const { sender, message,userName } = req.body;
  
  const insertQuery = "INSERT INTO chat_messages (sender, message,username) VALUES($1, $2, $3)";
  const values = [sender, message,userName ];

  try {
    await pool.query(insertQuery, values);
    console.log("User and Bot chat inserted");
    
    // ✅ Send response once, after both succeed
    res.status(200).json({ message: "User and Bot Chat Inserted" });

  } catch (error) {
    console.error("Failed to insert", error);
    res.status(500).json({ error: 'Failed to insert chat' });
  }
});

//sending chat messages to frontend
app.get("/chatMessages",async (req,res)=>{
  const chatFetchQuery = "SELECT * FROM chat_messages WHERE username = 'mohit'";
  try {
    const result = await pool.query(chatFetchQuery);
    console.log("Query result:", result.rows);
    res.status(200).json({ success: true, chats: result.rows });
  }catch(error){
    console.log("Error fetching chat messages:", error);
  }
  
})

app.get("/",(req,res)=>{
    res.send("Hey this is backend");
})

const PORT = 3000;

app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
})