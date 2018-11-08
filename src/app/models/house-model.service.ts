import { Injectable } from '@angular/core';
import { GlobalsService } from '../services/globals.service';
import { DatabaseService } from '../services/database.service';
import { LoggingService } from '../services/logging.service';
import {AuthoService} from "../services/autho.service";

const page = 'house-model';

@Injectable()
export class HouseModelService {
  get allStaticsAreNotUploaded(): boolean {
    return this._allStaticsAreNotUploaded;
  }

  set allStaticsAreNotUploaded( value: boolean ) {
    this._allStaticsAreNotUploaded = value;
  }

  get allPanosAreNotUploaded(): boolean {
    return this._allPanosAreNotUploaded;
  }

  set allPanosAreNotUploaded( value: boolean ) {
    this._allPanosAreNotUploaded = value;
  }

  get houseIsBeingEdited(): boolean {
    return this._houseIsBeingEdited;
  }

  set houseIsBeingEdited( value: boolean ) {
    this._houseIsBeingEdited = value;
  }

  get house(): {
    id: string; typeOfSale: string; owner: string; address: string; price: string; acreage: string; youtube: Array<any>;
    description: string; zipCode: string; mainStatic: string; mainPano: string; title: string; map: { lat: any; lng: any };
    statics: Array<any>; panos: Array<any>
  } {
    return this._house;
  }

  set house( value: {
    id: string; typeOfSale: string; owner: string; address: string; price: string; acreage: string; youtube: Array<any>;
    description: string; zipCode: string; mainStatic: string; mainPano: string; title: string; map: { lat: any; lng: any };
    statics: Array<any>; panos: Array<any>
  } ) {
    this._house = value;
    this.globals.globalChangeDetectorRef.emit( true );
  }

  get editHouseProgessString(): string {
    return this._editHouseProgessString;
  }

  set editHouseProgessString( value: string ) {
    this._editHouseProgessString = value;
  }

  get editHouseState(): string {
    return this._editHouseState;
  }

  set editHouseState( value: string ) {
    this._editHouseState = value;
    this.globals.globalChangeDetectorRef.emit( true );
  }

  get houseId(): string {
    return this._houseId;
  }

  set houseId( value: string ) {
    this._houseId = value;
  }

  public _editHouseProgessString = '1%';
  public _editHouseState = 'default';
  public _editHouseMessage = '';
  public _rawYoutube = '';

  get editHouseMessage(): string {
    return this._editHouseMessage;
  }

  set editHouseMessage( value: string ) {
    this._editHouseMessage = value;
    this.globals.globalChangeDetectorRef.emit( true );
  }

  get rawYoutube(): string {
    return this._rawYoutube;
  }

  set rawYoutube( value: string ) {
    this._rawYoutube = value;
    clearTimeout( this.updatingTimer );

    this.updatingTimer = setTimeout( () => {
      this.processRawYoutube();
      this.globals.globalChangeDetectorRef.emit( true );
    }, 2000 );
  }

  public _houseId = '';
  public _formatedYoutube = [];
  get formatedYoutube(): Array<any> {
    return this._formatedYoutube;
  }

  set formatedYoutube( value: Array<any> ) {
    this._formatedYoutube = value;
  }

  public _allPanosAreNotUploaded = false;
  public _allStaticsAreNotUploaded = false;
  public _houseIsBeingEdited = false;
  public updatingTimer: any;
  public updatingTimerArray: any[];
  public _house = {
    id: 'test',
    typeOfSale: '',
    owner: '',
    address: '',
    price: '',
    acreage: '',
    youtube: [],
    description: '',
    zipCode: '',
    mainStatic: '',
    mainPano: '',
    title: '',
    map: {
      lat: null,
      lng: null
    },
    statics: [],
    panos: []
  };

  constructor( public globals: GlobalsService, public database: DatabaseService, public log: LoggingService, public autho: AuthoService ) {
  }

  editHouseSaveAndExit() {
    console.log( 'SAVE AND EXIT' );
  }

  checkThatAllImagesAreUploaded() {
    for ( let i = 0; i < this.house.panos.length; i++ ) {
      if ( this.house.panos[ i ].imageUploaded === false ) {
        this.allPanosAreNotUploaded = true;
        console.log( 'images are not uploaded' );
        break;
      }
      console.log( 'images are uploaded' );
      this.allPanosAreNotUploaded = false;
    }

    for ( let i = 0; i < this.house.statics.length; i++ ) {
      if ( this.house.statics[ i ].imageUploaded === false ) {
        this._allStaticsAreNotUploaded = true;
        break;
      }

      this.allStaticsAreNotUploaded = false;
    }
  }

  resetHouseModel() {
    this.house = {
      id: 'test',
      typeOfSale: '',
      owner: '',
      address: '',
      price: '',
      acreage: '',
      youtube: [],
      description: '',
      zipCode: '',
      mainStatic: '',
      mainPano: '',
      title: '',
      map: {
        lat: null,
        lng: null
      },
      statics: [],
      panos: []
    };
  }

  processRawYoutube() {
    if ( this.rawYoutube !== '' && this.rawYoutube !== null ) {
      this.formatedYoutube = [];
      const youtubeArray = this.rawYoutube.split( ',' );

      for ( let i = 0; i < youtubeArray.length; i++ ) {

        youtubeArray[ i ] = youtubeArray[ i ].trim();
        if ( i === 3 ) {
          this.editHouseMessage = 'ERROR: you have too many youtube links.';
        } else if ( i < 3 ) {
          if ( youtubeArray[ i ] !== '' ) {
            const match = youtubeArray[ i ].match( /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/ );
            if ( match && match[ 2 ].length === 11 ) {
              console.log( match );
              this.house.youtube.push( match[ 2 ] );
              this.formatedYoutube.push( this.globals.sanitizer.bypassSecurityTrustResourceUrl( 'https://www.youtube.com/embed/' + match[ 2 ] ) );
              this.editHouseMessage = 'sucess fame';

            } else {
              this.editHouseMessage = 'ERROR: one or more of your youtube links could not be validated.';
            }
          }
        }

      }

    }
    console.log( this.house );
  }

  processTextData() {
    if ( this.house.typeOfSale === '' ) {
      this.editHouseMessage = 'ERROR: please select a Selling Status.';
    } else if ( this.house.price === '' ) {
      this.editHouseMessage = 'ERROR: please enter a price.';
    } else if ( this.house.title === '' ) {
      this.editHouseMessage = 'ERROR: please enter a title for your house.';
    } else if ( this.house.description === '' ) {
      this.editHouseMessage = 'ERROR: please enter a short description of your house.';
    } else {

      this.house.id = this.database.generateNewHouseKey();
      this.database.initalizeNewHouse( this.house.id, this.house )
        .then( () => {
          this.editHouseState = 'uploadPanos';
        } )
        .catch( ( error ) => {
          this.log.failure( page, error );
        } );
    }
  }

  saveAndExit() {
    this.database.writeHouseData( 'PublishedHouses/' + this.house.id + '_' + this.house.map.lat.toString()
      .replace('.', '*') + '_' + this.house.map.lng.toString().replace('.', '*'), this.house )
      .then( () => {
        // success!!!
        // this.globals.toast( 'House published successfully!', 3000 );
      } )
      .catch( ( error ) => {
        console.log( 'there was an error saving.  Please try again.' );
      } );

    this.database.writeUserHouseData(this.autho.userId, this.house.id , this.house )
      .then( () => {
        this.globals.toast( 'House saved successfully!', 3000 );
        this.globals.navigate( '/seller/me' );
      } )
      .catch( ( error ) => {
        console.log( 'there was an error saving.  Please try again.' );
      } );
  }

}

