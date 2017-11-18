'use strict';

const refreshUserAvailableCredits = require('./lib/refreshUserAvailableCredits');

/**
 * Query total sum from transfers, deduct total sum from purchases, save as user.availableCredits
 * Triggers: new transfer document, new transfer document
 */
module.exports = function (functions, admin) {

    return functions.firestore.document('/users/{userId}/transfers/{transferId}')
        .onCreate(event => {

            // TODO: ONLY FINISHED TRANSFERS

            const transferDocumentReference = event.data.ref;
            const transfersCollectionReference = transferDocumentReference.parent;
            const userRef = transfersCollectionReference.parent;

            console.log('transferDocumentReference: ', transferDocumentReference);
            console.log('transfersCollectionReference: ', transfersCollectionReference);
            console.log('userRef: ', userRef);

            return userRef.get().then(userDocumentSnapshot => {
                if (userDocumentSnapshot.exists) {
                    console.log('userDocumentSnapshot: ', userDocumentSnapshot);
                    refreshUserAvailableCredits(userDocumentSnapshot);

                }
            });

        });

};
