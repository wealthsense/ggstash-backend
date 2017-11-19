'use strict';

import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import {stash} from './lib/stash';

/**
 * Transfer the money from checkings account to the GGStash holding account in OP Bank + update account balances in firestore afterwards
 * Trigger: new transfer document
 */
const handler = async (event: functions.Event<any>) => {

    const stashingDocumentReference = event.data.ref;
    const stashingsCollectionReference = stashingDocumentReference.parent;
    const userRef = stashingsCollectionReference.parent;

    console.log('stashingDocumentReference: ', stashingDocumentReference);
    console.log('stashingsCollectionReference: ', stashingsCollectionReference);
    console.log('userRef: ', userRef);

    const userDocumentSnapshot = await userRef.get();

    if (userDocumentSnapshot.exists) {
        console.log('userDocumentSnapshot: ', userDocumentSnapshot);
        await stash(userDocumentSnapshot, stashingDocumentReference);
    } else {
        console.log('userDocumentSnapshot does not exist');
    }

    return;

};
export const listener = functions.firestore.document('/users/{userId}/stashings/{stashingId}').onCreate(handler);
