// Import
const express = require('express');
const path = require('path');
const route = require('./routes/myRoute').router


// Instanciation server
const server = express();


// body parsing via express
server.use(express.urlencoded({extended: true}));
server.use(express.json());


// config view engine
server.set('view engine', 'ejs');
server.set('views', path.join(__dirname, 'views'));
server.set('/img', path.join(__dirname + 'public/img'));
server.set('/css', path.join(__dirname + 'public/css'));
server.set('/js', path.join(__dirname + 'public/js'));
server.use(express.static(__dirname+ '/public'))

//ROUTES

server.use(route);


// Launch server
server.listen(8081, () =>{
    console.log( 'Server en écoute  http://localhost:8081');
});
