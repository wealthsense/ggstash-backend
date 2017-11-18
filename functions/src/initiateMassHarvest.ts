'use strict';

import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import {Request, Response} from 'express';

/**
 * Initiates harvest for all users
 * Trigger: daily / hourly (via cronjob invoking the REST API)
 */
const handler = async (req: Request, res: Response) => {

    const promises = [];

    // query all users TODO: later, for now hard-code to one
    const userDocument = admin.firestore().collection('users').doc('ThREFBJE75IaZytedQme');
    const harvestInitialAttributes = {};
    await promises.push(userDocument.collection('harvests').add(harvestInitialAttributes));

    await Promise.all(promises);

    // Send back a message that we've successfully initiated the population of the demo data
    return res.json({
        result: `Successfully initiated a mass harvest`,
        usersCount: promises.length,
    });

};
export const listener = functions.https.onRequest(handler);
