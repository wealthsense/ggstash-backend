'use strict';

import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as FirebaseFirestore from '@google-cloud/firestore';

/**
 * Query total sum from harvests, deduct total sum from purchases, save as user.availableCredits
 * Triggers: new harvest document, new transfer document
 *
 * @param {DeltaDocumentSnapshot} userDocumentSnapshot
 * @returns {Promise<boolean>}
 */
export const refreshUserAvailableCredits = async function (userDocumentSnapshot: FirebaseFirestore.DocumentSnapshot) {

    // determine available credit
    const availableCredits = await calculateAvailableCredits(userDocumentSnapshot);

    // store available credit in user document
    const creditsLastUpdatedTimestamp = new Date();
    const updateAttributes = {
        credits: availableCredits,
        creditsLastUpdatedTimestamp,
    };
    await userDocumentSnapshot.ref.set(updateAttributes, {merge: true});

    console.log('userDocumentSnapshot: ', userDocumentSnapshot);
    console.log('updated userDocumentSnapshot: ', userDocumentSnapshot.data());

    return true;

};

const calculateAvailableCredits = async (userDocumentSnapshot: FirebaseFirestore.DocumentSnapshot) => {

    const userDocumentSnapshotReference: FirebaseFirestore.DocumentReference = userDocumentSnapshot.ref;

    const sumOfRegisteredCredits = async (query: FirebaseFirestore.Query) => {

        let credits = 0;
        console.log('query', query);
        const docsPromise: Promise<FirebaseFirestore.QuerySnapshot> = query.get();
        console.log('docsPromise', docsPromise);
        const docs: FirebaseFirestore.QuerySnapshot = await docsPromise;
        docs.forEach(doc => {
            console.log('doc in loop', doc);
            const docData = doc.data();
            credits += docData.credits;
        });
        return credits;

    };

    // query all registered harvests and sum
    const harvestsRef: FirebaseFirestore.CollectionReference = userDocumentSnapshotReference.collection('harvests');
    const harvestsQuery: FirebaseFirestore.Query = harvestsRef.where("status", "==", "registered");
    const harvestedCredits = await sumOfRegisteredCredits(harvestsQuery);
    console.log('harvestedCredits', harvestedCredits);

    // query all registered purchases and sum
    const purchasesRef = userDocumentSnapshotReference.collection('purchases');
    const purchasesQuery = purchasesRef.where("status", "==", "registered");
    const usedCredits = await sumOfRegisteredCredits(purchasesQuery);
    console.log('usedCredits', usedCredits);

    return harvestedCredits - usedCredits;

};
