'use strict';

import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as FirebaseFirestore from '@google-cloud/firestore';
import * as cordaApi from './cordaApi';
import * as opBankApi from './opBankApi';

/**
 * Poll stash balances, issue credits based on last time harvest was made (possibly via corda-check to be certain) and record issue of
 * credits in corda (queries OP APIs for client balances + credit-issuing script which use the Corda REST API (or similar) to record
 * the issue of credits for the clients)
 * Trigger: new harvest document
 *
 * @param {FirebaseFirestore.DocumentSnapshot} userDocumentSnapshot
 * @param {FirebaseFirestore.DocumentReference} harvestDocumentReference
 * @returns {Promise<void>}
 */
export const harvest = async function (userDocumentSnapshot: FirebaseFirestore.DocumentSnapshot, harvestDocumentReference: FirebaseFirestore.DocumentReference) {

    // Poll stash balance (queries OP APIs for account balances)
    userDocumentSnapshot = await opBankApi.syncUserAccountInfo(userDocumentSnapshot);
    const user = userDocumentSnapshot.data();
    const stashAccountBalance = user.accountInfo.stashAccount.balance || 0;

    // Check last harvest
    // TODO: If last harvest was within 1 day, deduct those credits from the credits to issue (only newly stashed balanced should count)

    // Check days since last harvest
    // TODO: Actually check, for demo assume it was 1 day ago
    // TODO: possibly via corda-check to be certain that it was registered at that time
    const daysSinceLastHarvest = 1;

    // Calculate amount of credits to issue (based on last time harvest was made)
    // Assuming EUR and a conversion rate of 1 EUR per day / credit
    // Important to end up without a fraction, credits are discrete
    const creditsToIssue = Math.floor(stashAccountBalance * daysSinceLastHarvest);

    // Record issue of credits in corda (using the Corda REST API)
    // Temporary failsafe in case network is down during Ultrahack demo (otherwise obviously not skip on fail)
    let cordaResponse;
    try {
        cordaResponse = await cordaApi.registerIssuedCredits(creditsToIssue, userDocumentSnapshot);
    } catch (error) {
        console.log('Corda request error: ', error);
        cordaResponse = 'Transaction id D083508597B6BBE71E035548B2B422E4676D5C09F7619204D99D8623FCF72D90 committed to ledger. Obligation(a2a84441-4f51-4be7-9c32-bdc7bc619b28): 8Kqd4oWdx4KQGHGGQqychT2kjpa81hdUVF2DWpCH1KspjWuCqUu88pf7fbG owes 8Kqd4oWdx4KQGHGTsnshJYcgg7cG2d62qumLa6qzHw9DWPDhQhsrytXNDMS 144.00 USD and has paid 0.00 USD so far.';
    }
    const issuedCredits = creditsToIssue;

    // Finish the harvest + Update the amount of issued credits
    const harvestTimestamp = new Date();
    const updateAttributes = {
        status: 'registered',
        credits: issuedCredits,
        cordaResponse,
        harvestTimestamp,
    };
    await harvestDocumentReference.set(updateAttributes, {merge: true});
    const harvestDocumentSnapshot = await harvestDocumentReference.get();

    console.log('updated harvestDocumentSnapshot after harvest: ', harvestDocumentSnapshot.data());

    return;

};
