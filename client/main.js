//conectar al cliente al socket
var socket = io.connect('http://192.168.1.62:6677',{'forceNew':true});

//aqui lo que se emitio desde el servidor en este caso el mensaje lo recibe el cliente
socket.on('messages',function(data){
    console.log(data);
    //cuando el socket me envie los mensajes y la funcion renderizaremos los datos
    render(data);
});

//funcion para poder pintar el array de datos en el html
function render(data){
    //con .map permite recorrer el objeto json 
    var html=data.map(function(message,index){
        return (`
            <div class="message">
                <strong>${message.nickname}</strong> dice:
                <p>${message.text}</p>
            </div>
        `);
    }).join('');//meter espacio entre elementos con join

    /*1-meter los datos en el div del html que mostrara los datos(esto se hizo con javascript puro)
    2-ademas con la propiedad scrollHeigt escroleamos automaticamente cada que se reciban nuevos msn*/
    var contenedor_msn=document.getElementById('messages');
    contenedor_msn.innerHTML = html;
    contenedor_msn.scrollTop= contenedor_msn.scrollHeight;
  }  
 
  //crear la funcion(metodo) addMessage en el cliente
  function addMessage(e){
      //recogera los datos del mensaje enviado desde el formulario
      var message = {
          nickname: document.getElementById('nickname').value,
          text: document.getElementById('text').value
      };

      //ocultar el campo nickname para no poder cambiar el nombre del usuario y seguir mandando msn
      document.getElementById('nickname').style.display='none';
      document.getElementById('nick').style.display='none';

      //emitir un evento del cliente al socket del servidor
      socket.emit('add-message',message);
      document.getElementById('text').value='';
      return false;      
  }
  
//inicializamos el evento addeventlistener (este codigo lo hice yo solo para enviar el formulario al dar enter)
window.addEventListener('load',function(){
//seleccionamos el id de la textarea    
var input = document.querySelector("#text");
/*en el evento listener pasamos keypress para que ejecute al teclear una tecla recibe como parametos
el evento y una funcion callback*/
input.addEventListener('keypress',function(e){
    //con esto hacemos que keypress solo se ejecute al picar enter y no las demas teclas
    if (e.key === 'Enter'){
        //con esto evitamos que al dar enter se envie el simbolo de enter como dato en el objeto json
        e.preventDefault();
        //con esto obtenemos el valor de la textarea para validar si esta vacia
        var texto = document.getElementById('text').value;
        //si esta vacia mandamos la alerta
        if(texto==''){
            document.getElementById('oculto').style.display = 'block';
            }
            //sino esta vacia ejecutamos la funcion de arriba 
            else{               
                addMessage();
                document.getElementById('oculto').style.display = 'none';
            }          
          }    
      });
    });

