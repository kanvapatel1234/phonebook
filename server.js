const express = require("express");
const connectDB = require("./db");
const contactRoutes = require("./routes/contactRoutes");
const authRoutes = require("./routes/authRoutes");

require("dotenv").config();
connectDB();
const app = express();

app.use(express.json());
app.use("/api/contacts",contactRoutes);


app.use("/api/auth",authRoutes);

app.get("/", (req,res)=>{
    res.send("Phonebook API Running");
});

app.listen(5000,()=>{
    console.log("Server Running");
});