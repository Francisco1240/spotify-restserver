const express = require('express');
const cors = require('cors');

class Server {

    constructor() {
        this.app = express();
        this.port = 3000;
        this.paths = {
            auth: '/api/auth'
        };

        this.middelwares();
        this.routes();
    }

    middelwares() {
        this.app.use( cors() ); 
        // this.app.use( function(req, res, next ) {
        //     res.header('Access-Control-Allow-Origin','*');
        //     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        //     next();
        // });
        this.app.use( express.json() );
    }

    routes() {
        this.app.use( this.paths.auth, require('../routes/auth'));
    }

    listen() {
        this.app.listen( this.port )
    }
    
}

module.exports = Server;