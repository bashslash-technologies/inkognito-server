'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const {handleError, handleNotFound} = require('./middlewares');
require('./cache');

module.exports = function() {
    let app = express();
    let server = http.Server(app);
    let io = socketIo(server);

    let create = function(config) {
        let routes = require('./routes');

        app.set('env', config.env);
        app.set('port', config.app.port);
        app.set('hostname', config.app.hostname);

        app.use(cors())
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(logger('dev'));

        mongoose.connect(config.database.uri, {
            auth: {
                user: config.database.user,
                password: config.database.password
            },
            dbName: config.database.name,
            authSource: 'admin',
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        .then(function({connections}) {
            let {host, port, name} = connections[0];
            console.log('Database ' + name + ' connected on http://' + host + ':' + port);
        })
        .catch(function(err) {
            if (err) {
                console.log(err)
                process.exit(0)
            }
        });
        routes.init(app, io);
        
        app.use(handleError);
        app.use(handleNotFound);
    };

    let start = function() {
        let hostname = app.get('hostname');
        let port = app.get('port');

        server.listen(port, function() {
            console.log('App running on - http://' + hostname + ':' + port);
        });
    }

    return ({create: create, start: start});
};
