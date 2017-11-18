'use strict';

import axios, {AxiosRequestConfig, AxiosPromise} from 'axios';

export const accounts = async () => {
    //try {

    const url = 'https://sandbox.apis.op-palvelut.fi/v1/accounts';
    const config: AxiosRequestConfig = {
        headers: {
            'x-api-key': 'gbFD1plpFYH52VZS3wLuD2gI7I8SAVWA',
            'x-authorization': 'b6910384440ce06f495976f96a162e2ab1bafbb4',
            'x-request-id': '111',
            'x-session-id': '234',
        },
    };

    const response = await axios.get(url, config);
    const data = response.data;
    console.log('OP Bank response: ', response);
    console.log('OP Bank response.data: ', response.data);

    return data;

    /*
    } catch (error) {
        console.log('Request error: ', error);
    }
    */

};
