'use strict';

import axios, {AxiosRequestConfig, AxiosPromise} from 'axios';

export const getLocation = async (url: string) => {
    try {
        const response = await axios.get(url);
        const data = response.data;
        console.log(
            `City: ${data.results[0].formatted_address} -`,
            `Latitude: ${data.results[0].geometry.location.lat} -`,
            `Longitude: ${data.results[0].geometry.location.lng}`
        );
    } catch (error) {
        console.log(error);
    }
};
