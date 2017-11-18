'use strict';

import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { refreshUserAvailableCredits } from './lib/refreshUserAvailableCredits';

/**
 * Query total sum from harvests, deduct total sum from purchases, save as user.availableCredits
 * Triggers: new harvest document, new harvest document
 */
const handler = async (event: functions.Event<any>) => {

    // TODO: ONLY FINISHED TRANSFERS

    const harvestDocumentReference = event.data.ref;
    const harvestsCollectionReference = harvestDocumentReference.parent;
    const userRef = harvestsCollectionReference.parent;

    console.log('harvestDocumentReference: ', harvestDocumentReference);
    console.log('harvestsCollectionReference: ', harvestsCollectionReference);
    console.log('userRef: ', userRef);

    const userDocumentSnapshot = await userRef.get();

    if (userDocumentSnapshot.exists) {
        console.log('userDocumentSnapshot: ', userDocumentSnapshot);
        await refreshUserAvailableCredits(userDocumentSnapshot);
    }

    return;

};
export const listener = functions.firestore.document('/users/{userId}/harvests/{harvestId}').onCreate(handler);
