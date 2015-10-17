! This README is currently in writing and not finished yet !

# Run the app

## Create a 42 App

- Register a new 42 App at https://profile.intrav2.42.fr/oauth/applications
- Take a look at https://api.intrav2.42.fr/apidoc

## Add config file
To be able to run the project, you must add a config file in `www/js/config.js`
Example config file:

```
var config = {
    api42 : {
        baseUrl: 'https://api.intrav2.42.fr/v2',
        client_id: 'YOUR_API42_CLIENT_ID',
        client_secret: 'YOUR_API42_CLIENT_SECRET',
        callback: 'http://localhost/callback'
    },
    ionic : { /* Facultative */
        app_id: 'YOUR_IONIC_APP_ID',
        api_key: 'YOUR_IONIC_API_KEY'
    }
};
```

## Install Ionic

- Install Ionic using http://ionicframework.com/docs/guide/installation.html

## Install dependencies

`$ npm install && bower install`

## Run the app

Note: For now, you must run the app either on a simulator or on a device. It is not possible to run it using `ionic serve`

To run the app, run:
```
$ ionic build ios
$ ionic emulate ios
```
Substitute ios with android for Android testing

If you want to run on device, juste run `ionic build PLATFORM`, then open `platforms/PLATFORM` in xcode or your Android IDE.

# Contribute

## On Trello
A Trello board is available to follow upcoming features: https://trello.com/b/YtboVTXe
If you want to be a member of it to edit and add cards, contact me :-)

## On Github
Coming soon