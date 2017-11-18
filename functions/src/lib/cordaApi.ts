'use strict';

import axios from 'axios';

export const registerIssuedCredit = async () => {
    //try {

    const url = 'http://127.0.0.1:10007/api/obligation/issue-obligation?amount=100&currency=USD&party=PartyB';

    const response = await axios.get(url);
    const data = response.data;
    console.log('Corda response: ', response);
    console.log('Corda response.data: ', response.data);

    return 'TODO';

    /*
    } catch (error) {
        console.log('Request error: ', error);
    }
    */

};
