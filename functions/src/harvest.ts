'use strict';

import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { harvest } from './lib/harvest';

/**
 * Poll stash balances, issue credits based on last time harvest was made (possibly via corda-check to be certain) and record issue of
 * credits in corda (queries OP APIs for client balances + credit-issuing script which use the Corda REST API (or similar) to record
 * the issue of credits for the clients)
 * Trigger: new harvest document
 */

const handler = async (event: functions.Event<any>) => {

    const harvestDocumentReference = event.data.ref;
    const harvestsCollectionReference = harvestDocumentReference.parent;
    const userRef = harvestsCollectionReference.parent;

    console.log('harvestDocumentReference: ', harvestDocumentReference);
    console.log('harvestsCollectionReference: ', harvestsCollectionReference);
    console.log('userRef: ', userRef);

    const userDocumentSnapshot = await userRef.get();

    if (userDocumentSnapshot.exists) {
        console.log('userDocumentSnapshot: ', userDocumentSnapshot);
        await harvest(userDocumentSnapshot, harvestDocumentReference);
    } else {
        console.log('userDocumentSnapshot does not exist');
    }

    return;

};

export const listener = functions.firestore.document('/users/{userId}/harvests/{harvestId}').onCreate(handler);
