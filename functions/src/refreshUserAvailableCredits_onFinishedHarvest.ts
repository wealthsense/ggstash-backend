'use strict';

const refreshUserAvailableCredits = require('./lib/refreshUserAvailableCredits');

/**
 * Query total sum from harvests, deduct total sum from purchases, save as user.availableCredits
 * Triggers: new harvest document, new transfer document
 */
module.exports = function (functions, admin) {

    return functions.firestore.document('/users/{userId}/harvests/{harvestId}')
        .onWrite(event => {

            // TODO: ONLY FINISHED HARVESTS

            const harvestDocumentReference = event.data.ref;
            const harvestsCollectionReference = harvestDocumentReference.parent;
            const userRef = harvestsCollectionReference.parent;

            console.log('harvestDocumentReference: ', harvestDocumentReference);
            console.log('harvestsCollectionReference: ', harvestsCollectionReference);
            console.log('userRef: ', userRef);

            return userRef.get().then(userDocumentSnapshot => {
                if (userDocumentSnapshot.exists) {
                    console.log('userDocumentSnapshot: ', userDocumentSnapshot);
                    refreshUserAvailableCredits(userDocumentSnapshot);
                }
            });

        });

};
