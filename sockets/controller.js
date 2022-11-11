const TicketControl = require('../models/ticket-control');

const ticketControl = new TicketControl();

const socketController = (socket) => {

    socket.emit('ultimo-ticket', ticketControl.ultimo);
    socket.emit('estado-actual', ticketControl.ultimos4);
    socket.emit('tickets-pendientes', ticketControl.tickets.length);

    socket.on('siguiente-ticket', ( payload, callback ) => {
        
        const siguiente = ticketControl.siguiente();
        callback(siguiente);
        
        socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length);
        //socket.emit('tickets-pendientes', ticketControl.tickets.length);

    });

    socket.on('atender-ticket', ( payload, callback ) => {
        
        if (!payload.escritorio) {
            return callback({
                ok: false,
                msg: 'El escritorio es obligatorio'
            })
        }

        const ticket = ticketControl.atenderTicket(payload.escritorio);

        socket.broadcast.emit('estado-actual', ticketControl.ultimos4);
        socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length);
        socket.emit('tickets-pendientes', ticketControl.tickets.length);

        if (ticket) {
            callback({
                ok: true,
                msg: 'Ticket disponible',
                ticket
            });
        } else {
            callback({
                ok: false,
                msg: 'No hay tickets pendientes'
            });
        }

    });

}



module.exports = {
    socketController
}

