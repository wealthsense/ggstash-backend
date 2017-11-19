'use strict';

import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as FirebaseFirestore from '@google-cloud/firestore';
import * as opBankApi from './opBankApi';

/**
 * Transfer the money from checkings account to the GGStash holding account in OP Bank + update account balances in firestore afterwards
 * Trigger: new transfer document
 *
 * @param {FirebaseFirestore.DocumentSnapshot} userDocumentSnapshot
 * @param {FirebaseFirestore.DocumentReference} stashingDocumentReference
 * @returns {Promise<void>}
 */
export const stash = async function (userDocumentSnapshot: FirebaseFirestore.DocumentSnapshot, stashingDocumentReference: FirebaseFirestore.DocumentReference) {

    // Get amount from stashingDocumentReference
    // TODO
    const amount = 1234;

    // Poll stash balance (queries OP APIs for account balances)
    const foo = await opBankApi.stash(userDocumentSnapshot, amount);

    // Finish the stashing + Update the amount of issued credits
    const stashTimestamp = new Date();
    const updateAttributes = {
        status: 'registered',
        amount,
        stashTimestamp,
    };
    await stashingDocumentReference.set(updateAttributes, {merge: true});
    const stashingDocumentSnapshot = await stashingDocumentReference.get();

    console.log('updated stashingDocumentSnapshot after stashing: ', stashingDocumentSnapshot.data());

    return;

};
