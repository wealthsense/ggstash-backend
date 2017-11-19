'use strict';

import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as FirebaseFirestore from '@google-cloud/firestore';
import {DeltaDocumentSnapshot} from "firebase-functions/lib/providers/firestore";
import * as cordaApi from './cordaApi';
import * as opBankApi from './opBankApi';

/**
 * Poll stash balances, issue credits based on last time harvest was made (possibly via corda-check to be certain) and record issue of
 * credits in corda (queries OP APIs for client balances + credit-issuing script which use the Corda REST API (or similar) to record
 * the issue of credits for the clients)
 * Trigger: new harvest document
 *
 * @param {DeltaDocumentSnapshot} userDocumentSnapshot
 * @param harvestDocumentReference
 * @returns {Promise<boolean>}
 */
export const harvest = async function (userDocumentSnapshot: DeltaDocumentSnapshot, harvestDocumentReference: FirebaseFirestore.DocumentReference) {

    // Poll stash balance (queries OP APIs for account balances)
    const stashAccountBalance = await opBankApi.stashAccountBalance();

    // Check days since last harvest
    // TODO: Actually check, for demo assume it was 1 day ago
    // TODO: possibly via corda-check to be certain that it was registered at that time
    const daysSinceLastHarvest = 1;

    // Calculate amount of credits to issue (based on last time harvest was made)
    // Assuming EUR and a conversion rate of 1 EUR per day / credit
    // Important to end up without a fraction, credits are discrete
    const creditsToIssue = Math.floor(stashAccountBalance * daysSinceLastHarvest);

    // Record issue of credits in corda (using the Corda REST API)
    const cordaResponse = await cordaApi.registerIssuedCredits(creditsToIssue);
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
