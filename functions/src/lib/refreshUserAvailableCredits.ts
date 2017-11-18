'use strict';

/**
 * Query total sum from harvests, deduct total sum from purchases, save as user.availableCredits
 * Triggers: new harvest document, new transfer document
 *
 * @param userDocumentSnapshot
 * @returns Promise
 */
module.exports = function (userDocumentSnapshot) {

    // determine available credit
    const availableCredit = 9999;

    // store available credit in user document
    //userDocumentSnapshot.set();

    return true;

};
