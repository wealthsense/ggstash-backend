'use strict';

import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import {purchase} from './lib/purchase';

/**
 * Execute a purchase of a product (NOT in hackathon: issuing a partial Settlement against the IOUs (or maybe easier just issue a Transaction
 * which decreases the available balance upon a later aggregate))
 * Trigger: new purchase document
 */
const handler = async (event: functions.Event<any>) => {

    const purchaseDocumentReference = event.data.ref;
    const purchasesCollectionReference = purchaseDocumentReference.parent;
    const userRef = purchasesCollectionReference.parent;

    console.log('purchaseDocumentReference: ', purchaseDocumentReference);
    console.log('purchasesCollectionReference: ', purchasesCollectionReference);
    console.log('userRef: ', userRef);

    const userDocumentSnapshot = await userRef.get();

    if (userDocumentSnapshot.exists) {
        console.log('userDocumentSnapshot: ', userDocumentSnapshot);
        await purchase(userDocumentSnapshot, purchaseDocumentReference);
    } else {
        console.log('userDocumentSnapshot does not exist');
    }

    return;

};
export const listener = functions.firestore.document('/users/{userId}/purchases/{purchaseId}').onCreate(handler);
