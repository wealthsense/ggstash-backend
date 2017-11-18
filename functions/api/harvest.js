'use strict';

const harvest = require('./lib/harvest');

/**
 * Poll stash balances, issue credits based on last time harvest was made (possibly via corda-check to be certain) and record issue of
 * credits in corda (queries OP APIs for client balances + credit-issuing script which use the Corda REST API (or similar) to record
 * the issue of credits for the clients)
 * Trigger: new harvest document
 */
module.exports = function (functions, admin) {

    return functions.firestore.document('/users/{userId}/harvests/{harvestId}')
        .onCreate(event => {

            const harvestDocumentReference = event.data.ref;
            const harvestsCollectionReference = harvestDocumentReference.parent;
            const userRef = harvestsCollectionReference.parent;

            console.log('harvestDocumentReference: ', harvestDocumentReference);
            console.log('harvestsCollectionReference: ', harvestsCollectionReference);
            console.log('userRef: ', userRef);

            return userRef.get().then(userDocumentSnapshot => {
                if (userDocumentSnapshot.exists) {
                    console.log('userDocumentSnapshot: ', userDocumentSnapshot);
                    harvest(userDocumentSnapshot);
                }
            });

        });

};
