import { EventEmitter, Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { GlobalsService } from './globals.service';

declare const firebase: any;

@Injectable()
export class AuthoService {

  public user: any = null;
  public userPhoto = '';
  public userEmail = 'test@gmail.com';
  public userName = 'hello';
  public userId = 'hello';
  public userProvider = '';
  // track user's login state.
  public signedIn = false;
  public userSignInStatus = new EventEmitter<boolean>();
  // detect if user needs tour page
  public createUser = false;

  constructor( public database: DatabaseService, public globals: GlobalsService ) {
  }

  // check the current users login state and emit to components.
  checkStatus(): void {
    // actively listen for changes to user state.
    firebase.auth().onAuthStateChanged( ( user ) => {

      // user is logged in.
      if ( user ) {

        this.signedIn = true;
        if ( this.user == null ) {
          this.user = user;
        }
      } else {
        this.signedIn = false;
        // this.globals.authoStatus.emit('not logged in');
      }
      this.userSignInStatus.emit( this.signedIn );
    } );
  }

  // create new authentication user
  createUserWithEmailAndPassword( email: string, password: string ): any {
    return firebase.auth().createUserWithEmailAndPassword( email, password );
  }

  // create autho token for user.
  signInUserWithEmailAndPassword( email: string, password: string ): any {
    return firebase.auth().signInWithEmailAndPassword( email, password );
  }

  // reset password
  resetUserPassword( email: string ): any {
    return firebase.auth().sendPasswordResetEmail( email );
  }

  signInUserWithFacebook(): any {
    const provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope( 'public_profile' );

    firebase.auth().signInWithPopup( provider ).then( ( result ) => {
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      const token = result.credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      // ...
      console.log( 'FACEBOOK LOGIzN SUCCESS!' );
      this.globals.navigate( 'seller/me' );

    } ).catch( function ( error ) {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      const credential = error.credential;
      // ...
      console.log( 'ERROR: ' );
      console.log( error );
    } );
  }

  logout(): void {
    firebase.auth().signOut().then( () => {
      // Sign-out successful.
      this.user = null;
      this.database.userDataPublic = {
        displayName: '',
        email: '',
        photoURL: '',
        created: null,
        // detects if user needs setup on their page.
        newUser: 0,
        // detects if user has signed up for a trial plan yet.
        startedTrial: false,
        description: ''
      };


      this.database.userDataPrivate = {};
      this.database.sellerData = {
        displayName: '',
        email: '',
        photoURL: '',
        created: null,
        // detects if user needs setup on their page.
        newUser: 0,
        // detects if user has signed up for a trial plan yet.
        startedTrial: false,
        description: ''
      };

      this.globals.navigate( '/welcome' );
      //reload page because i cant figure out how to destroy the hidden sidenav and users can still "open" sidenav
      //POSSIBLE UPGRADE - get sidenav to work.
      location.reload();

    }, ( error ) => {

      // An error happened.
    } );
  }

  writeAutho( dataObj ): any {
    return this.user.updateProfile( dataObj );
  }

}
