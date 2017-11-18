'use strict';

import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as FirebaseFirestore from '@google-cloud/firestore';
import {DeltaDocumentSnapshot} from "firebase-functions/lib/providers/firestore";
import {getLocation} from './corda';

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

    // Poll stash balances (queries OP APIs for account balances)
    // TODO
    // curl -X GET   https://sandbox.apis.op-palvelut.fi/v1/accounts   -H 'x-api-key: foo'   -H 'x-authorization: bar'   -H 'x-request-id: 111'   -H 'x-session-id: 234'

    const url = "https://maps.googleapis.com/maps/api/geocode/json?address=Florence";
    await getLocation(url);

    // Calculate amount of credits to issue (based on last time harvest was made - TODO: possibly via corda-check to be certain that our database is not rigged to issue too many credits)
    const creditsToIssue = 12312;

    // Record issue of credits in corda (using the Corda REST API)
    // TODO
    const cordaTransactionId = 'TODO';
    // curl 'http://localhost:10007/api/obligation/issue-obligation?amount=100&currency=USD&party=PartyB' -H 'Accept-Encoding: gzip, deflate, br' -H 'Accept-Language: en-US,en;q=0.9,fi;q=0.8,sv;q=0.7,de;q=0.6' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36' -H 'Accept: application/json, text/plain, */*' -H 'Referer: http://localhost:10007/web/obligation/' -H 'Cookie: _hjIncludedInSample=1; _ga=GA1.1.469215722.1510896739; _gid=GA1.1.1418657322.1510896739; mp_82924121522e1607392f3c3814f42c26_mixpanel=%7B%22distinct_id%22%3A%20%22facebook%7C10154190491520639%22%2C%22%24initial_referrer%22%3A%20%22http%3A%2F%2Flocalhost%3A9000%2F%22%2C%22%24initial_referring_domain%22%3A%20%22localhost%3A9000%22%7D; mp_mixpanel__c=0; intercom-session-ps7vz37y=NWhRc0NZV2VaOUVSay84SU5YZWQzUVc1SHdPeW9MV2trd3hCbXNBclFmVVlid0JMejFyWGFYNUJENy9BRUtqYy0tN1JlKy8zYkZqU2RIY2s4WnhWenZxUT09--303c5aeb456f4416789ce84a09d3dae2d0ed311a' -H 'Connection: keep-alive' --compressed

    // Finish the harvest + Update the amount of issued credits

    const harvestTimestamp = new Date();
    const updateAttributes = {
        credits: creditsToIssue,
        cordaTransactionId,
        harvestTimestamp,
    };
    const harvestDocumentWriteResult = await harvestDocumentReference.set(updateAttributes, {merge: true});
    const harvestDocumentSnapshot = await harvestDocumentReference.get();

    console.log('harvestDocumentSnapshot: ', harvestDocumentSnapshot);
    console.log('updated harvestDocumentSnapshot: ', harvestDocumentSnapshot.data());

    return;

};
