'use strict';

import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as FirebaseFirestore from '@google-cloud/firestore';
import {refreshUserAvailableCredits} from './lib/refreshUserAvailableCredits';
import {DeltaDocumentSnapshot} from "firebase-functions/lib/providers/firestore";

/**
 * Query total sum from purchases, deduct total sum from purchases, save as user.availableCredits
 * Triggers: new purchase document, new purchase document
 */
const handler = async (event: firebase.Event<DeltaDocumentSnapshot>) => {

    const purchaseDocumentReference : FirebaseFirestore.DocumentReference = event.data.ref;
    const purchaseDocumentDocumentSnapshot : FirebaseFirestore.DocumentSnapshot = await purchaseDocumentReference.get();
    const purchaseDocument = purchaseDocumentDocumentSnapshot.data();

    console.log('purchaseDocument', purchaseDocument);

    if (purchaseDocument.status !== 'registered') {
        return;
    }

    const purchasesCollectionReference = purchaseDocumentReference.parent;
    const userRef = purchasesCollectionReference.parent;

    console.log('purchaseDocumentReference: ', purchaseDocumentReference);
    console.log('purchasesCollectionReference: ', purchasesCollectionReference);
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
export const listener = functions.firestore.document('/users/{userId}/purchases/{purchaseId}').onWrite(handler);
