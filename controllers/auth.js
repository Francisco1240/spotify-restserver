const { response } = require('express');
const axios = require('axios');
const qs = require('qs');
require('dotenv').config();
const { getRandonString } = require('../helpers/randomString');
const { getCircularReplacer } = require('../helpers/getCircularReplace');

// const CLIENT_ID = process.env.CLIENT_ID;
// const CLIENT_SECRET = process.env.CLIENT_SECRET;
// const redirectUri = process.env.REDIRECT_URI;

const CLIENT_ID = '0a6ab43cb7c5426ab9182069574572a9';
const CLIENT_SECRET = '255bced773424182975034a0c2f584f8';
const redirectUri = 'http://localhost:4200/auth/callback';

const stateKey = 'spotify_auth_state';

const login = (req, res = response ) => {
  const state = getRandonString( 16 );
  const scope = 'user-read-private user-read-email user-follow-read user-top-read user-library-read user-read-currently-playing';
  //res.cookie(stateKey, state);

  res.redirect(`https://accounts.spotify.com/authorize?response_type=code&client_id=${ CLIENT_ID }&scope=${ scope }&redirect_uri=${ redirectUri }&state=${ state }`);
}

const callback = ( req, res = response ) => {
  const { code, state, error } = req.query;

  if ( error ) {
    res.redirect(`/#error=state_mismatch`);
    return;
  }

  try {
    const data = qs.stringify({
      'code': code,
      'redirect_uri': redirectUri,
      'grant_type': 'authorization_code' 
    });
  
    const config = {
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      headers: { 
        'Accept': 'application/json', 
        'Accept-Encoding': 'identity',
        'Authorization': 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET ).toString('base64'), 
        'Content-Type': 'application/x-www-form-urlencoded', 
        'Cookie': 'sp_t=77727ea3400e3dccc978c1dd5f03971b; __Host-device_id=AQC3M5jjecJCY-ZchVsfNyi_cH-l5lzKDYR5TSZoMJMoAqMgBgCzy-bV5G1bw3PYQRFzfZqxoeyHviVceW9J4uekXADKuLQAlvg; sp_tr=false'
      },
      data : data,
      params: { trophies: true }
    };
    
    axios( config )
    .then( function ( response ) {
      if(  response.status === 200) {
        res.send( JSON.stringify(response.data, getCircularReplacer()) );
      } else {
        res.send( JSON.stringify(response, getCircularReplacer()) );
      }
    })
    .catch(function (error) {
      res.send( JSON.stringify(error, getCircularReplacer()) );
    });
  } catch ( ex ) {
    console.log( ex.message );
  }
}

module.exports = {
    login,
    callback
}