# Firebase Cloud Functions

We use [Firebase Cloud Functions](https://firebase.google.com/docs/hosting/functions) for dynamic content and other routes that should not be served by the web app.

These are deployed to our main domain under subfolders as specified by the rewrite rules in `../firebase.json`. 

The Cloud runs node 6.11.1 and deployment and development does not work well when not using the same version locally, thus the nvm comments below.

## Deploy and test

To test locally do:

First time:
```
nvm use 6.11.1
rm -r node_modules
npm install -g npm # to make sure an up to date npm is used
npm install -g @google-cloud/functions-emulator
npm install
```

Then:
 1. Start serving your project locally using `nvm use 6.11.1 && firebase serve --only functions`
 1. Open the app in a browser at [http://localhost:5000/clerk-ai-174413/us-central1/{function-ref}]().

To deploy and test the app on prod do:

First time:
```
nvm use 6.11.1
rm -r node_modules
npm install -g npm # to make sure an up to date npm is used
npm install
```

Then:
 1. Deploy your project using `firebase deploy --only functions`
 1. Open the app using `firebase open hosting:site`, this will open a browser.

You may [deploy a single function at a time](https://firebase.google.com/docs/cli/#partial_deploys).
