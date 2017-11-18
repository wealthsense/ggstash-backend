'use strict';

/**
 * Initiates harvest for all users
 * Trigger: daily / hourly (via cronjob invoking the REST API)
 */
module.exports = function (functions, admin) {

    /**
     * Adds a harvest document to a user document
     * @param userDocument
     */
    function addUserHarvest(userDocument) {

        const harvestInitialAttributes = {};
        return userDocument.collection('harvests').add(harvestInitialAttributes).then(harvestRef => {
            return harvestRef;
        });

    }

    return functions.https.onRequest((req, res) => {

        const promises = [];

        // query all users TODO: later, for now hard-code to one
        const userDocument = admin.firestore().collection('users').doc('ThREFBJE75IaZytedQme');
        promises.push(addUserHarvest(userDocument));

        return Promise.all(promises).then(() => {

            // Send back a message that we've successfully initiated the population of the demo data
            return res.json({
                result: `Successfully initiated a mass harvest`,
                usersCount: promises.length,
            });

        })

    });

};
