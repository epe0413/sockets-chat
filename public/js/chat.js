const url = ( window.location.hostname.includes('localhost'))
            ? 'http://localhost:8080/api/auth/'
            : '';

let usuario = null;
let socket = null;

// Referencias HTML
const txtUid = document.querySelector('#txtUid');
const txtMensaje = document.querySelector('#txtMensaje');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensajes = document.querySelector('#ulMensajes');
const btnSalir = document.querySelector('#btnSalir');
const iConnnect = document.querySelector('i');

const validarJWT = async() => {
    const token = localStorage.getItem('token') || '';

    if( token.length <= 10 ) {
        window.location = 'index.html';
        throw new Error('No hay token en el servidor');
    }

    const resp = await fetch( url, {
        headers: { 'x-token': token}
    });

    const { usuario: userDB, token: tokenDB} = await resp.json();
    localStorage.setItem( 'token', tokenDB);
    usuario = userDB;
    document.title = usuario.nombre;

    await conectarSocket();
}

const conectarSocket = async () => {
    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('connect', ()=> {
        iConnnect.style.color = "green";
        // console.log('Sokects online')
    });
    
    socket.on('disconnect', ()=> {
        iConnnect.style.color = "red";
        // console.log('Sokects offline')
    });

    socket.on('recibir-mensaje', () => {

    })
    
    socket.on('usuarios-activos', (payload) => {
        console.log(payload)
    })

    socket.on('mensaje-privado', () => {

    })
}

const main = async() => {

    await validarJWT();

}


main();


