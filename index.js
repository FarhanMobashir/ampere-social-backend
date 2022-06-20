import express from "express";
const app = express();
const port = 8080;
const host = "localhost";

app.get('/', (req, res) => {
  res.json({message:'Hello from Server'})
})

app.listen(port, () => {
  console.log(`Example app listening on port http://${host}:${port}`)
})