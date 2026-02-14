const express = require("express");
const { PORT } = require("./example.env");
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send("Hi hi");
})

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
});


