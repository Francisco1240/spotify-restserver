const { response } = require('express');
const axios = require('axios');
require('dotenv').config();
const { getRandonString } = require('../helpers/randomString');

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const redirectUri = process.env.REDIRECT_URI;
const frontEndUri = process.env.FRONTEND_URI;

// const CLIENT_ID = '0a6ab43cb7c5426ab9182069574572a9';
// const CLIENT_SECRET = 'b9b65f58880e481aa35c339db3f456a4';
// const redirectUri = 'http://localhost:4200/auth/callback';
// const frontEndUri = 'http://localhost:3000';

const stateKey = 'spotify_auth_state';

const login = (req, res = response ) => {
    const state = getRandonString( 16 );
    const scope = 'user-read-private user-read-email';
    //res.cookie(stateKey, state);

    res.redirect(`https://accounts.spotify.com/authorize?response_type=code&client_id=${ CLIENT_ID }&scope=${ scope }&redirect_uri=${ redirectUri }&state=${ state }`);
}

const callback = ( req, res = response ) => {
    const { code, state, error } = req.query;

    if ( error ) {
        res.redirect(`/#error=state_mismatch`);
        return;
    }

    console.log( CLIENT_ID, CLIENT_SECRET, frontEndUri )

    console.log( code )

    // axios({
    //     method: 'post',
    //     url: 'https://accounts.spotify.com/api/token',
    //     data : {
    //         code: code,
    //         redirect_uri: frontEndUri,
    //         grant_type: 'authorization_code'
    //     },
    //     headers: {
    //         'content-type': 'application/x-www-form-urlencoded',
    //         'Authorization': 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET ).toString('base64')
    //     }
    // })
    // .then( ( response ) => {
    //     if ( response.status === 200 ) {
    //         res.send(  response.data );
    //     } else {
    //         res.send( response );
    //     }
    // })
    // .catch ( ( error ) => {
    //     res.send( error );
    // });
}

module.exports = {
    login,
    callback
}