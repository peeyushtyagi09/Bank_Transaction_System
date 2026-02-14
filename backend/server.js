const express = require("express");
const { PORT } = require("./example.env");
const { ConnectDB } = require("./src/Database/db");
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send("Hi hi");
})

// connecting to Database
ConnectDB();

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
});


