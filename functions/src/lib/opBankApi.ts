'use strict';

import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as FirebaseFirestore from '@google-cloud/firestore';
import axios, {AxiosRequestConfig, AxiosPromise} from 'axios';
import * as _ from 'lodash';

/**
 * @param {FirebaseFirestore.DocumentSnapshot} userDocumentSnapshot
 * @returns {Promise<FirebaseFirestore.DocumentSnapshot>}
 */
export const syncUserAccountInfo = async (userDocumentSnapshot: FirebaseFirestore.DocumentSnapshot) => {

    /**
     * Queries OP APIs for account balances
     * @returns {Promise<void>}
     */
    const fetchAccountsInfo = async (apiKey: string, authorizationHeader: string) => {
        //try {

        const url = 'https://sandbox.apis.op-palvelut.fi/v1/accounts';
        const config: AxiosRequestConfig = {
            headers: {
                'x-api-key': apiKey, // Consumer application’s api-key
                'x-authorization': authorizationHeader, // Token for end-user simulation
                'x-request-id': '111', // Request unique identifier (not validated at the moment)
                'x-session-key': '234', // Session identifier for in-memory data
            },
        };

        const response = await axios.get(url, config);
        console.log('OP Bank response.data: ', response.data);

        return response.data;

        /*
        } catch (error) {
            console.log('Request error: ', error);
        }
        */

    };

    const user: FirebaseFirestore.DocumentData = await userDocumentSnapshot.data();
    console.log('user: ', user);

    if (!user.accountConfig) {
        console.log('No user.accountConfig');
        throw Error('No user.accountConfig');
    }

    if (!user.accountConfig.stashAccountIban) {
        console.log('No user.accountConfig.stashAccountIban');
        throw Error('No user.accountConfig.stashAccountIban');
    }

    if (!user.accountConfig.checkingsAccountIban) {
        console.log('No user.accountConfig.checkingsAccountIban');
        throw Error('No user.accountConfig.checkingsAccountIban');
    }

    /*
    Currently authentication is simulated with static tokens. You can pass along x-authorization header with one of following tokens to get access to different end user data:
    TOKEN
    fdb6c7c24bbc3a2c4144c1848825ab7d3a4ccb43
    b6910384440ce06f495976f96a162e2ab1bafbb4
    7a66629ddf3691a66eb6466ab7a9f610de531047
    3af871a0e3ebfc46f375ff2b63d1414982bd4f76
     */

    const apiKey = 'gbFD1plpFYH52VZS3wLuD2gI7I8SAVWA';
    const authorizationHeader = 'b6910384440ce06f495976f96a162e2ab1bafbb4';

    const accounts = await fetchAccountsInfo(apiKey, authorizationHeader);

    const stashAccount = _.find(accounts, (account) => {
        return account.iban === user.accountConfig.stashAccountIban;
    });
    console.log('stashAccount', stashAccount);

    const checkingsAccount = _.find(accounts, (account) => {
        return account.iban === user.accountConfig.checkingsAccountIban;
    });
    console.log('checkingsAccount', checkingsAccount);

    const accountInfoSyncTimestamp = new Date();
    const updateAttributes = {
        accountInfo: {
            stashAccount,
            checkingsAccount,
            accountInfoSyncTimestamp,
        }
    };
    const userDocumentReference = userDocumentSnapshot.ref;
    await userDocumentReference.set(updateAttributes, {merge: true});
    const updatedUserDocumentSnapshot = await userDocumentReference.get();

    console.log('updated userDocumentSnapshot after user: ', updatedUserDocumentSnapshot.data());

    return updatedUserDocumentSnapshot;

};

/*
Sample response for account-listing:

[
  {
    "accountId": "064418ca1d292a5112e9804af4dc66df5b90203c",
    "accountType": "710001",
    "iban": "FI2350009421535899",
    "bic": "OKOYFIHH",
    "accountName": "KÄYTTÖTILI",
    "balance": 0,
    "amountAvailable": 0,
    "currency": "EUR"
  },
  {
    "accountId": "07618ad83d7c5d5f2db8908d33b6a9272c5e8d96",
    "accountType": "712035",
    "iban": "FI7858400761900714",
    "bic": "OKOYFIHH",
    "accountName": "KASVUTUOTTO",
    "balance": 3137.57,
    "amountAvailable": 3137.57,
    "currency": "EUR"
  },
  {
    "accountId": "4270acb4db4a8b82c954ff93e5c81f2f38fd5a2f",
    "accountType": "710001",
    "iban": "FI1958400720090508", <-- for use as stash account
    "bic": "OKOYFIHH",
    "accountName": "KÄYTTÖTILI",
    "balance": 2275.71,
    "amountAvailable": 2275.71,
    "currency": "EUR"
  },
  {
    "accountId": "5189f37b439bd02462e196e206d0318f094fca82",
    "accountType": "710001",
    "iban": "FI1158400720088809",
    "bic": "OKOYFIHH",
    "accountName": "KÄYTTÖTILI",
    "balance": 20990.82,
    "amountAvailable": 20990.82,
    "currency": "EUR"
  },
  {
    "accountId": "61695dfa6a52aac826ab6447b8ee25917e30d7a5",
    "accountType": "710001",
    "iban": "FI1958400720091381",
    "bic": "OKOYFIHH",
    "accountName": "KÄYTTÖTILI",
    "balance": 4276.61,
    "amountAvailable": 4276.61,
    "currency": "EUR"
  },
  {
    "accountId": "a329ea3cec30a5f2fcadc38b76247f2f02c0a1a1",
    "accountType": "710001",
    "iban": "FI3959986920207073", <-- for use as stash account
    "bic": "OKOYFIHH",
    "accountName": "KÄYTTÖTILI",
    "balance": 2215.81,
    "amountAvailable": 2215.81,
    "currency": "EUR"
  },
  {
    "accountId": "adee9e7d34d8ffb3a3ef96dda5be37a63673b23c",
    "accountType": "710001",
    "iban": "FI8958400720010290",
    "bic": "OKOYFIHH",
    "accountName": "KÄYTTÖTILI",
    "balance": 10287.84,
    "amountAvailable": 10287.84,
    "currency": "EUR"
  },
  {
    "accountId": "b3a4c6fb50be0b92e9f8f13b8b497db33cabbb05",
    "accountType": "710001",
    "iban": "FI2450009421535881",
    "bic": "OKOYFIHH",
    "accountName": "KÄYTTÖTILI",
    "balance": 0,
    "amountAvailable": 0,
    "currency": "EUR"
  },
  {
    "accountId": "b79974fbbc100e8e4f103381649858d363795d6e",
    "accountType": "711006",
    "iban": "FI8058400767000550",
    "bic": "OKOYFIHH",
    "accountName": "24 KK MÄÄRÄAIKAINEN TUOTTOTILI",
    "balance": 0,
    "amountAvailable": 0,
    "currency": "EUR"
  },
  {
    "accountId": "dfd17a16aafde6ecb2b910cdb03d5932416d4913",
    "accountType": "711006",
    "iban": "FI8859986967004714",
    "bic": "OKOYFIHH",
    "accountName": "24 KK MÄÄRÄAIKAINEN TUOTTOTILI",
    "balance": 12852.51,
    "amountAvailable": 12852.51,
    "currency": "EUR"
  }
]

*/

export const stash = async (userDocumentSnapshot: FirebaseFirestore.DocumentSnapshot, amount: float) => {

    /**
     * Queries OP APIs for account balances
     * @returns {Promise<void>}
     */
    const initiatePayment = async (apiKey: string, authorizationHeader: string) => {
        //try {

        const user: FirebaseFirestore.DocumentData = await userDocumentSnapshot.data();
        console.log('user: ', user);

        if (!user.accountConfig) {
            console.log('No user.accountConfig');
            throw Error('No user.accountConfig');
        }

        if (!user.accountConfig.stashAccountIban) {
            console.log('No user.accountConfig.stashAccountIban');
            throw Error('No user.accountConfig.stashAccountIban');
        }

        if (!user.accountConfig.checkingsAccountIban) {
            console.log('No user.accountConfig.checkingsAccountIban');
            throw Error('No user.accountConfig.checkingsAccountIban');
        }

        const url = 'https://sandbox.apis.op-palvelut.fi/v1/payments/initiate';
        const config: AxiosRequestConfig = {
            headers: {
                'x-api-key': apiKey,
                'x-authorization': authorizationHeader,
                'x-request-id': '111',
                'x-session-key': '234',
            },
            data: {
                "amount": amount,
                "subject": "GGSTASH",
                "currency": "EUR",
                "payerIban": user.accountConfig.checkingsAccountIban,
                "valueDate": "2017-11-16T15:05:41Z",
                "receiverBic": "OKOYFIHH",
                "receiverIban": user.accountConfig.stashAccountIban,
                "receiverName": "Me"
            },
        };

        console.log('OP Bank initiatePayment request url: ', url);
        console.log('OP Bank initiatePayment request config: ', config);

        const response = await axios.post(url, config);
        console.log('OP Bank response.data: ', response.data);

        /*

        response:

        * Connection #0 to host sandbox.apis.op-palvelut.fi left intact
        {"amount":100,"subject":"Saving money for gold","currency":"EUR","payerIban":"FI1958400720090508","valueDate":"2017-11-16T15:05:41Z","receiverBic":"OKOYFIHH","receiverIban":"FI7858400761900714","receiverName":"Me","paymentId":"1ef733d0-cbd1-11e7-895a-3b1aceeacc9c"}


        confirm:

        curl -v -X POST https://sandbox.apis.op-palvelut.fi/v1/payments/confirm   -H 'Content-Type: application/json'   -H 'Accept: application/json'  -H 'x-api-key: gbFD1plpFYH52VZS3wLuD2gI7I8SAVWA' --data '{"amount":100,"subject":"Saving money for gold","currency":"EUR","payerIban":"FI1958400720090508","valueDate":"2017-11-16T15:05:41Z","receiverBic":"OKOYFIHH","receiverIban":"FI7858400761900714","receiverName":"Me","paymentId":"71fae180-cbd1-11e7-895a-3b1aceeacc9c"}'


        response:

        {"amount":100,"subject":"Saving money for gold","currency":"EUR","payerIban":"FI1958400720090508","valueDate":"2017-11-16T15:05:41Z","receiverBic":"OKOYFIHH","receiverIban":"FI7858400761900714","receiverName":"Me","paymentId":"71fae180-cbd1-11e7-895a-3b1aceeacc9c"}

         */

        return response.data;

        /*
        } catch (error) {
            console.log('Request error: ', error);
        }
        */

    };

    const apiKey = 'gbFD1plpFYH52VZS3wLuD2gI7I8SAVWA';
    const authorizationHeader = 'b6910384440ce06f495976f96a162e2ab1bafbb4';

    const foo = await initiatePayment(apiKey, authorizationHeader);

    console.log('foo', foo);

    return foo;

};



