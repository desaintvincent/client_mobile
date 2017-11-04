import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { AndroidFullScreen } from '@ionic-native/android-full-screen';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { Push } from "@ionic-native/push";
import { AuthProvider } from '../providers/auth/auth';
import { LoginPage } from '../pages/login/login';
import { LoginPageModule } from "../pages/login/login.module";
import { SignupPage } from "../pages/signup/signup";
import { SignupPageModule } from "../pages/signup/signup.module";
import { ResetPasswordPage } from "../pages/reset-password/reset-password";
import { ResetPasswordPageModule } from "../pages/reset-password/reset-password.module";
import { AllLoginPage } from "../pages/all-login/all-login";
import { AllLoginPageModule } from "../pages/all-login/all-login.module";
import { GoogleLoginPage } from "../pages/google-login/google-login";
import {GoogleLoginPageModule} from "../pages/google-login/google-login.module";
import { SharePageModule } from '../pages/share/share.module';
import { SharePage } from "../pages/share/share";
import { SocialSharing } from '@ionic-native/social-sharing';
import { SMS } from '@ionic-native/sms';

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    LoginPageModule,
    SignupPageModule,
    ResetPasswordPageModule,
    AllLoginPageModule,
    GoogleLoginPageModule,
    SharePageModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    SignupPage,
    ResetPasswordPage,
    AllLoginPage,
    GoogleLoginPage,
    HomePage,
    SharePage
  ],
  providers: [
    AndroidFullScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Push,
    AuthProvider,
    SocialSharing,
    SMS
  ]
})
export class AppModule {}
