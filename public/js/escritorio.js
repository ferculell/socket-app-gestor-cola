const lblEscritorio = document.querySelector('h1');
const btnAtender = document.querySelector('button');
const lblTicket = document.querySelector('small');
const divAlert = document.querySelector('#no-tickets');
const lblPendientes = document.querySelector('#lblPendientes');

const searchParams = new URLSearchParams(window.location.search);

if (!searchParams.has('escritorio')) {
    window.location = 'index.html';
    throw new Error('El escritorioes obligatorio');
}

const escritorio = searchParams.get('escritorio');
lblEscritorio.innerText = escritorio;

divAlert.style.display = 'none';

const socket = io();



socket.on('connect', () => {
    // console.log('Conectado');

    btnAtender.disabled = false;
});

socket.on('disconnect', () => {
    // console.log('Desconectado del servidor');
    
    btnAtender.disabled = true;
});

socket.on('tickets-pendientes', (payload) => {
    if (payload > 0) {
        divAlert.style.display = 'none';
        lblPendientes.style.display = 'block';
        lblPendientes.innerText = payload;
    } else {
        divAlert.style.display = 'block';
        lblPendientes.style.display = 'none';
    }
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
        }
    });

});