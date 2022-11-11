const path = require('path');
const fs = require('fs');


class Ticket {
    constructor(numero, escritorio) {
        this.numero = numero;
        this.escritorio = escritorio;
    }
}

class TicketControl {

    constructor() {
        this.ultimo = 0;
        this.hoy = new Date().getDate();
        this.tickets = [];
        this.ultimos4 = [];

        this.init();
    }

    get toJson() {
        return {
            ultimo: this.ultimo,
            hoy: this.hoy,
            tickets: this.tickets,
            ultimos4: this.ultimos4
        }
    }

    init() {
        const {hoy, ultimo, tickets, ultimos4} = require('../db/data.json');
        
        if (hoy === this.hoy) {
            // Si estamos en el mismo día, se recuperan los datos de la base de datos
            this.ultimo = ultimo;
            this.tickets = tickets;
            this.ultimos4 = ultimos4;
        } else {
            // Si es otro día, se guardan los datos reinicializados
            this.guardarDB();
        }
    }

    guardarDB() {

        const rutaDB = path.join(__dirname, '../db/data.json');
        fs.writeFileSync(rutaDB, JSON.stringify(this.toJson));

    }

    siguiente() {
        this.ultimo += 1;
        this.tickets.push(new Ticket(this.ultimo, null));
        this.guardarDB();

        return `Ticket ${this.ultimo}`;
    }

    atenderTicket( escritorio ) {

        if (this.tickets.length === 0) {
            return null;
        }

        const ticket = this.tickets.shift(); // se extrae this.tickets[0] del array
        ticket.escritorio = escritorio;

        this.ultimos4.unshift(ticket);

        if (this.ultimos4.length > 4) {
            this.ultimos4.pop();
        }

        this.guardarDB();

        return ticket;
    }

}

module.exports = TicketControl;