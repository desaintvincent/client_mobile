import { Component } from '@angular/core';
import { AlertController, Platform} from 'ionic-angular';
import { AndroidFullScreen } from '@ionic-native/android-full-screen';
import { Push, PushObject, PushOptions} from "@ionic-native/push";
import * as firebase  from 'firebase';
import { HomePage } from '../pages/home/home';
import { AllLoginPage } from "../pages/all-login/all-login";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
    rootPage: any;

    constructor(platform: Platform, private androidFullScreen: AndroidFullScreen, public push: Push, public alertCtrl: AlertController) {
        // Initialize Firebase
        let config = {
            apiKey: "AIzaSyAz0Flatr2tM8CKcccotQTRhj6DlR3NzZQ",
            authDomain: "city-a4055.firebaseapp.com",
            databaseURL: "https://city-a4055.firebaseio.com",
            projectId: "city-a4055",
            storageBucket: "city-a4055.appspot.com",
            messagingSenderId: "672971208724"
        };

        firebase.initializeApp(config);

        const unsubscribe = firebase.auth().onAuthStateChanged( user => {
            if (!user) {
                this.rootPage = AllLoginPage;
                unsubscribe();
            } else {
                this.rootPage = HomePage;
                unsubscribe();
            }
        });

        firebase.auth().getRedirectResult().then((result) => {
            if (result.credential) {
                let token = result.credential.accessToken;
                let user = result.user;
                console.log(token, user);
            }
        }).catch(function(error) {
            // Handle Errors here.
            let errorMessage = error.message;
            console.log(errorMessage);
        });

        this.androidFullScreen.isImmersiveModeSupported()
            .then(() => this.androidFullScreen.immersiveMode())
            .then(() => platform.ready())
            .catch((error: any) => console.log(error));

        this.setupPush();
    }

    setupPush() {
        const options: PushOptions = {
            android: {
                vibrate: true,
                sound: true
            },
            ios: {
                alert: 'true',
                badge: true,
                sound: 'false'
            },
            windows: {}
        };

        const pushObject: PushObject = this.push.init(options);

        pushObject.on('notification').subscribe((notification: any) => {
            if (notification.additionalData.foreground) {
                let youralert = this.alertCtrl.create({
                    title: 'New Push notification',
                    message: notification.message
                });
                youralert.present();
            }
        });

        pushObject.on('registration').subscribe((registration: any) => {

        });

        pushObject.on('error').subscribe(error => alert('Error with Push plugin' + error));
    }
}

