'use strict';

import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

// CORS Express middleware to enable CORS Requests.
const cors = require('cors')({origin: true});

/**
 * Connect with bank (possibly via smart id authorization etc)
 * Trigger: user action in app (REST API)
 */
export const listener = functions.https.onRequest((req, res) => {

    // Enable CORS using the `cors` express middleware.
    cors(req, res, () => {

        return;

    });

});
