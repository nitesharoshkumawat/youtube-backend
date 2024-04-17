// import connectDB from "./db/index.js";
import dotenv from "dotenv";
import { app } from "./app.js";
import  mongoose from "mongoose";
// import  User from "./models/user.model.js";




dotenv.config({
    path: "./.env"
});


main().then(() =>{
    console.log("connected to db");
}).catch((err) =>{
    console.log(err);
});

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/youtube');
};


app.listen(8000, () =>{
    console.log("sever is lisning to port 8000");
});


// connectDB()
// .then(() => {
//    app.listen(process.env.PORT || 8080, () =>{
//     console.log("server is listining to port 8080");
//    });
//    app.on(error, (error) =>{
//     console.log("error:", error)
//     throw error
//    });
// }).catch((error) =>{
//     console.log("mongoDB connection failed", error)
// });



//  const kittySchema = new mongoose.Schema({
//         name: String
//       });
    
//       const Kitty = mongoose.model("Kitty", kittySchema);
    
//      const Kitty1 = new Kitty({
//         name: "monkey"
//      })
    
//      Kitty1.save();