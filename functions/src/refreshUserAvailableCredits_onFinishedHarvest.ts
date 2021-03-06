'use strict';

import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as FirebaseFirestore from '@google-cloud/firestore';
import {refreshUserAvailableCredits} from './lib/refreshUserAvailableCredits';
import {DeltaDocumentSnapshot} from "firebase-functions/lib/providers/firestore";

/**
 * Query total sum from harvests, deduct total sum from purchases, save as user.availableCredits
 * Triggers: new harvest document, new harvest document
 */
const handler = async (event: firebase.Event<DeltaDocumentSnapshot>) => {

    const harvestDocumentReference : FirebaseFirestore.DocumentReference = event.data.ref;
    const harvestDocumentDocumentSnapshot : FirebaseFirestore.DocumentSnapshot = await harvestDocumentReference.get();
    const harvestDocument = harvestDocumentDocumentSnapshot.data();

    console.log('harvestDocument', harvestDocument);

    if (harvestDocument.status !== 'registered') {
        return;
    }

    const harvestsCollectionReference = harvestDocumentReference.parent;
    const userRef = harvestsCollectionReference.parent;

    console.log('harvestDocumentReference: ', harvestDocumentReference);
    console.log('harvestsCollectionReference: ', harvestsCollectionReference);
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
export const listener = functions.firestore.document('/users/{userId}/harvests/{harvestId}').onWrite(handler);
