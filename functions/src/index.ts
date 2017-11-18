import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

import * as HealthCheck from './healthCheck'

admin.initializeApp(functions.config().firebase);

export const healthCheck = HealthCheck.listener;
