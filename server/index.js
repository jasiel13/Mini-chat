//cargar modulo de express
var express = require('express');

//llamar a la funcion express que viene del modulo de express
var app = express();

//cargar la libreria http de node y le pasamos la funcion de express
var server = require('http').Server(app);

//cargamos la libreria de los sockets y le pasamos la variable server que creamos 
var io = require('socket.io')(server);

//cargar una vista estatica por defecto con un middleware de express (cargara el index.html)
app.use(express.static('client'));

//creamos una ruta de prueba para ver el funcionamiento de express
app.get('/hola-mundo',function(req,res){
    res.status(200).send('hola mundo de nuevo');
});

//aqui se define el array donde se almacenaran los mensajes en formato json
var messages=[{
    id:1,
    text:'Bienvenido al chat privado con socket.io y node.js de Jasiel Becerra...',
    nickname:'Jasiel13'
}];

/*1-abrir la conexion con los socket y permitir ejecutar eventos este evento permite recibir las conexiones de los clientes
2-la funcion del callback recibe una variable socket que contiene toda la informacion del mismo
3-en el console recibimos la ip del cliente que se conecta con socket.handshake*/
io.on('connection',function(socket){
    console.log("El cliente con ip:"+socket.handshake.address+" se ha conectado...");

    //cuando se conecte los clientes aqui le emitimos el mensaje
    socket.emit('messages',messages);

    //recoger el evento desde el cliente en main.js llamado add-menssage
    socket.on('add-message',function(data){
          //hacemos un push al array de mensajes para cargarlo de mas datos
          messages.push(data);

          //emitir a todos los clientes del chat que esten conectados los mensajes nuevos actualizados
          io.sockets.emit('messages',messages);
    });
});

//creamos un servidor con express le ponemos el puerto de escucha esta es la conexion
server.listen(6677,function(){
    console.log('Servidor esta corriendo perfectamente');
});