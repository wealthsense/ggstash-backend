import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

import * as HealthCheck from './healthCheck'
import * as ConnectWithBank from './connectWithBank'
import * as RefreshUserAvailableCredits_onFinishedHarvest from './refreshUserAvailableCredits_onFinishedHarvest'
import * as RefreshUserAvailableCredits_onFinishedPurchase from './refreshUserAvailableCredits_onFinishedPurchase'
import * as Stashing from './stashing'
import * as InitiateMassHarvest from './initiateMassHarvest'
import * as Harvest from './harvest'
import * as Purchase from './purchase'

admin.initializeApp(functions.config().firebase);

export const healthCheck = HealthCheck.listener;
export const connectWithBank = ConnectWithBank.listener;
export const refreshUserAvailableCredits_onFinishedHarvest = RefreshUserAvailableCredits_onFinishedHarvest.listener;
export const refreshUserAvailableCredits_onFinishedPurchase = RefreshUserAvailableCredits_onFinishedPurchase.listener;
export const stashing = Stashing.listener;
export const initiateMassHarvest = InitiateMassHarvest.listener;
export const harvest = Harvest.listener;
export const purchase = Purchase.listener;
