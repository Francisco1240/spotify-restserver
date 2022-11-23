const { response } = require('express');
const axios = require('axios');
const querystring = require('querystring');
require('dotenv').config();
const { getRandonString } = require('../helpers/randomString');

const CLIENT_ID = process.CLIENT_ID;
const CLIENT_SECRET = process.CLIENT_SECRET;
const redirectUri = process.REDIRECT_URI;

const stateKey = 'spotify_auth_state';

const login = (req, res = response ) => {
    const state = getRandonString( 16 );
    const scope = 'user-read-private user-read-email';
    //res.cookie(stateKey, state);

    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: CLIENT_ID,
            scope: scope,
            redirect_uri: redirectUri,
            state: state
        })
    );
}

const callback = ( req, res = response ) => {
    const { code, state, error } = req.query;

    if ( error ) {
        res.redirect('/#' + querystring.stringify({ error: 'state_mismatch' }));
        return;
    }

    axios({
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        data : {
            code: code,
            redirect_uri: 'http://localhost:4200/auth/callback',
            grant_type: 'authorization_code'
        },
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET ).toString('base64')
        }
    })
    .then( ( response ) => {
        if ( response.status === 200 ) {
            res.send(  response.data );
        } else {
            res.send( response );
        }
    })
    .catch ( ( error ) => {
        res.send( error );
    });
}

module.exports = {
    login,
    callback
}