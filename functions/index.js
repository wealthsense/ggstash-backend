// [START import]
// Note: these tasks need to be initialized in index.js and
// NOT in child functions:
// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
// [END import]

// This file is the main index file that is deployed to
// firebase cloud and it's purpose is to require
// and export all subfolder-separated functions

if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'connectWithBank') {
    exports.connectWithBank = require('./api/connectWithBank')(functions, admin);
}

if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'refreshUserAvailableCredits_onFinishedHarvest') {
    exports.refreshUserAvailableCredits_onFinishedHarvest = require('./api/refreshUserAvailableCredits_onFinishedHarvest')(functions, admin);
}

if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'refreshUserAvailableCredits_onFinishedTransfer') {
    exports.refreshUserAvailableCredits_onFinishedTransfer = require('./api/refreshUserAvailableCredits_onFinishedTransfer')(functions, admin);
}

if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'transfer') {
    exports.transfer = require('./api/transfer')(functions, admin);
}

if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'initiateMassHarvest') {
    exports.initiateMassHarvest = require('./api/initiateMassHarvest')(functions, admin);
}

if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'harvest') {
    exports.harvest = require('./api/harvest')(functions, admin);
}

if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'purchase') {
    exports.purchase = require('./api/purchase')(functions, admin);
}

exports.healthCheck = functions.https.onRequest((request, response) => {
    response.send("OK");
});
