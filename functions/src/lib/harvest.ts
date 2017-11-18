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
    // TODO

    // Calculate amount of credits to issue (based on last time harvest was made - TODO: possibly via corda-check to be certain that our database is not rigged to issue too many credits)
    const creditsToIssue = 12312;

    // Record issue of credits in corda (using the Corda REST API)
    // TODO

    // Finish the harvest + Update the amount of issued credits

    userDocumentSnapshot

                            return userStateRef.set({
                                schemaRevision,
                                operationsStage,
                                operationsState
                            }, {merge: true}).then(() => {


    return true;

};
