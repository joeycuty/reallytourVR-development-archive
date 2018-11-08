import { EventEmitter, Injectable } from '@angular/core';
import { BackendService } from './backend.service';
import { AuthoService } from './autho.service';
import { LoggingService } from './logging.service';

declare const firebase: any;
const page = 'database page';

@Injectable()
export class DatabaseService {

  public userDataPublic = {
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


  public userDataPrivate = {};
  public sellerData = {
    displayName: '',
    email: '',
    photoURL: '',
    created: null,
    // detects if user needs setup on their page.
    newUser: 1,
    // detects if user has signed up for a trial plan yet.
    startedTrial: false,
    description: ''
  };
  public sellerHouseData = [];
  public userDatabaseStatus = new EventEmitter<boolean>(); // listeners at: app.component
  public userDatabaseTrigger = new EventEmitter<any>();
  public sellerDatabaseTrigger = new EventEmitter<boolean>();

  constructor( public backend: BackendService, public log: LoggingService ) {
  }

  checkDatabaseForUser( uid: any ): void {
    firebase.database().ref( 'Users/' + uid ).once( 'value' )
      .then( ( snapshot ) => {
        if ( snapshot.val() != null ) {
          this.userDatabaseStatus.emit( true );
        } else {
          this.userDatabaseStatus.emit( false );
        }
      } )
      .catch( ( error ) => {

      } );
  }

  getUserData( uid: any, open: boolean ): any {
    console.log( 'getting.. Userszzz/' + uid + '/public' );

    let userRef;
    if ( open ) {
      userRef = firebase.database().ref( 'Users/' + uid + '/public' );
    } else {
      userRef = firebase.database().ref( 'Users/' + uid + '/private' );
    }

    userRef.on( 'child_added', ( data ) => {

      if ( open ) {
        this.userDataPublic[ data.key ] = data.val();
      } else {
        this.userDataPrivate[ data.key ] = data.val();

      }
      this.userDatabaseTrigger.emit( data );
    } );

    userRef.on( 'child_changed', ( data ) => {
      if ( open ) {
        this.userDataPublic[ data.key ] = data.val();
      } else {
        this.userDataPrivate[ data.key ] = data.val();

      }
      this.userDatabaseTrigger.emit( data );
    } );

    userRef.on( 'child_removed', function ( data ) {
      if ( open ) {
        this.userDataPublic[ data.key ] = null;
      } else {
        this.userDataPrivate[ data.key ] = null;
      }
      this.userDatabaseTrigger.emit( true );
    } );

  }

  getSellerData( sellerId: any ): any {

    let sellerRef;
    this.sellerData = {
      displayName: '',
      email: '',
      photoURL: '',
      created: null,
      // detects if user needs setup on their page.
      newUser: 10,
      // detects if user has signed up for a trial plan yet.
      startedTrial: false,
      description: ''
    };

    sellerRef = firebase.database().ref( 'Users/' + sellerId + '/public' );

    sellerRef.on( 'child_added', ( data ) => {
      this.sellerData[ data.key ] = data.val();
      this.sellerDatabaseTrigger.emit( true );
    } );

    sellerRef.on( 'child_changed', ( data ) => {
      this.sellerData[ data.key ] = data.val();
      this.sellerDatabaseTrigger.emit( true );
    } );

    sellerRef.on( 'child_removed', function ( data ) {
      this.sellerData[ data.key ] = null;
      this.sellerDatabaseTrigger.emit( true );
    } );

  }

  getHouseData( houseIdWithLocationData: any ): any {

    let houseRef;
    houseRef = firebase.database().ref( 'PublishedHouses/' + houseIdWithLocationData );

    houseRef.on( 'child_added', ( data ) => {
      this.sellerData[ data.key ] = data.val();
      this.sellerDatabaseTrigger.emit( true );
    } );

    houseRef.on( 'child_changed', ( data ) => {
      this.sellerData[ data.key ] = data.val();
      this.sellerDatabaseTrigger.emit( true );
    } );

    houseRef.on( 'child_removed', function ( data ) {
      this.sellerData[ data.key ] = null;
      this.sellerDatabaseTrigger.emit( true );
    } );

  }

  parseToHTML( firebaseData ) {
    return firebaseData.replace( /\n/g, '<br />' );
  }

  writeUserData( userId, dataObj, open: boolean ): any {
    if ( open ) {
      return firebase.database().ref( 'Users/' + userId + '/public' ).update( dataObj );
    } else {
      return firebase.database().ref( 'Users/' + userId + '/private' ).update( dataObj );
    }
  }

  writeUserHouseData(userId, houseId, houseObj) {
    return firebase.database().ref('Users/' + userId + '/public/houses/' + houseId ).update( houseObj );
  }

  writeCustomerId( dataObj ): any {
    return firebase.database().ref( 'Customers' ).update( dataObj )
  }

  generateNewHouseKey() {
    return firebase.database().ref().child( 'Houses' ).push().key;
  }

  generateHouseImageKey( location ) {
    return firebase.database().ref().child( location ).push().key;
  }

  initalizeNewHouse( key, obj ) {
    return firebase.database().ref( 'Houses/' + key ).update( obj );
  }

  writeHouseData( location, obj ) {
    console.log('writing house data..');
    console.log(location);
    console.log(obj);
    return firebase.database().ref( location ).update( obj );
  }

}
