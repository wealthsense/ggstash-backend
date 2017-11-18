'use strict';

/**
 * Poll stash balances, issue credits based on last time harvest was made (possibly via corda-check to be certain) and record issue of
 * credits in corda (queries OP APIs for client balances + credit-issuing script which use the Corda REST API (or similar) to record
 * the issue of credits for the clients)
 * Trigger: new harvest document
 *
 * @param userDocumentSnapshot
 * @returns Promise
 */
module.exports = function (userDocumentSnapshot) {

    // Poll stash balances (queries OP APIs for account balances)

    // Calculate amount of credits to issue

    // Issue credits (based on last time harvest was made - TODO: possibly via corda-check to be certain that our database is not rigged to issue too many credits)

    // Record issue of credits in corda (using the Corda REST API)

    return true;

};
