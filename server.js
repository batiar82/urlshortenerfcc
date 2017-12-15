// server.js
// where your node app starts

// init
// setup express for handling http reqs
var express = require("express");
var app = express();
var path = require('path');
 
// setup our datastore
//    db = database
app.listen(3000, function(){
    console.log('listening on 3000')
  });

//var datastore = require("./datastore").sync;
//datastore.initializeApp(app);
//var MongoClient = require('mongodb').MongoClient;
var MONGODB_URI = 'mongodb://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST+':'+process.env.DB_PORT+'/'+process.env.DB;
var mongoose = require('mongoose');
mongoose.connect(MONGODB_URI);
var urlSchema = mongoose.Schema({
    original_url: String,
    short_url: String,
});
var url=mongoose.model('url',urlSchema);

// create routes
app.get("/", function (req, res) {
  try {
    console.log("Entro a /");
    //res.sendFile(path.join(__dirname+'/sitemap.html'));
    res.sendFile(path.join(__dirname + '/views/index.html'));
    //res.json('index.html');
  } catch (err) {
    console.log("Error: " + err);
  }
});
app.get("/:name", function (req, res) {
  try {
    console.log("Me llaman con el numero: "+req.params.name);
    var fullUrl = req.protocol + '://' + req.get('host')+'/'+req.params.name;
    url.findOne({short_url: fullUrl},function(err,doc){
      console.log("encontre "+doc+" nulo?  "+(doc===null));
      if (doc===null)
        res.json("URL no encontrada");
      else {
        console.log("Me voy a redirect a: "+doc.original_url);
        res.redirect(doc.original_url);
      }
    });
  } catch (err) {
    console.log("Error: " + err);
    
  }
});
app.get("/new/:name(*)", function (req, response) {
  try {
    console.log("Me llaman con "+req.params.name);
    var can=0;
    var nueva= new url({
        original_url: req.params.name
      });
    url.findOne({original_url : req.params.name},function(err,doc){
      console.log("encontre "+doc);
      if (doc===null){
        url.count(function(f,resultado){
        can=resultado;
        }).then(function(){
        var fullUrl = req.protocol + '://' + req.get('host')+'/'+can;
        nueva.short_url= fullUrl;
        nueva.save();
        console.log("fui a salvar antes");
        //console.log("Fui a salvar "+nueva+" res "+res);
        //response.json({nueva});
        //res.json(nueva);
        response.json({ original_url:nueva.original_url, short_url:nueva.short_url });
    });
      }else{console.log("Ya existe esa web "+doc);
           }
    //    res.json("EL FINAL");
    });
    
    
    
 /*
app.get("/new/:name", function (req, res) {
  try {
    console.log("Me llaman con "+req.params.name);
    var can=6;
    url.count(function(f,res){
      can=res;
    }).then(function(){
      var fullUrl = req.protocol + '://' + req.get('host')+'/'+can;
      var nueva= new url({
        original_url: req.params.name,
        short_url: fullUrl
      });
      nueva.save();
     
    });
    */
  //  db.collection('urls').insert({"original_url": req.params.name,"short_url":"http://glitch.com/"+cantidad});
    //if(existe.length===0){
     // var cantidad=db.collection('urls').find().count();
     // console.log("cantidad "+cantidad);
      //db.collection('urls').insert()
      res.json();
    
  } catch (f) {
    console.log("Error "+f);
  }
});
