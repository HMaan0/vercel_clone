import { Up } from "./function/up";
import express from "express";
import dotenv from "dotenv";
dotenv.config();
const app = express();

app.get("/check", (req, res) => {
  let loaded = false;
  console.log(process.env.AWS_ACCESS_KEY);
  if (process.env.AWS_ACCESS_KEY) {
    loaded = true;
  }
  res.send({ "is env correctly loaded": loaded });
});

const port = 9000;
console.log("running on port: ", port);
app.listen(port);

// app.get("/up", async (req, res) => {
//   try {
//     const newInstanceIp = await Up();
//     res.send(newInstanceIp);
//   } catch (error) {
//     res.send({ error: "Failed to start instance" });
//   }
// });

// app.get("/down",async (req,res) =>{
//   const downEc2 = await Down();
//   res.send(downEc2)
// } )
