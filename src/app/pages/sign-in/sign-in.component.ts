import {Component, EventEmitter, HostBinding, OnInit} from '@angular/core';
import {GlobalsService} from '../../services/globals.service';
import {routeStateTrigger} from '../../animations/route-animations';
import {NgForm} from '@angular/forms';
import {cardSlideTrigger, enterMessageTrigger, signinStateTrigger} from '../../animations/animations';
import {AuthoService} from '../../services/autho.service';
import {LoggingService} from '../../services/logging.service';

// define page for debugging
const page = 'signin';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
  animations: [
    routeStateTrigger,
    signinStateTrigger,
    cardSlideTrigger,
    enterMessageTrigger
  ]
})

export class SignInComponent implements OnInit {
  // bind hoststate for animations.
  @HostBinding('@routeState') animations = true;

  // boolean for switching between login screen and sign up screen.
  public signinSwitch = true;
  public signinLoader = '';
  // send create account errors to page.
  public createAccountErrors = '';
  // send other messages to page.
  public createAccountMessage = '';
  // same as above but for sign in.
  public signinErrors = '';
  public signinMessage = '';

  // manage modal actions with emitter.
  modalActions = new EventEmitter<any>();

  // may not be needed - POSSIBLE UPGRADE
  params = [];

  // OPENERS AND CLOSERS FOR MODALS.
  openModal() {
    this.modalActions.emit({action: 'modal', params: ['open']});
  }

  closeModal() {
    this.modalActions.emit({action: 'modal', params: ['close']});
  }

  constructor(public globals: GlobalsService, public autho: AuthoService, public log: LoggingService) {
  }

  ngOnInit() {

    //route user away from page if user is logged in.
    if (this.autho.signedIn) {
      this.globals.navigate('/seller/me');
    }
  }

  // fires when user uses sign in form.
  onSignin(form: NgForm) {

    // sign in user through firebases login stuff.
    this.autho.signInUserWithEmailAndPassword(this.globals.cleanInput(form.value['email']), this.globals.cleanInput(form.value['password']))
      .then((success) => {

        // login correct, send to next step...
        this.signinMessage = 'Success! You are logged in!  You will be re-routed momentarily.';
        this.globals.navigate('/seller/me');

      })
      .catch((error) => {
        // display error messages to user.
        this.signinErrors = 'ERROR: ' + error.message;
        this.clearErrors();

      });
  }


  onCreateAccount(form: NgForm) {

    this.signinLoader = 'Saving Changes..';

    //check that user meets password reqs
    if (this.globals.cleanInput(form.value['password']).length < 5 || this.globals.cleanInput(form.value['password']).length > 25) {

      this.createAccountErrors = 'ERROR: Your password must be between 5 - 25 characters.';

      // check that users meets username requirements
    } else if (this.globals.cleanInput(form.value['username']).length < 5 || this.globals.cleanInput(form.value['username']).length > 25) {

      this.createAccountErrors = 'ERROR: Your username must be between 5 - 25 characters.';

      //check that user has matching passwords..
    } else if (form.value['password'] !== form.value['confirm-password']) {

      this.createAccountErrors = 'ERROR: Your passwords do not match.';
      form.value['password'] = '';

    } else {

      this.autho.createUserWithEmailAndPassword(this.globals.cleanInput(form.value['email']), this.globals.cleanInput(form.value['password']))
        .then((success) => {

          this.globals.toast('Success! You will recieve a verification email shortly.', 3000);
          setTimeout(()=>{this.globals.navigate('/seller/me');}, 3000);

        })
        .catch((error) => {

          this.autho.createUser = false;
          this.log.failure(page, error);
          this.createAccountErrors = 'ERROR: ' + error.message;

        });

    }

    this.clearErrors();
  }

  //change this to the global delay function.
  clearErrors() {
    setTimeout(
      ()=>{
        this.signinErrors = '';
        this.createAccountErrors = '';
        this.signinLoader = '';
      }
      , 3000);
  }

}
