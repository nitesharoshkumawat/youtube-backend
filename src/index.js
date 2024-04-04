import connectDB from "./db/index.js";
import dotenv from "dotenv";

dotenv.config({
    path: "./env"
});


connectDB()
.then(() => {
   app.listen(process.env.PORT || 8080, () =>{
    console.log("server is listining to port 8080");
   });
   app.on(error, (error) =>{
    console.log("error:", error)
    throw error
   });
}).catch((error) =>{
    console.log("mongoDB connection failed", error)
});