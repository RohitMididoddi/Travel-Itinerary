const express = require("express");
const path = require("path");
const collection = require("./config");
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());
app.use(express.static("public")); // Serve static files if any

app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

// Render login page
app.get("/", (req, res) => {
    res.render("login");
});

// Render signup page
app.get("/signup", (req, res) => {
    res.render("signup");
});

// Handle signup
app.post("/signup", async (req, res) => {
    const data = {
        name: req.body.username,
        password: req.body.password
    };
    const existingUser = await collection.findOne({ name: data.name });

    if (existingUser) {
        res.send('User already exists. Please choose a different username.');
    } else {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);

        data.password = hashedPassword; 

        await collection.insertOne(data);
        res.send('User created successfully');
    }
});

// Handle login
app.post("/login", async (req, res) => {
    try {
        const check = await collection.findOne({ name: req.body.username });
        if (!check) {
            return res.send("User name not found");
        }
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if (!isPasswordMatch) {
            return res.send("Wrong Password");
        } else {
            res.sendFile(path.join(__dirname, '..', 'Home.html'));
        }
    } catch (error) {
        console.error(error);
        res.send("Wrong Details");
    }
});

// Serve HTML pages
app.get("/home", (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Home.html'));
});

app.get("/hotel", (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'hotel.html')); // Make sure hotel.html is in the correct location
});

app.get("/carrental", (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'carrental.html')); // Make sure car-rental.html is in the correct location
});

app.get("/flight", (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'flight.html')); // Make sure flight-booking.html is in the correct location
});

// Start the server
const port = 5000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
