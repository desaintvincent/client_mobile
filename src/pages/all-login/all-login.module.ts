import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AllLoginPage } from './all-login';

@NgModule({
  declarations: [
    AllLoginPage,
  ],
  imports: [
    IonicPageModule.forChild(AllLoginPage),
  ],
})
export class AllLoginPageModule {}
