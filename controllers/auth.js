const { response } = require('express');
const axios = require('axios');
require('dotenv').config();
const { getRandonString } = require('../helpers/randomString');

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const redirectUri = process.env.REDIRECT_URI;
const frontEndUri = process.env.FRONTEND_URI;

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

    axios({
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        data : {
            code: code,
            redirect_uri: frontEndUri,
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
    .catch(function (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log('error response');
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log('error request');
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('error message');
          console.log('Error', error.message);
        }
        console.log(error.config);
        res.send( error );
      });
}

module.exports = {
    login,
    callback
}