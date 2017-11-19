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

    // Get amount from stashing document
    const stashingDocumentSnapshot: FirebaseFirestore.DocumentSnapshot = await stashingDocumentReference.get();
    const stashingDocument: FirebaseFirestore.DocumentData = await stashingDocumentSnapshot.data();
    const amount = stashingDocument.amount;

    // Stash the amount to the stash account (queries OP APIs for amount transfer)
    try {
        const foo = await opBankApi.stash(userDocumentSnapshot, amount);

        // Sync stash balances (queries OP APIs for account balances)
        userDocumentSnapshot = await opBankApi.syncUserAccountInfo(userDocumentSnapshot, amount);

    } catch (error) {

        // Fake the stash result by modifying our latest synced data

        console.log('Mocking stash since stash throw an error: ', error);

        // Mock stash via account info balance modification
        userDocumentSnapshot = await opBankApi.mockStash(userDocumentSnapshot, amount);

    }

    // Finish the stashing + Update the amount of issued credits
    const stashTimestamp = new Date();
    const updateAttributes = {
        status: 'registered',
        amount,
        stashTimestamp,
    };
    await stashingDocumentReference.set(updateAttributes, {merge: true});
    const updatedStashingDocumentSnapshot = await stashingDocumentReference.get();

    console.log('updated stashingDocumentSnapshot after stashing: ', updatedStashingDocumentSnapshot.data());

    return;

};
