import { Component } from '@angular/core';
import { SocialSharing } from '@ionic-native/social-sharing';
import { IonicPage } from 'ionic-angular';
import { SMS } from '@ionic-native/sms';
import swal             from 'sweetalert2';

import { Contacts } from '@ionic-native/contacts';

/**
 * Generated class for the SharePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-share',
  templateUrl: 'share.html',
})
export class SharePage {

    public contactsfound: any;
    public search: any;
    public contacttobefound: any;

    constructor(private contacts: Contacts, private socialSharing: SocialSharing, private sms: SMS) {
        this.contacts.find(['*'], {filter: '',multiple:true}).then((contacts) => {
            this.contactsfound = contacts;
        }).catch(() => {
            this.errorSendSMS('Is that an emulator? anyway, you cannot access to contacts here');
        });
    }

    getContact(val) {
        this.contacts.find(['*'], {filter: val,multiple:true}).then((contacts) => {
            this.contactsfound = contacts;
        });
    }

  shareVia() {
      this.socialSharing.share('It\'s dangerous to go alone, taaaake this!\n[www.fakelink.com]', 'Join us', ['recipient@example.org']);
  }

    errorSendSMS(message: string = 'It didn\'t work') {
        swal({
            title: 'Error',
            type: 'error',
            showCancelButton: false,
            html: message,
            confirmButtonText: 'Arf',
            allowOutsideClick: false,
        })
    }

    successSendSMS(message: string = 'It didn\'t work') {
        swal({
            title: 'SMS sent',
            type: 'success',
            showCancelButton: false,
            html: message,
            confirmButtonText: 'Great',
            allowOutsideClick: false,
        })
    }

  sendSMS(contact:any) {
        if (!this.sms.hasPermission()) {
            this.errorSendSMS("This application doesn't have permission to send sms")
            return;
        }
        if (contact.phoneNumbers !== undefined && contact.phoneNumbers[0] !== undefined) {
            const phone = contact.phoneNumbers[0];
            this.sms.send(phone.value, `It's dangerous to go alone, taaaake this!\n[www.fakelink.com]`).then(
                () => {
                    this.successSendSMS(`SMS sent to ${contact.name.givenName} ${contact.name.familyName}`);
                },
                (error) => {
                    this.errorSendSMS();
                }
            );
        }
  }
}
