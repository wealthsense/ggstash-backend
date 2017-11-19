'use strict';

import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as FirebaseFirestore from '@google-cloud/firestore';
import axios from 'axios';

export const registerIssuedCredits = async (issuedCredits) => {
    //try {

    const cordaTunnelDocument: FirebaseFirestore.DocumentReference = await admin.firestore().collection('settings').doc('cordaTunnel');
    const cordaTunnelDocumentSnapshot: FirebaseFirestore.DocumentSnapshot = await cordaTunnelDocument.get();
    const cordaTunnel: FirebaseFirestore.DocumentData = await cordaTunnelDocumentSnapshot.data();
    console.log('cordaTunnel: ', cordaTunnel);
    const url = 'http://' + cordaTunnel.host + '/api/obligation/issue-obligation?amount=' + issuedCredits + '&currency=USD&party=PartyB';
    console.log('Corda request url: ', url);

    const response = await axios.get(url);
    const data = response.data;
    console.log('Corda response.data: ', response.data);

    return response.data;

    /*
    } catch (error) {
        console.log('Request error: ', error);
    }
    */

};
