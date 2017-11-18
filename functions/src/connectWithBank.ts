'use strict';

// CORS Express middleware to enable CORS Requests.
const cors = require('cors')({origin: true});

/**
 * Connect with bank (possibly via smart id authorization etc)
 * Trigger: user action in app (REST API)
 */
module.exports = function (functions, admin) {

    return functions.https.onRequest((req, res) => {

        // Enable CORS using the `cors` express middleware.
        cors(req, res, () => {

            return;

        });

    });

};
