import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { GlobalsService } from './services/globals.service';
import { AuthoService } from './services/autho.service';
import { DatabaseService } from './services/database.service';
import { LoggingService } from './services/logging.service';
import { BackendService } from './services/backend.service';
import { SellerModelService } from './models/seller-model.service';
import { tryCatch } from 'rxjs/util/tryCatch';
import { StripeModelService } from './models/stripe-model.service';

// declare vars
declare const firebase: any;
const page = 'mainApp';

@Component( {
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
} )
export class AppComponent {

  constructor( public globals: GlobalsService, public autho: AuthoService, public data: DatabaseService, public changeDetectorRef: ChangeDetectorRef,
               public log: LoggingService, public backend: BackendService, public sellerModel: SellerModelService, public stripeModel: StripeModelService ) {

    // subscribe to changes in user state.
    this.autho.checkStatus();

    // runs when user state changes, same as autho.checkstatus but used for page dependent changes due to status change.
    this.autho.userSignInStatus.subscribe( ( status ) => {
      // user logged in.
      if ( status ) {
        this.log.note( page, 'user is logged in' );
        console.log(this.autho);
        // set some default autho vars for use on pages.
        this.autho.userPhoto = this.autho.user.photoURL;
        this.autho.userEmail = this.autho.user.email;
        this.autho.userId = this.autho.user.uid;
        this.autho.userProvider = this.autho.user.providerData[ 0 ][ 'providerId' ];
        // check if user is in database. next subscription handles conditions
        if ( this.data.userDataPublic.email === '' ) {
          this.data.checkDatabaseForUser( this.autho.userId );
        }

      }
      else {
        this.log.note(page, 'user is not logged in');
      }

      // balance asynconous autho stuff on seller page.
      if ( this.globals.router.url.indexOf( 'seller/' ) ) {
        this.log.note(page, 'seller model async ran');
        this.sellerModel.asyncAuthoStatus();
      }

    } );

    this.data.userDatabaseStatus.subscribe( ( databaseStatus ) => {
      if ( databaseStatus ) {
        this.log.note( page, 'user exists in database' );
        //POSSIBLE UPGRADE, CHANGE TO BETTER NAME
        this.data.getUserData( this.autho.userId, true );
        this.data.getUserData( this.autho.userId, false );
      } else {
        this.log.note( page, 'user does not exist in database' );
        // create user. start by sending email to user to verify account.
        // send verification email unless the user signed up with facebook.
        if ( this.autho.userProvider !== 'facebook.com' ) {
          this.autho.user.sendEmailVerification()
            .then( () => {
              // notify that email is sent.
              this.log.note( page, 'email verification sent...' );

            } )
            .catch( ( error ) => {
              // update failed..
              this.log.failure( page, error );
            } );
        }

        // temp autho info obj for updating autho info in firebase.
        const tempAuthoObj = {};
        // set username if it already exists from facebook
        if ( this.autho.user.displayName != null ) {
          tempAuthoObj[ 'displayName' ] = this.autho.user.displayName;
        }

        // set photo to default unless facebook image exists.
        if ( this.autho.user.photoURL == null ) {
          tempAuthoObj[ 'photoURL' ] = 'assets/imgs/profile.jpg';
        } else {
          tempAuthoObj[ 'photoURL' ] = this.autho.user.photoURL;

          if ( this.autho.userProvider === 'facebook.com' ) {
            tempAuthoObj[ 'photoURL' ] = 'https://graph.facebook.com/' + this.autho.user.providerData[ 0 ][ 'uid' ] + '/picture?height=400';
          }
        }

        // write info to Autho in firebase, not the Database.
        this.autho.writeAutho( tempAuthoObj )
          .then( () => {
            // update any view changes
            this.log.note( page, 'updated Autho...' );
          } )
          .catch( ( error ) => {
            // update failed..
            this.log.failure( page, error );
          } );

        // this may need to be moved to the success case above ^^^^
        // set up info for realtime db.
        const userDataObj = {
          displayName: this.autho.user.displayName,
          email: this.autho.user.email,
          photoURL: tempAuthoObj[ 'photoURL' ],
          created: Date.now(),
          // detects if user needs setup on their page.
          newUser: 1,
          // detects if user has signed up for a trial plan yet.
          startedTrial: false,
          description: ''
        };

        // set user name if used facebook.
        if ( this.autho.userProvider === 'facebook.com' ) {
          userDataObj[ 'name' ] = 'check';
        }

        // update user database in firebase
        // loadingData keeps this code from being ran over itself if the async stuff takes too long and this method
        // triggers multiple times.
        if ( this.globals.runningAsynconousFunctions === false ) {

          // lock page from over run methods.
          this.globals.runningAsynconousFunctions = true;

          // write user to database
          this.data.writeUserData( this.autho.user.uid, userDataObj, true )
            .then( () => {
              this.log.note( page, 'user database updated' );

              // gen token for backend.
              this.backend.initToken()
                .then( ( idToken ) => {

                  const obj = {};

                  obj[ 'utoken' ] = idToken;
                  obj[ 'email' ] = this.autho.user.email;

                  // generate a new customer object with stripe through heroku.
                  this.backend.newCustomer( obj )
                    .then( ( stripeData ) => {
                      // write new customer id to the user secure data section of db and the customers section of db.
                      // not sure if different tree for customer ids neccessary.
                      const customerObj = {};

                      customerObj[ stripeData.customer ] = {
                        userId: this.autho.user.uid,
                        email: this.autho.user.email
                      };

                      let customerSuccess = false;
                      let privateSuccess = false;

                      // write to customer section.
                      this.data.writeCustomerId( customerObj )
                        .then( () => {
                          this.log.note( page, 'added customer id successfully to custmoers' );
                          customerSuccess = true;
                          if ( customerSuccess && privateSuccess ) {
                            this.globals.runningAsynconousFunctions = false;
                          }
                        } )
                        .catch( ( err ) => {
                          customerSuccess = true;
                          if ( customerSuccess && privateSuccess ) {
                            this.globals.runningAsynconousFunctions = false;
                          }
                        } );

                      // write to usersecuredata section of db.
                      const userDataPrivateObj = { cusId: stripeData.customer };
                      this.data.writeUserData( this.autho.userId, userDataPrivateObj, false )
                        .then( () => {
                          this.log.note( page, 'added user public data successfully' );
                          privateSuccess = true;
                          if ( customerSuccess && privateSuccess ) {
                            this.globals.runningAsynconousFunctions = false;
                          }
                        } )
                        .catch( ( err ) => {
                          this.log.failure( page, 'added user public data failed.' );
                          privateSuccess = true;
                          if ( customerSuccess && privateSuccess ) {
                            this.globals.runningAsynconousFunctions = false;
                          }
                        } );
                    } )
                    .catch( ( error ) => {
                      this.log.failure( page, error );
                      this.globals.runningAsynconousFunctions = false;
                    } );
                } )
                .catch( ( error ) => {
                  this.log.failure( page, error );
                  this.globals.runningAsynconousFunctions = false;
                } );
            } )
            // update failed.
            .catch( ( error ) => {
              this.log.failure( page, error );
              this.globals.runningAsynconousFunctions = false;
            } );
        }
      }
    } );

    this.globals.globalChangeDetectorRef.subscribe( ( anything ) => {
      this.changeDetectorRef.detectChanges();
    } );

    this.data.sellerDatabaseTrigger.subscribe( ( change ) => {
      this.sellerModel.balanceAsyncObj();
      this.log.note( page, 'seller database change detected' );

      if ( change.key === 'Description' ) {
        this.data.sellerData.description = this.data.parseToHTML( this.data.sellerData.description );
      }

      if ( change.key === 'Houses' ) {
        this.sellerModel.houses = change.val();
      }
      this.globals.globalChangeDetectorRef.emit( true );

    } );

    this.data.userDatabaseTrigger.subscribe( ( change ) => {
      this.log.note( page, 'autho database change detected' );

      if ( change.key === 'cusId' ) {
        this.backend.initToken().then( ( utoken ) => {
          this.backend.getCustomer( utoken, change.val() ).then( ( stripeObj ) => {

            console.log( stripeObj );
            this.stripeModel.processRawStripe( stripeObj );

          } ).catch( ( error ) => {
            this.log.failure( page, error );
          } );
        } ).catch( ( error ) => {
          this.log.failure( page, error );
        } );
      }
      this.globals.globalChangeDetectorRef.emit( true );
    } );
  }

}
