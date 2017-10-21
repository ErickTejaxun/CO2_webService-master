


var express = require("express");
var app = express();
var port = 1337;

var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/aire');
 

//Esquema de la db


var aireSchema = new mongoose.Schema({
	altitud: { type: Number},
	latitud: { type: Number},
	co2: { type: Number, min: 0, max: 100000},
	timestamp: { type: Date}
});

var datoAire = mongoose.model("Aire", aireSchema);


app.get("/", (req, res) => {
//res.send("Hello World");
res.sendFile(__dirname + "/index.html");
});
 
app.listen(port, () => {
  console.log("Server listening on port " + port);
})
