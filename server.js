const express = require("express");
const path = require("path");
const connectDB = require("./db");
const contactRoutes = require("./routes/contactRoutes");
const authRoutes = require("./routes/authRoutes");

require("dotenv").config();
connectDB();
const app = express();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");

    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }

    next();
});

app.use(express.json());
app.use(express.static(path.join(__dirname, "frontend")));
app.use("/api/contacts",contactRoutes);


app.use("/api/auth",authRoutes);

app.get("/", (req,res)=>{
    res.send("Phonebook API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`Server Running on http://localhost:${PORT}`);
});
