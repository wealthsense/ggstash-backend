'use strict';

import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

/**
 * Execute a purchase of a product (NOT in hackathon: issuing a partial Settlement against the IOUs (or maybe easier just issue a Transaction
 * which decreases the available balance upon a later aggregate))
 * Trigger: new purchase document
 */
export const listener = function () {

    // TODO

};
