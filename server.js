const express = require('express');
const app = express();
const port = 3000;
const generico = require('./demos/generico');

app.use(express.static("public"));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render(__dirname + "/views/index");
});

app.post("/form", generico.gerapag);

app.post("/callback", generico.callback);


module.exports = app;

/*
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})*/