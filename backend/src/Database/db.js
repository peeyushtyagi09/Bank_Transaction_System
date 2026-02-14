const mongoose = require("mongoose");
const { database_uri } = require("../../example.env");

const ConnectDB = async () => {
    try{
        await mongoose.connect(database_uri);
        console.log("🙌  Server is successfully connected to databasse 🙌");
    }catch(err){
        console.log(`❌ Problem in connecting to database ❌ ${err}`);
    }
};

module.exports = {
    ConnectDB
}