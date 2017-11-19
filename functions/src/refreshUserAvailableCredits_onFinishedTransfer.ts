'use strict';

import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as FirebaseFirestore from '@google-cloud/firestore';
import {refreshUserAvailableCredits} from './lib/refreshUserAvailableCredits';
import {DeltaDocumentSnapshot} from "firebase-functions/lib/providers/firestore";

/**
 * Query total sum from transfers, deduct total sum from purchases, save as user.availableCredits
 * Triggers: new transfer document, new transfer document
 */
const handler = async (event: firebase.Event<DeltaDocumentSnapshot>) => {

    const transferDocumentReference : FirebaseFirestore.DocumentReference = event.data.ref;
    const transferDocumentDocumentSnapshot : FirebaseFirestore.DocumentSnapshot = await transferDocumentReference.get();
    const transferDocument = transferDocumentDocumentSnapshot.data();

    console.log('transferDocument', transferDocument);

    if (transferDocument.status !== 'registered') {
        return;
    }

    const transfersCollectionReference = transferDocumentReference.parent;
    const userRef = transfersCollectionReference.parent;

    console.log('transferDocumentReference: ', transferDocumentReference);
    console.log('transfersCollectionReference: ', transfersCollectionReference);
    console.log('userRef: ', userRef);

    const userDocumentSnapshot = await userRef.get();

    if (userDocumentSnapshot.exists) {
        console.log('userDocumentSnapshot: ', userDocumentSnapshot);
        await refreshUserAvailableCredits(userDocumentSnapshot);
    } else {
        console.log('userDocumentSnapshot does not exist');
    }

    return;

};
export const listener = functions.firestore.document('/users/{userId}/transfers/{transferId}').onWrite(handler);
