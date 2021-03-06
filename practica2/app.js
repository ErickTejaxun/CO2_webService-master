


var express = require("express");
var app = express();
var port = 1337;

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/aire');
 

//Esquema de la db




var aireSchema = new mongoose.Schema({
	altitud: { type: Number},
	latitud: { type: Number},
	co2: { type: Number, min: 0, max: 100000},
  fecha: String
});

var datoAire = mongoose.model("Aire", aireSchema);

var cliente = new mongoose.Schema({
  nombre: String,
  correo: String,
  telefono: { type: Number},
  mensaje: String
});

var datoCliente = mongoose.model("Cliente", cliente);



app.get("/", (req, res) => {
//res.send("Hello World");
res.sendFile(__dirname + "/inicio.html");
});



app.post("/agregardato", (req, res) => {
   var myData = new datoAire(req.body);
  myData.save()
    .then(item => {
      res.send("item saved to database");
    })
    .catch(err => {
      res.status(400).send("unable to save to database");
    }); 
});


app.post("/cliente", (req, res) => {
   var myData = new datoCliente(req.body);
  myData.save()
    .then(item => {
      //res.send("Mensaje Enviado");
      console.log("Alcenado : " + item)
      res.sendFile(__dirname + "/contactenos.html");
    })
    .catch(err => {
      res.status(400).send("unable to save to database");
    }); 
});



app.get("/inicio", (req, res) => {

  datoAire.find({  }.toArray, function (err, datos) {
  if (err) return handleError(err);
  console.log('Consulta 1: ' + datos.length) 
  contador = 1;

  for(var i = 0; i < datos.length;i++){
        (function(){

          //console.log("Dato " + i + " : "+datos[i]);

          var arr = datos[i].toString();
          console.log("Dato " + i + " : "+arr);
          /*.split(",");
          for(var i=0;i<arr.length;i++) {
              arr[i] = ++arr[i];
          }

          */
          })();
  }

  })


/*
  var query = datoAire.find({ });
  //query.select('altitud');
  query.exec(function (err, datoAire) {
  if (err) return handleError(err);
  console.log('------------------------------------------\n Consulta 2: ' + datoAire) 
  })
*/

  res.sendFile(__dirname + "/inicio.html");
});


app.get("/contacto", (req, res) => {
  res.sendFile(__dirname + "/contactenos.html");
});

app.get("/calidad", (req, res) => {
  res.sendFile(__dirname + "/map.html");
});

app.get("/index", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
 
app.listen(port, () => {
  console.log("Server listening on port " + port);
})




//Instantiate MongoClient
var mongo = require('mongodb').MongoClient;
//Assert library (Perhaps overkill if you are writing production-level code)
var assert = require('assert');
//Express engine
var express = require('express');

//URL for my mongo instance
//Connecting to the blog database
var url = 'mongodb://localhost:27017/aire';

//Instantiate express
var router = express();
app.get('/data', function(req, res, next) {
  var resultArray = [];
  mongo.connect(url, function(err, db){
    assert.equal(null, err);
    var cursor = db.collection('aires').find();
    cursor.forEach(function(doc, err){
      assert.equal(null, err);
      resultArray.push(doc);
    }, function(){
      db.close();
      //I have no index file to render, so I print the result to console
      //Also send back the JSON string bare through the channel
      console.log("Resultados");
      //var arr = resultArray[0].split(",").map(function (val) { return +val + 1; });
      //console.log(arr);
      console.log(resultArray);
      res.send(resultArray);
      //res.send(arr);
    });
  });
});



var MongoClient = require('mongodb').MongoClient;
global.pagina; //Delclaration of the global variable - undefined
global.pagina1 = '<!--Inicio-->'; 
global.pagina2 = '<!--Inicio-->'; 
global.pagina3 = '<!--Inicio-->';
global.pagina4 = ''; 


app.get('/analisis', function(req, res, next) {


   
      var fs = require('fs'),
          path = require('path'),    
          filePath = path.join(__dirname, 'part1.html');

      fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
          if (!err) {
              global.pagina1 = data;





          var fs2 = require('fs');
          var stream = fs2.createWriteStream("calidadaire.html");
          stream.once('open', function(fd) {
            stream.write(data);
            stream.end();
          });








              //console.log('---------------\n: ' + global.pagina);
              //response.writeHead(200, {'Content-Type': 'text/html'});
              //res.send(data);
              //response.end();
          } else {
              console.log(err);
          }
      });





    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      db.collection("aires").find({}, { _id: false }).toArray(function(err, result) {
        if (err) throw err;
          var horaMinima = "";
          var horaMaxima = "";
          var cantidadMaxima = 0;
          var cantidadMinima = 0;
          var latitudActual = 0;
          var altitudActual = 0;
          var sumatoria = 1;
          var concurrencia = 1;
          var promedio = 0;

          for(var i = 0; i < result.length;i++)
          {  
            console.log("-----------------");    
            if(result[i].latitud == latitudActual && result[i].longitud == altitudActual)
            {
              console.log("Actual %d Concurrente %d",latitudActual,result[i].latitud);
              sumatoria = sumatoria + result[i].co2;
              concurrencia = concurrencia + 1;
              
              if(result[i].co2> cantidadMaxima)
              {
                cantidadMaxima = result[i].co2;
                horaMaxima = result[i].fecha;
              }
              if(result[i].co2 < cantidadMinima)
              {
                cantidadMinima = result[i].co2;
                horaMinima = result[i].fecha;
              }   

              
              console.log("sumatoria" + sumatoria);
              console.log(concurrencia);

            }   
            else
            {

                promedio = sumatoria / concurrencia;
                console.log("Promedio: " +promedio);

                var salud ='Altisimo';
                
                if (promedio < 350) 
                {
                      salud = "Nulo, el PPM de co2 es muy bajo. El aire es puro.";
                      salud = salud + "Hora de Mayor contaminacion: " +  horaMaxima + "Con un PPM de co2 de " + cantidadMaxima;
                      salud = salud + "Hora de Menor contaminacion: " +  horaMinima + "Con un PPM de co2 de " + cantidadMinima;
                }
                if (350< promedio && promedio< 450) 
                {
                      salud = "Casi nulo, el PPM de co2 es muy bajo, El aire es fresco.";
                      salud = salud + "Hora de Mayor contaminacion: " +  horaMaxima + "Con un PPM de co2 de " + cantidadMaxima;
                      salud = salud + "Hora de Menor contaminacion: " +  horaMinima + "Con un PPM de co2 de " + cantidadMinima;
                }
                if (450< promedio && promedio< 700) 
                {
                      salud = "Bajo, el PPM de co2 es  bajo. El aire está en condiciones normales.";
                      salud = salud + "Hora de Mayor contaminacion: " +  horaMaxima + "Con un PPM de co2 de " + cantidadMaxima;
                      salud = salud + "Hora de Menor contaminacion: " +  horaMinima + "Con un PPM de co2 de " + cantidadMinima;                      
                }
                if (700< promedio && promedio < 1000) 
                {
                      salud = "Medio, el PPM de co2 es poco. El aire está levemente contaminado.";
                      salud = salud + "Hora de Mayor contaminacion: " +  horaMaxima + "Con un PPM de co2 de " + cantidadMaxima;
                      salud = salud + "Hora de Menor contaminacion: " +  horaMinima + "Con un PPM de co2 de " + cantidadMinima;                      
                }      
                if (1000< promedio && promedio < 2500) 
                {
                      salud = "Medio alto, el PPM de co2 es alto. El aire está bastante contaminado. Evite pasar por allí.";
                      salud = salud + "Hora de Mayor contaminacion: " +  horaMaxima + "Con un PPM de co2 de " + cantidadMaxima;
                      salud = salud + "Hora de Menor contaminacion: " +  horaMinima + "Con un PPM de co2 de " + cantidadMinima;                      
                }    
                if (2500 < promedio && promedio < 5000) 
                {
                      salud = "Alto, el PPM de co2 está muy alto. Evite a toda costa pasar por allí.";
                      salud = salud + "Hora de Mayor contaminacion: " +  horaMaxima + "Con un PPM de co2 de " + cantidadMaxima;
                      salud = salud + "Hora de Menor contaminacion: " +  horaMinima + "Con un PPM de co2 de " + cantidadMinima;                      
                }                                                          
                global.pagina1 = global.pagina1 + '\tmarker = new google.maps.Marker({\n';
                global.pagina1 = global.pagina1 + '\tposition: {lat:'+latitudActual+', lng: ' +altitudActual+'},\n';
                global.pagina1 = global.pagina1 + '\tmap: map,';
                global.pagina1 = global.pagina1 + '\ttitle: \' Cantidad de particulas Promedio de co2: ' + promedio + ' Riesgo para la salud: '+salud+ '\'\n';
                global.pagina1 = global.pagina1 + '\t});\n';     


               cantidadMaxima = result[i].co2;
               cantidadMinima = result[i].co2;
               latitudActual = result[i].latitud;
               altitudActual = result[i].longitud;
               sumatoria = result[i].co2;
               concurrencia = 1;
               promedio = result[i].co2;                         
            }

          //console.log("Altitud " +result[1].latitud);
  //        res.send("Altitud " +result[1].latitud);
          }
        db.close();
      });
    });





// Parte 2


      filePath = path.join(__dirname, 'part2.html');

      fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data3){
          if (!err) {
              global.pagina2 = data3;






          var fs3 = require('fs');
          var stream3 = fs3.createWriteStream("calidadaire.html");
          stream3.once('open', function(fd) {
            stream3.write(data3);
            stream3.end();
          });





              //console.log('---------------\n: ' + global.pagina);
              //response.writeHead(200, {'Content-Type': 'text/html'});
              //res.send(data);
              //response.end();
          } else {
              console.log(err);
          }
      });





// Parte 3 

    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      db.collection("aires").find({}, { _id: false }).toArray(function(err, result) {
        if (err) throw err;
          var horaMinima = "";
          var horaMaxima = "";
          var cantidadMaxima = 0;
          var cantidadMinima = 0;
          var latitudActual = 0;
          var altitudActual = 0;
          var sumatoria = 1;
          var concurrencia = 1;
          var promedio = 0;

          for(var i = 0; i < result.length;i++)
          {  
            console.log("-----------------");    
            if(result[i].latitud == latitudActual && result[i].longitud == altitudActual)
            {
              console.log("Actual %d Concurrente %d",latitudActual,result[i].latitud);
              sumatoria = sumatoria + result[i].co2;
              concurrencia = concurrencia + 1;
              
              if(result[i].co2> cantidadMaxima)
              {
                cantidadMaxima = result[i].co2;
                horaMaxima = result[i].fecha;
              }
              if(result[i].co2 < cantidadMinima)
              {
                cantidadMinima = result[i].co2;
                horaMinima = result[i].fecha;
              }   

              
              console.log("sumatoria" + sumatoria);
              console.log(concurrencia);

            }   
            else if(i>1)
            {

                promedio = sumatoria / concurrencia;
                console.log("Promedio: " +promedio);

                var salud ='Altisimo';
                
                if (promedio < 350) 
                {
                      salud = "<p>Nulo, el PPM de co2 es muy bajo. <br>El aire es puro.<br>";
                      salud = salud + "Hora de Mayor contaminacion: " +  horaMaxima + "Con un PPM de co2 de " + cantidadMaxima;
                      salud = salud + "<br>Hora de Menor contaminacion: " +  horaMinima + "Con un PPM de co2 de " + cantidadMinima +'</p>';
                }
                if (350< promedio && promedio< 450) 
                {
                      salud = "<p>Casi nulo, el PPM de co2 es muy bajo, <br>El aire es fresco.<br>";
                      salud = salud + "<br>Hora de Mayor contaminacion: " +  horaMaxima + "Con un PPM de co2 de " + cantidadMaxima;
                      salud = salud + "<br>Hora de Menor contaminacion: " +  horaMinima + "Con un PPM de co2 de " + cantidadMinima+'</p>';
                }
                if (450< promedio && promedio< 700) 
                {
                      salud = "<p>Bajo, el PPM de co2 es  bajo. El aire está en condiciones normales.";
                      salud = salud + "Hora de Mayor contaminacion: " +  horaMaxima + "Con un PPM de co2 de " + cantidadMaxima;
                      salud = salud + "Hora de Menor contaminacion: " +  horaMinima + "Con un PPM de co2 de " + cantidadMinima+'</p>';                      
                }
                if (700< promedio && promedio < 1000) 
                {
                      salud = "<p>Medio, el PPM de co2 es poco. <br>El aire está levemente contaminado.";
                      salud = salud + "<br>Hora de Mayor contaminacion: " +  horaMaxima + "Con un PPM de co2 de " + cantidadMaxima;
                      salud = salud + "<br>Hora de Menor contaminacion: " +  horaMinima + "Con un PPM de co2 de " + cantidadMinima+'</p>';                      
                }      
                if (1000< promedio && promedio < 2500) 
                {
                      salud = "<p>Medio alto, el PPM de co2 es alto.<br> El aire está bastante contaminado. <br>Evite pasar por allí.";
                      salud = salud + "<br>Hora de Mayor contaminacion: " +  horaMaxima + "Con un PPM de co2 de " + cantidadMaxima;
                      salud = salud + "<br>Hora de Menor contaminacion: " +  horaMinima + "Con un PPM de co2 de " + cantidadMinima+'</p>';                      
                }    
                if (2500 < promedio && promedio < 5000) 
                {
                      salud = "<p>Alto, el PPM de co2 está muy alto.<br> Evite a toda costa pasar por allí.";
                      salud = salud + "<br>Hora de Mayor contaminacion: " +  horaMaxima + "Con un PPM de co2 de " + cantidadMaxima;
                      salud = salud + "<br>Hora de Menor contaminacion: " +  horaMinima + "Con un PPM de co2 de " + cantidadMinima+'</p>';                      
                }                



              global.pagina4 = global.pagina4 +          '<tr>\n';
              global.pagina4 = global.pagina4 +            '<th>Latitud</th>\n';
              global.pagina4 = global.pagina4 +            '<th>'+latitudActual+'</th>\n';
              global.pagina4 = global.pagina4 +          '</tr>\n';
              global.pagina4 = global.pagina4 +          '<tr>\n';
              global.pagina4 = global.pagina4 +            '<th>Altitud</th>';
              global.pagina4 = global.pagina4 +            '<th>'+altitudActual+'</th>\n';             
              global.pagina4 = global.pagina4 +          '</tr>\n';
              global.pagina4 = global.pagina4 +          '<tr>\n';
              global.pagina4 = global.pagina4 +            '<th>Direccion</th>\n';
              global.pagina4 = global.pagina4 +            '<th></th>\n';
              global.pagina4 = global.pagina4 +          '</tr>\n';
              global.pagina4 = global.pagina4 +          '<tr>\n';
              global.pagina4 = global.pagina4 +            '<th>Cantidad Promedio de PPM CO</th>\n';
              global.pagina4 = global.pagina4 +            '<th>'+promedio+'</th>\n';             
              global.pagina4 = global.pagina4 +          '</tr>\n';
              global.pagina4 = global.pagina4 +          '<tr>\n';
              global.pagina4 = global.pagina4 +            '<th>Calidad del Aire</th>\n';
              global.pagina4 = global.pagina4 +            '<th>'+salud+'</th>\n';
              global.pagina4 = global.pagina4 +          '</tr>\n'; 
               cantidadMaxima = result[i].co2;
               cantidadMinima = result[i].co2;
               latitudActual = result[i].latitud;
               altitudActual = result[i].longitud;
               sumatoria = result[i].co2;
               concurrencia = 1;
               promedio = result[i].co2;                         
            }

          //console.log("Altitud " +result[1].latitud);
  //        res.send("Altitud " +result[1].latitud);
          }
        db.close();
      });
    });


// Parte 4


      filePath = path.join(__dirname, 'part3.html');

      fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data4){
          if (!err) {
              global.pagina3 = data4;






          var fs4 = require('fs');
          var stream4 = fs4.createWriteStream("calidadaire.html");
          stream4.once('open', function(fd) {
            stream4.write(data4);
            stream4.end();
          });





              //console.log('---------------\n: ' + global.pagina);
              //response.writeHead(200, {'Content-Type': 'text/html'});
              //res.send(data);
              //response.end();
          } else {
              console.log(err);
          }
      });



 res.send(global.pagina1 + global.pagina2 + global.pagina4 +global.pagina3);


});




