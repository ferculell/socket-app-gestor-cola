const lblEscritorio = document.querySelector('h1');
const btnAtender = document.querySelector('button');
const lblTicket = document.querySelector('small');
const divLista = document.querySelector('.alert');
const lblPendientes = document.querySelector('#lblPendientes');

const searchParams = new URLSearchParams(window.location.search);

if (!searchParams.has('escritorio')) {
    window.location = 'index.html';
    throw new Error('El escritorioes obligatorio');
}

const escritorio = searchParams.get('escritorio');
lblEscritorio.innerText = escritorio;

divLista.style.display = 'none';
//lblPendientes.innerText = null;

const socket = io();



socket.on('connect', () => {
    // console.log('Conectado');

    btnAtender.disabled = false;
});

socket.on('disconnect', () => {
    // console.log('Desconectado del servidor');
    
    btnAtender.disabled = true;
});

socket.on('ultimo-ticket', (payload) => {
    // lblNuevoTicket.innerText = `Ticket ${payload}`;
});

btnAtender.addEventListener( 'click', () => {
    
    socket.emit( 'atender-ticket', { escritorio }, ( respuesta ) => {
        if (respuesta.ok) {
            lblTicket.innerText = `Ticket ${respuesta.ticket.numero}`;
        } else {
            lblTicket.innerText = 'nadie.'
            divLista.style.display = 'block';
        }
    });

});