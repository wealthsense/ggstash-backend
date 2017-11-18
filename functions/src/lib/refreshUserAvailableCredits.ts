'use strict';

import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import {DeltaDocumentSnapshot} from "firebase-functions/lib/providers/firestore";

/**
 * Query total sum from harvests, deduct total sum from purchases, save as user.availableCredits
 * Triggers: new harvest document, new transfer document
 *
 * @param {DeltaDocumentSnapshot} userDocumentSnapshot
 * @returns {Promise<boolean>}
 */
export const refreshUserAvailableCredits = async function (userDocumentSnapshot: DeltaDocumentSnapshot) {

    // determine available credit
    const availableCredit = 9999;

    // store available credit in user document
    //userDocumentSnapshot.set();

    return true;

};
