import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

export const listener = functions.https.onRequest((request, response) => {
    response.send("OK");
});
