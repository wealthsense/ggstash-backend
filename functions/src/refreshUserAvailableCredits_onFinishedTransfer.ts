'use strict';

import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { refreshUserAvailableCredits } from './lib/refreshUserAvailableCredits';

/**
 * Query total sum from transfers, deduct total sum from purchases, save as user.availableCredits
 * Triggers: new transfer document, new transfer document
 */
const handler = async (event: functions.Event<any>) => {

    // TODO: ONLY FINISHED TRANSFERS

    const transferDocumentReference = event.data.ref;
    const transfersCollectionReference = transferDocumentReference.parent;
    const userRef = transfersCollectionReference.parent;

    console.log('transferDocumentReference: ', transferDocumentReference);
    console.log('transfersCollectionReference: ', transfersCollectionReference);
    console.log('userRef: ', userRef);

    const userDocumentSnapshot = await userRef.get();

    if (userDocumentSnapshot.exists) {
        console.log('userDocumentSnapshot: ', userDocumentSnapshot);
        await refreshUserAvailableCredits(userDocumentSnapshot);
    }

    return;

};
export const listener = functions.firestore.document('/users/{userId}/transfers/{transferId}').onCreate(handler);
