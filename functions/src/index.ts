import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

import * as HealthCheck from './healthCheck'
import * as ConnectWithBank from './connectWithBank'
import * as RefreshUserAvailableCredits_onFinishedHarvest from './refreshUserAvailableCredits_onFinishedHarvest'
import * as RefreshUserAvailableCredits_onFinishedTransfer from './refreshUserAvailableCredits_onFinishedTransfer'
import * as Transfer from './transfer'
import * as InitiateMassHarvest from './initiateMassHarvest'
import * as Harvest from './harvest'
import * as Purchase from './purchase'

admin.initializeApp(functions.config().firebase);

export const healthCheck = HealthCheck.listener;
export const connectWithBank = ConnectWithBank.listener;
export const refreshUserAvailableCredits_onFinishedHarvest = RefreshUserAvailableCredits_onFinishedHarvest.listener;
export const refreshUserAvailableCredits_onFinishedTransfer = RefreshUserAvailableCredits_onFinishedTransfer.listener;
export const transfer = Transfer.listener;
export const initiateMassHarvest = InitiateMassHarvest.listener;
export const harvest = Harvest.listener;
export const purchase = Purchase.listener;
