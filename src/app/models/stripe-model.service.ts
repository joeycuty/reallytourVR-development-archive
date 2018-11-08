import { ChangeDetectorRef, Injectable } from '@angular/core';
import { GlobalsService } from '../services/globals.service';
import { AuthoService } from '../services/autho.service';
import { BackendService } from '../services/backend.service';
import { DatabaseService } from '../services/database.service';
import { isNullOrUndefined, isUndefined } from 'util';
import { SellerModelService } from './seller-model.service';
import { LoggingService } from '../services/logging.service';

declare const Stripe: any;
const page = 'stripe-moddel';

@Injectable()
export class StripeModelService {
  get justUpdateCardButton(): string {
    return this._justUpdateCardButton;
  }

  set justUpdateCardButton( value: string ) {
    this._justUpdateCardButton = value;
    this.globals.globalChangeDetectorRef.emit( true );
  }
  get upcomingInvoices(): { amount_due: any; date: any; lines: { data: any } } {
    return this._upcomingInvoices;
  }

  set upcomingInvoices( value: { amount_due: any; date: any; lines: { data: any } } ) {
    console.log( 'upcoming Invoices' );
    this._upcomingInvoices = value;
  }

  get previousInvoices(): Array<any> {
    return this._previousInvoices;
  }

  set previousInvoices( value: Array<any> ) {
    this._previousInvoices = value;
    this.invoicesOverZero = 0;
    try {
      for ( let i = 0; i < this._previousInvoices[ i ].length; i++ ) {
        if ( this._previousInvoices[ 'data' ].amount_due > 0 ) {
          this._invoicesOverZero++;
        }
      }
    } catch ( e ) {
      console.log( 'error' + e );
    }
  }

  get invoicesOverZero(): number {
    return this._invoicesOverZero;
  }

  set invoicesOverZero( value: number ) {
    this._invoicesOverZero = value;
  }

  get confirmChargeMessage(): string {
    return this._confirmChargeMessage;
  }

  set confirmChargeMessage( value: string ) {
    this._confirmChargeMessage = value;
  }

  get selectedPlanProratePrice(): any {
    return this._selectedPlanProratePrice;
  }

  set selectedPlanProratePrice( value: any ) {
    this._selectedPlanProratePrice = value;
  }

  get card(): { last4: string; brand: string } {
    return this._card;
  }

  set card( value: { last4: string; brand: string } ) {
    this._card = value;
  }

  get confirmPayment(): string {
    return this._confirmPayment;
  }

  set confirmPayment( value: string ) {
    this._confirmPayment = value;
    this.globals.globalChangeDetectorRef.emit(true);
    this.globals.scrollTo(100, 100);
  }

  get cardProcessingMessage(): string {
    return this._cardProcessingMessage;
  }

  set cardProcessingMessage( value: string ) {
    this._cardProcessingMessage = value;
  }

  get subscriptionId(): any {
    return this._subscriptionId;
  }

  set subscriptionId( value: any ) {
    this._subscriptionId = value;
  }

  // default data on stripe model.
  public _customerId = null;
  public _subscriptionId = null;
  public _account_balance = null;
  public _dateCreated = null;
  public _entireStripeObj = {};
  public _subscriptionObj = {};
  public _planObj = {};
  public _planName = '';
  public _trialStart = 0;
  public _trialEnd = 0;
  public _card = {
    last4: '',
    brand: ''
  };

  // used for changing plans.
  public _selectedPlan = null;
  public _selectedPlanProratePrice = null;

  // set these to trigger layout changes in card forms.
  public _confirmPayment = 'selectPlan';
  public _updatingCardInfo = 'Process Card';
  public _justUpdateCardButton = 'Change Card';
  public _cardProcessingMessage = '';
  public _confirmChargeMessage = '';

  // use these methods to process card form.
  public _newCardNum = null;
  public _newCardExpires = null;
  public _newCardExpiresMonth = null;
  public _newCardExpiresYear = null;
  public _newCardName = null;
  public _newCardSecureNum = null;
  public stripeSubscriptionObj = {
    email: null,
    uToken: null,
    cusId: null,
    subId: null,
    plan: null,
    token: null,
    trialTime: 0
  };
  public _upcomingInvoices = {
    amount_due: null,
    date: null,
    lines: { data: null }
  };
  public subscriptions = {
    basic: 29.99,
    free: 0.00,
    premium: 44.99,
    executive: 59.99
  };

  public _previousInvoices = [];
  public _invoicesOverZero = 0;

  constructor( public globals: GlobalsService, public autho: AuthoService, public backend: BackendService,
               public database: DatabaseService, public sellerModel: SellerModelService, public log: LoggingService ) {
  }

  resetPaymentDetails() {
    this.confirmPayment = 'selectPlan';
    this.updatingCardInfo = 'Process Card';
    this.cardProcessingMessage = '';
    this.confirmChargeMessage = '';
    this.selectedPlan = this.planName;
    this.selectedPlanProratePrice = null;
  }

  processRawStripe( obj ) {
    this.customerId = obj.id;
    this.dateCreated = obj.created;
    this.account_balance = obj.account_balance;
    this.subscriptionObj = obj.subscriptions.data[ 0 ];
    this.subscriptionId = obj.subscriptions.data[ 0 ].id;
    this.planObj = obj.subscriptions.data[ 0 ].plan;
    this.planName = obj.subscriptions.data[ 0 ].plan.id;
    this.trialStart = obj.subscriptions.data[ 0 ].trial_start;
    this.trialEnd = obj.subscriptions.data[ 0 ].trial_end;

    if ( obj.sources.total_count > 0 ) {
      this._card = {
        last4: obj.sources.data[ 0 ].last4,
        brand: obj.sources.data[ 0 ].brand
      };
    }

    this.stripeSubscriptionObj = {
      email: this.autho.user.email,
      uToken: null,
      cusId: this.customerId,
      subId: this.subscriptionId,
      plan: this.planName,
      token: null,
      trialTime: this.trialEnd
    };

    this.getUpcomingInvoices();
    this.getPreviousInvoices();

  }

  setSetupLocationForSelectedPlan() {
    if ( this.planName === this.selectedPlan ) {
      this.sellerModel.setupNext();
    } else if ( this.selectedPlan !== 'free' ) {
      // process creditcard page.
      if ( this.card.last4 === '' ) {
        this.confirmPayment = 'updateCard';
      } else {
        this.confirmPayment = 'confirmCard';
      }
    } else if ( this.selectedPlan === 'free' ) {
      this.confirmPayment = 'noCardNeeded';
      this.updatingCardInfo = 'use free plan';
    }

  }

  checkProrate() {
    console.log( 'GET PRORATE' );

    this.backend.initToken()
      .then( ( idToken ) => {

        this.stripeSubscriptionObj.uToken = idToken;
        this.stripeSubscriptionObj.plan = this.selectedPlan;
        this.backend.getProratedPrice( this.stripeSubscriptionObj )
          .then( ( data ) => {

            if ( data.error === isNullOrUndefined ) {
              try {
                this.cardProcessingMessage = 'ERROR: ' + data[ 'error' ][ 'message' ];
              } catch ( e ) {
                console.log( 'no message' );
              }

            } else {
              this.selectedPlanProratePrice = data.cost / 100;

              if ( this.planName === 'free' ) {

                const finalPrice = this.subscriptions[ this.selectedPlan ];
                let trialMessage = '';
                if ( this.database.userDataPublic.startedTrial === false ) {
                  trialMessage = 'Selecting this plan starts a 14-day free trial. Your credit card will not be' +
                    ' billed $' + finalPrice + ' until ' + this.globals.dateSecondsToReadable( Math.floor( (Date.now() / 1000) + (86400 * 14) ) );

                } else if ( this.trialEnd > (Date.now() / 1000) ) {
                  trialMessage = 'You still have some time on your free 14-day trial! Your credit card will not be' +
                    ' billed $' + finalPrice + ' until ' + this.globals.dateSecondsToReadable( this.trialEnd );
                } else {
                  trialMessage = 'Your credit card will be' +
                    ' billed $' + finalPrice;
                }

                this.confirmChargeMessage = `You have selected to change your account from <b>${this.planName}</b> to 
              <b>${this.selectedPlan}</b>.  ${trialMessage}.`;

              } else if ( this.selectedPlan === 'free' ) {
                this.confirmChargeMessage = `You have selected to change your account from <b>${this.planName}</b> to 
              <b>${this.selectedPlan}</b>.  You currently have a payment of <b>$${this._upcomingInvoices.amount_due / 100}</b>
               due on the <b>${ this.globals.dateSecondsToReadable( this._upcomingInvoices.date ) }</b>. Changing your plan will
                 <b>${this._upcomingInvoices.amount_due > data.invoice.amount_due ? 'decrease' : 'increase'}</b> your next
                  payment to <b>$${data.cost / 100}</b>.`;
              } else {
                this.confirmChargeMessage = `You have selected to change your account from <b>${this.planName}</b> to 
              <b>${this.selectedPlan}</b>.  You currently have a payment of <b>$${this._upcomingInvoices.amount_due / 100}</b>
               due on the <b>${ this.globals.dateSecondsToReadable( this._upcomingInvoices.date ) }</b>. Changing your plan will
                 <b>${this._upcomingInvoices.amount_due > data.invoice.amount_due ? 'decrease' : 'increase'}</b> your next
                  payment to <b>$${data.cost / 100}</b> due on the 
                  <b>${ this.globals.dateSecondsToReadable( data.invoice.date ) }</b>.`;
              }

              console.log( this.selectedPlanProratePrice );
              console.log( data );
            }

          } )
          .catch( ( error ) => {
            console.log( error );
          } );
      } )
      .catch( ( error ) => {
        console.log( error );
      } );
  }

  getUpcomingInvoices() {

    this.backend.initToken()
      .then( ( idToken ) => {

        this.stripeSubscriptionObj.uToken = idToken;

        this.stripeSubscriptionObj.plan = this.planName;
        this.backend.getUpcomingInvoices( this.stripeSubscriptionObj )
          .then( ( data ) => {

            if ( data.error === isNullOrUndefined ) {
              try {
                this.cardProcessingMessage = 'ERROR: ' + data[ 'error' ][ 'message' ];
              } catch ( e ) {
                console.log( 'no message' );
              }

            } else {
              console.log( data );
              this.upcomingInvoices = {
                amount_due: data.amount_due,
                date: data.date,
                lines: data.lines
              };
            }

          } )
          .catch( ( error ) => {
            console.log( error );
          } );
      } )
      .catch( ( error ) => {
        console.log( error );
      } );
  }

  getPreviousInvoices() {

    this.backend.initToken()
      .then( ( idToken ) => {

        this.stripeSubscriptionObj.uToken = idToken;

        this.stripeSubscriptionObj.plan = this.planName;
        this.backend.getPreviousInvoices( this.stripeSubscriptionObj )
          .then( ( data ) => {

            if ( data.error === isNullOrUndefined ) {
              try {
                this.cardProcessingMessage = 'ERROR: ' + data[ 'error' ][ 'message' ];
              } catch ( e ) {
                console.log( 'no message' );
              }

            } else {
              this.previousInvoices = data.data;
            }

          } )
          .catch( ( error ) => {
            console.log( error );
          } );
      } )
      .catch( ( error ) => {
        console.log( error );
      } );
  }

  processChange() {
    if ( this.updatingCardInfo === 'Card Successful' || this.updatingCardInfo === 'continue' ) {
      if ( this.sellerModel.sellerState === 'setup' ) {
        this.sellerModel.setupNext();
      }
      this.resetPaymentDetails();
    } else {
      if ( this.confirmPayment === 'updateCard' ) {
        this.processCreditCard();
      } else if ( this.confirmPayment === 'confirmCard' || this.confirmPayment === 'noCardNeeded' ) {
        this.changeSubscriptionPlan();
      }
    }
  }


  changeSubscriptionPlan() {

    this.backend.initToken()
      .then( ( idToken ) => {

        this.updatingCardInfo = 'Updating Subscription..';

        this.stripeSubscriptionObj.uToken = idToken;

        this.stripeSubscriptionObj.plan = this.selectedPlan;
        this.backend.setNewSubscriptionWithOldCard( this.stripeSubscriptionObj )
          .then( ( data ) => {

            if ( typeof data.error !== 'undefined' ) {
              try {
                if ( typeof data.error.message !== 'undefined' ) {
                  this.cardProcessingMessage = 'ERROR: ' + data.error.message;
                } else {
                  this.cardProcessingMessage = 'ERROR: your card was verified but we encountered an error.';
                }
              } catch ( e ) {
                this.cardProcessingMessage = 'ERROR: your card was verified but we encountered an error.';
                console.log( 'no message' );
              }

              this.updatingCardInfo = 'Try Card Again';

            } else {
              if ( this.selectedPlan === 'free' ) {
                this.updatingCardInfo = 'continue';
              } else {
                this.updatingCardInfo = 'Card Successful';
              }
              this.cardProcessingMessage = 'Processing Successful!';
              this.globals.toast( 'Card Proccessed Successfully!', 3000 );

              this.database.getUserData( this.autho.userId, false );
            }

          } )
          .catch( ( error ) => {
            this.cardProcessingMessage = 'ERROR: your card was verified but there was an error sending your ' +
              'information to our server.  Please try again.  This will not charge your card twice.  If this' +
              ' continues, please contact us.';

            console.log( error );

            this.updatingCardInfo = 'Try Again';
          } );
      } )
      .catch( ( error ) => {
        this.cardProcessingMessage = 'ERROR: your card was verified but there was an error sending your ' +
          'information to our server.  Please try again.  This will not charge your card twice.  If this' +
          ' continues, please contact us.';

        console.log( error );

        this.updatingCardInfo = 'Try Again';
      } );
  }

  processCreditCard() {

    this.updatingCardInfo = 'Verifying Card Details';

    Stripe.setPublishableKey( 'pk_test_29JATgBi1GFnuxd0xOekrIdN' );
    Stripe.card.createToken( {
      number: this.newCardNum,
      exp_month: this.newCardExpiresMonth,
      exp_year: this.newCardExpiresYear,
      cvc: this.newCardSecureNum
    }, ( status: number, response: any ) => {

      if ( status === 200 ) {
        this.backend.initToken()
          .then( ( idToken ) => {

            this.updatingCardInfo = 'Processing Card';

            this.stripeSubscriptionObj.uToken = idToken;
            this.stripeSubscriptionObj.plan = this.selectedPlan;

            this.stripeSubscriptionObj.token = response;

            let startedTrial = false;
            if ( this.database.userDataPublic.startedTrial === false ) {
              this.stripeSubscriptionObj.trialTime = Math.floor( (Date.now() / 1000) + (86400 * 14) );
              startedTrial = true;
            }
            this.backend.setNewSubscriptionWithCard( this.stripeSubscriptionObj )
              .then( ( data ) => {
                console.log( 'UPDATE SUCCESSFUL!!!' );
                console.log( data );

                if ( typeof data.error !== 'undefined' ) {
                  try {
                    if ( typeof data.error.message !== 'undefined' ) {
                      this.cardProcessingMessage = 'ERROR: ' + data.error.message;
                    } else {
                      this.cardProcessingMessage = 'ERROR: your card was verified but we encountered an error.';
                    }
                  } catch ( e ) {
                    this.cardProcessingMessage = 'ERROR: your card was verified but we encountered an error.';
                    console.log( 'no message' );
                  }

                  this.updatingCardInfo = 'Try Card Again';

                } else {

                  if ( startedTrial ) {
                    this.database.writeUserData( this.autho.userId, { startedTrial: true }, true );
                    this.log.note( page, 'trial started successfully' );
                    console.log( data );
                  }

                  this.updatingCardInfo = 'Card Successful';
                  this.cardProcessingMessage = 'Processing Successful!';
                  this.globals.toast( 'Card Proccessed Successfully!', 3000 );

                  this.database.getUserData( this.autho.userId, false );
                }
              } )
              .catch( ( error ) => {

                this.cardProcessingMessage = 'ERROR: your card was verified but there was an error sending your ' +
                  'information to our server.  Please try again.  This will not charge your card twice.  If this' +
                  ' continues, please contact us.';

                console.log( error );

                this.updatingCardInfo = 'Try Card Again';
              } );
          } )
          .catch( ( error ) => {
            console.log( 'ERROR' );
            console.log( error );

            this.cardProcessingMessage = 'ERROR: your card was verified but you are not, please logout and try again.' +
              '  If this continues, please contact us.';
            this.updatingCardInfo = 'Try Card Again';
          } );
      } else {
        console.log( response.error.message );
        this.cardProcessingMessage = 'ERROR: ' + response.error.message;
        this.updatingCardInfo = 'Try Card Again';
      }
    } );
  }

  updateCreditCard() {

    this.justUpdateCardButton = 'Verifying Card Details';

    Stripe.setPublishableKey( 'pk_test_29JATgBi1GFnuxd0xOekrIdN' );
    Stripe.card.createToken( {
      number: this.newCardNum,
      exp_month: this.newCardExpiresMonth,
      exp_year: this.newCardExpiresYear,
      cvc: this.newCardSecureNum
    }, ( status: number, response: any ) => {

      if ( status === 200 ) {
        this.backend.initToken()
          .then( ( idToken ) => {

            this.justUpdateCardButton = 'Processing Card';

            this.stripeSubscriptionObj.uToken = idToken;
            this.stripeSubscriptionObj.token = response;

            this.backend.updateCardInfo( this.stripeSubscriptionObj )
              .then( ( data ) => {
                console.log( 'UPDATE SUCCESSFUL!!!' );
                console.log( data );

                if ( typeof data.error !== 'undefined' ) {
                  try {
                    if ( typeof data.error.message !== 'undefined' ) {
                      this.cardProcessingMessage = 'ERROR: ' + data.error.message;
                    } else {
                      this.cardProcessingMessage = 'ERROR: your card was verified but we encountered an error.';
                    }
                  } catch ( e ) {
                    this.cardProcessingMessage = 'ERROR: your card was verified but we encountered an error.';
                    console.log( 'no message' );
                  }

                  this.justUpdateCardButton = 'Try Card Again';

                } else {


                  this.justUpdateCardButton = 'Card Successful';
                  this.cardProcessingMessage = 'Processing Successful!';
                  this.globals.toast( 'Card Proccessed Successfully!', 3000 );

                  this.database.getUserData( this.autho.userId, false );
                }
              } )
              .catch( ( error ) => {

                this.cardProcessingMessage = 'ERROR: your card was verified but there was an error sending your ' +
                  'information to our server.  Please try again.  This will not charge your card twice.  If this' +
                  ' continues, please contact us.';

                console.log( error );

                this.justUpdateCardButton = 'Try Card Again';
              } );
          } )
          .catch( ( error ) => {
            console.log( 'ERROR' );
            console.log( error );

            this.cardProcessingMessage = 'ERROR: your card was verified but you are not, please logout and try again.' +
              '  If this continues, please contact us.';
            this.justUpdateCardButton = 'Try Card Again';
          } );
      } else {
        console.log( response.error.message );
        this.cardProcessingMessage = 'ERROR: ' + response.error.message;
        this.justUpdateCardButton = 'Try Card Again';
      }
    } );
  }

  get newCardExpires(): any {
    return this._newCardExpires;
  }

  set newCardExpires( value: any ) {
    this._newCardExpires = this.globals.cleanInputWithSpaces( value );
    this.newCardExpiresMonth = this._newCardExpires.substring( 0, 2 );
    this.newCardExpiresYear = this._newCardExpires.substring( 5, 9 );
  }

  get newCardNum(): any {
    return this._newCardNum;
  }

  set newCardNum( value: any ) {
    this._newCardNum = this.globals.cleanInputWithSpaces( value );
  }

  get newCardExpiresMonth(): any {
    return this._newCardExpiresMonth;
  }

  set newCardExpiresMonth( value: any ) {
    this._newCardExpiresMonth = value;
  }

  get newCardExpiresYear(): any {
    return this._newCardExpiresYear;
  }

  set newCardExpiresYear( value: any ) {
    this._newCardExpiresYear = value;
  }

  get newCardName(): any {
    return this._newCardName;
  }

  set newCardName( value: any ) {
    this._newCardName = this.globals.cleanInputWithSpaces( value );
  }

  get newCardSecureNum(): any {
    return this._newCardSecureNum;
  }

  set newCardSecureNum( value: any ) {
    this._newCardSecureNum = this.globals.cleanInputWithSpaces( value );
  }

  get updatingCardInfo(): string {
    return this._updatingCardInfo;
  }

  set updatingCardInfo( value: string ) {
    this._updatingCardInfo = value;
    this.globals.globalChangeDetectorRef.emit( true );
  }

  get selectedPlan(): any {
    return this._selectedPlan;
  }

  set selectedPlan( value: any ) {
    this._selectedPlan = value;

    if ( this.selectedPlan === this.planName ) {
      this.cardProcessingMessage = '';
      this.confirmChargeMessage = '';
    }

    if ( this.selectedPlan !== this.planName && this.sellerModel.sellerState !== 'setup' ) {
      this.checkProrate();
    } else if ( this.selectedPlan !== this.planName ) {
      if ( this.planName === 'free' ) {

        const finalPrice = this.subscriptions[ this.selectedPlan ];
        let trialMessage = '';
        if ( this.database.userDataPublic.startedTrial === false ) {
          trialMessage = 'Selecting this plan starts a 14-day free trial. Your credit card will not be' +
            ' billed $' + finalPrice + ' until ' + this.globals.dateSecondsToReadable( Math.floor( (Date.now() / 1000) + (86400 * 14) ) );

        } else if ( this.trialEnd > (Date.now() / 1000) ) {
          trialMessage = 'You still have some time on your free 14-day trial! Your credit card will not be' +
            ' billed $' + finalPrice + ' until ' + this.globals.dateSecondsToReadable( this.trialEnd );
        } else {
          trialMessage = 'Your credit card will be' +
            ' billed $' + finalPrice;
        }

        this.confirmChargeMessage = `You have selected to change your account from <b>${this.planName}</b> to 
              <b>${this.selectedPlan}</b>.  ${trialMessage}.`;

      }
    }
    this.globals.globalChangeDetectorRef.emit(true);
  }

  get trialStart(): any {
    return this._trialStart;
  }

  set trialStart( value: any ) {
    this._trialStart = value;
  }

  get trialEnd(): any {
    return this._trialEnd;
  }

  set trialEnd( value: any ) {
    this._trialEnd = value;
  }

  get customerId(): any {
    return this._customerId;
  }

  set customerId( value: any ) {
    this._customerId = value;
  }

  get account_balance(): any {
    return this._account_balance;
  }

  set account_balance( value: any ) {
    this._account_balance = value;
  }

  get dateCreated(): any {
    return this._dateCreated;
  }

  set dateCreated( value: any ) {
    this._dateCreated = value;
  }

  get entireStripeObj(): {} {
    return this._entireStripeObj;
  }

  set entireStripeObj( value: {} ) {
    this._entireStripeObj = value;
  }

  get subscriptionObj(): {} {
    return this._subscriptionObj;
  }

  set subscriptionObj( value: {} ) {
    this._subscriptionObj = value;
  }

  get planObj(): {} {
    return this._planObj;
  }

  set planObj( value: {} ) {
    this._planObj = value;
  }

  get planName(): string {
    return this._planName;
  }

  set planName( value: string ) {
    this._planName = value;
    this.selectedPlan = value;
  }

}
