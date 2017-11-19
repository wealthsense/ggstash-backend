'use strict';

import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as FirebaseFirestore from '@google-cloud/firestore';

/**
 * Execute a purchase of a product (NOT in hackathon: issuing a partial Settlement against the IOUs (or maybe easier just issue a Transaction
 * which decreases the available balance upon a later aggregate))
 * Trigger: new purchase document
 *
 * @param {FirebaseFirestore.DocumentSnapshot} userDocumentSnapshot
 * @param {FirebaseFirestore.DocumentReference} purchaseDocumentReference
 * @returns {Promise<void>}
 */
export const purchase = async function (userDocumentSnapshot: FirebaseFirestore.DocumentSnapshot, purchaseDocumentReference: FirebaseFirestore.DocumentReference) {

    // Get amount from purchaseDocumentReference
    // TODO
    const productId = 1234;

    // Execute the purchase TODO
    // const foo = await partnerApi.purchaseGamingCredits(userDocumentSnapshot, productId);

    // Finish the purchase + Update the amount of issued credits
    const purchaseTimestamp = new Date();
    const updateAttributes = {
        status: 'registered',
        productId,
        purchaseTimestamp,
    };
    await purchaseDocumentReference.set(updateAttributes, {merge: true});
    const purchaseDocumentSnapshot = await purchaseDocumentReference.get();

    console.log('updated purchaseDocumentSnapshot after purchase: ', purchaseDocumentSnapshot.data());

    return;

};
