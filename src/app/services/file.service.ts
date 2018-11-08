import { Injectable } from '@angular/core';
import { SellerModelService } from '../models/seller-model.service';
import { LoggingService } from './logging.service';
import { AuthoService } from './autho.service';
import { GlobalsService } from './globals.service';
import { DatabaseService } from './database.service';
import { Pano } from '../models/classes/pano.class';
import { HouseModelService } from '../models/house-model.service';
import { ProfileImage } from '../models/classes/profileImage.class';
import { Static } from '../models/classes/static.class';

const page = 'file-service';

declare const firebase: any;

@Injectable()
export class FileService {

  constructor( public sellerModel: SellerModelService, public log: LoggingService, public autho: AuthoService,
               public globals: GlobalsService, public database: DatabaseService, public houseModel: HouseModelService ) {
  }

  rotateImage( degree, file, fileType, index ) {
    console.log( 'running rotate' );
    // load new image to javascripts reader
    const reader = new FileReader();
    // name it profile.
    const name = fileType;
    // load dataURL into reader and process.
    reader.onload = (( event ) => {
      // create a new image to manipulate.
      const image = new Image();
      image.onload = (() => {
        {
          // build a temp canvas to rotate image in.
          const canvas = document.createElement( 'canvas' ),
            // set max size... may be wrong
            max_size = 2048; // TODO : pull max size from a site config
          // get width and height from the old image.
          let width = image.width,
            height = image.height;
          // get the max height or width
          // if width greater than height
          if ( width > height ) {
            // if width is larger than max file width/height, set width to max and scale height to matcanvasHeight
            if ( width > max_size ) {
              height *= max_size / width;
              width = max_size;
            }
          } else {
            // if height is larger than max file width/height, set height to max and scale width to matcanvasHeight.
            if ( height > max_size ) {
              width *= max_size / height;
              height = max_size;
            }
          }
          // get context of canvas for rotating
          const canvasContext = canvas.getContext( '2d' );
          let canvasWidth = width,
            canvasHeight = height,
            canvasX = 0,
            canvasY = 0;
          // rotate depending on degrees entered.
          switch ( degree ) {
            case 90:
              canvasWidth = height;
              canvasHeight = width;
              canvasY = height * (-1);
              break;
            case -90:
              canvasWidth = height;
              canvasHeight = width;
              canvasX = width * (-1);
              break;
          }
          //  Rotate image
          canvas.setAttribute( 'width', canvasWidth.toString() );
          canvas.setAttribute( 'height', canvasHeight.toString() );
          canvasContext.rotate( degree * Math.PI / 180 );
          canvasContext.drawImage( image, canvasX, canvasY );
          // convert DataURL to File.
          const newFile = this.dataURLToFile( canvas.toDataURL( 'image/jpeg' ), name, fileType );

          if ( fileType === 'profile' ) {
            console.log( 'added file ' );
            this.sellerModel.previewProfileImage = newFile;

            let output;
            output = document.getElementById( 'profile1' );
            output.setAttribute( 'src', newFile.imageSource );
            output = document.getElementById( 'profile2' );
            output.setAttribute( 'src', newFile.imageSource );
            output = document.getElementById( 'profile3' );
            output.setAttribute( 'src', newFile.imageSource );
            output = document.getElementById( 'profile4' );
            output.setAttribute( 'src', newFile.imageSource );

          } else if ( fileType === 'pano' ) {
            this.houseModel.house.panos[ index ] = newFile;
            this.globals.globalChangeDetectorRef.emit( true );
          } else if ( fileType === 'static' ) {

          } else {
            console.log( fileType );
          }
        }
        // end of callback function, pass var from reader here.
      });
      image.src = event.target[ 'result' ];
      // end of reader object, pass file name here.
    });

    // encode data into a dataURL string.
    reader.readAsDataURL( file.file );
  }

  addHouseImage( data, fileType ) {

    const files = data.target.files;

    for ( let i = 0; i < files.length; i++ ) {

      console.log( 'files to add ' + files.length );

      if ( files[ i ].type.match( /image.*/ ) ) {

        const reader = new FileReader();
        reader.onload = (( event ) => {
          const image = new Image();
          image.onload = (() => {
            const canvas = document.createElement( 'canvas' ),
              max_size = 2048; // TODO : pull max size from a site config
            let width = image.width,
              height = image.height;
            if ( width > height ) {
              if ( width > max_size ) {
                height *= max_size / width;
                width = max_size;
              }
            } else {
              if ( height > max_size ) {
                width *= max_size / height;
                height = max_size;
              }
            }
            canvas.width = width;
            canvas.height = height;
            canvas.getContext( '2d' ).drawImage( image, 0, 0, width, height );
            const file = this.dataURLToFile( canvas.toDataURL( 'image/jpeg' ), files[ i ].name, fileType );

            if ( fileType === 'pano' ) {
              this.houseModel.house.panos.push( file );
              console.log( this.houseModel.house.panos );
            } else if ( fileType === 'static' ) {
              this.houseModel.house.statics.push( file );
            }
            this.houseModel.checkThatAllImagesAreUploaded();
            this.globals.globalChangeDetectorRef.emit( true );
          });
          image.src = event.target[ 'result' ];

        });
        reader.readAsDataURL( files[ i ] );
      }

    }

  }

  dataURLToFile( dataURL, name, fileType ) {
    // init some vars
    const BASE64_MARKER = ';base64,';
    let parts: any = null,
      contentType: any = null,
      raw: any = null,
      rawLength: any = null;
    // check if dataURL is base64 encoded or not
    if ( dataURL.indexOf( BASE64_MARKER ) === -1 ) {

      parts = dataURL.split( ',' );
      contentType = parts[ 0 ].split( ':' )[ 1 ];
      raw = parts[ 1 ];
      rawLength = raw.length;

    } else {

      parts = dataURL.split( BASE64_MARKER );
      contentType = parts[ 0 ].split( ':' )[ 1 ];
      raw = window.atob( parts[ 1 ] );
      rawLength = raw.length;

    }

    // encode an array of the image.
    const uInt8Array = new Uint8Array( rawLength );
    for ( let i = 0; i < rawLength; ++i ) {
      uInt8Array[ i ] = raw.charCodeAt( i );
    }

    // dump image array into a blob and assign content type.
    let file: any;
    if ( fileType === 'pano' ) {
      file = new Pano();
    } else if ( fileType === 'static' ) {
      file = new Static();
    } else {
      file = new ProfileImage();
    }

    file.file = new Blob( [ uInt8Array ], { type: contentType } );
    // add some metaData to blob.
    file.imageSource = dataURL;
    file.savingImage = false;
    file.name = name;

    return file;

  }

  uploadProfileFile( file ): any {
    return firebase.storage().ref().child( 'images/Users/' + this.autho.user.uid + '/profile' ).put( file );
  }

  uploadProfileImage( file ) {
    // var taskwaiter = false;

    this.sellerModel.updatingProfileImage = true;
    this.sellerModel.updatingProfileOptions = false;

    // create a pipeline to firebase.
    const uploadTask = this.uploadProfileFile( file );

    // listen to pipeline for progress / failure etc.
    uploadTask.on( 'state_changed', ( snapshot ) => {

      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      document.getElementById( 'p-progress1' ).style.width = progress + '%';
      document.getElementById( 'p-progress2' ).style.width = progress + '%';

    }, ( error ) => {
      // stop showing uploading bar..
      this.log.failure( page, error );
      this.sellerModel.updatingProfileImage = false;

    }, () => {
      this.log.note( page, 'profile image uploaded successfully' );
      document.getElementById( 'p-progress1' ).style.width = '100%';
      document.getElementById( 'p-progress2' ).style.width = '100%';

      // this.fileChangeEvent.emit(1);

      // get location of new image from google bucket.
      const downloadURL = uploadTask.snapshot.downloadURL;
      const time = Date.now();
      let staticsdata = {};

      staticsdata = {
        photoURL: downloadURL,
        photoUpdateTime: time
      };

      const userObj = {
        photoURL: downloadURL
      };

      // revisit this for failure thread issues.
      //  write to firebase autho
      this.autho.writeAutho( userObj )
        .then( () => {
          // update any view changes
          this.globals.toast( 'Profile Picture Updated!', 3000 );

          // this.globals.photo = downloadURL;

          this.database.writeUserData( this.autho.user.uid, staticsdata, true )
            .then( ( success ) => {

              this.log.note( page, 'upload successfull for images' );
              // reset model vars.
              this.sellerModel.previewProfileImage = null;
              this.sellerModel.updatingProfileImage = false;

            } )
            .catch( ( error ) => {
              this.log.failure( page, 'update database failed...' );
              // reset model vars.
              this.sellerModel.previewProfileImage = null;
              this.sellerModel.updatingProfileImage = false;
            } );
        } )
        .catch( ( error ) => {
          this.log.failure( page, 'update autho failed...' );
          // reset model vars.
          this.sellerModel.previewProfileImage = null;
          this.sellerModel.updatingProfileImage = false;
        } );

    } );

  }

  uploadHouseImages( fileType ) {
    //////////////////////////////////////////////////////////////////////////////////////

    let len = 0, imageArray = [];
    if ( fileType === 'pano' ) {
      len = this.houseModel.house.panos.length;
      imageArray = this.houseModel.house.panos;
    } else {
      len = this.houseModel.house.statics.length;
      imageArray = this.houseModel.house.statics;
    }

    console.log( 'length at upload' + len );
    const houseskey: string = this.houseModel.house.id;

    for ( let i = 0; i < len; i++ ) {

      if ( imageArray[ i ].imageUploaded === false ) {

        if ( fileType === 'pano' ) {
          this.houseModel.house.panos[ i ].savingImage = true;
        } else {
          this.houseModel.house.statics[ i ].savingImage = true;
        }

        new this.uploadHouseImage( fileType, imageArray[ i ], i, this );
      }
    }

    this.houseModel.checkThatAllImagesAreUploaded();
    this.globals.globalChangeDetectorRef.emit(true);

  }

  uploadHouseImage( fileType, file, index, context ): void {

    let uploadLocation = '';
    const docString = 'progress' + index;
    let dbString = '';

    if ( fileType === 'pano' ) {
      uploadLocation = 'images/House/' + context.houseModel.house.id + '/Panos/';
      dbString = context.houseModel.house.id + '/Panos/';
      context.houseModel.house.panos[ index ].savingImage = true;
    } else {
      uploadLocation = 'images/House/' + context.houseModel.house.id + '/Statics/';
      dbString = context.houseModel.house.id + '/Statics/';
      context.houseModel.house.statics[ index ].savingImage = true;
    }

    context.globals.globalChangeDetectorRef.emit( true );

    if ( context.houseModel.houseIsBeingEdited ) {
      dbString = 'PublishedHouses/' + dbString;
    } else {
      dbString = 'Houses/' + dbString;
    }

    const newName = context.globals.randId();
    const uploadTask = firebase.storage().ref().child( uploadLocation + newName ).put( file.file );

    uploadTask.on( 'state_changed', ( snapshot ) => {
      console.log( snapshot );
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      document.getElementById( docString ).style.width = progress + '%';

    }, ( error ) => {

    }, () => {
      console.log( 'upload success' );
      console.log( uploadTask.snapshot );
      if ( uploadTask.snapshot.downloadURL != null ) {
        console.log( 'found the snapshot dawg ' + index );
        const ref = uploadLocation + newName;
        const url = uploadTask.snapshot.downloadURL;

        console.log( index );
        file.imageUploaded = true;
        file.savingImage = false;
        file.name = newName;
        file.imageSource = url;
        file.id = context.database.generateHouseImageKey( dbString );

        if ( fileType === 'pano' ) {
          if ( index === 0 ) {
            context.houseModel.house.mainPano = url;
          }
          context.houseModel.house.panos[ index ] = file;
        } else {
          if ( index === 0 ) {
            context.houseModel.house.mainStatic = url;
          }
          context.houseModel.house.statics[ index ] = file;
        }

        context.houseModel.checkThatAllImagesAreUploaded();
        context.globals.globalChangeDetectorRef.emit( true );

        const template = {
          name: file.name,
          title: file.title,
          description: file.description,
          imageSource: url,
          ref: ref
        };

        context.database.writeHouseData( dbString + '/' + file.id, template )
          .then( ( success ) => {
            console.log( 'added to db' );
          } )
          .catch( ( error ) => {
            this.globals.toast( 'There was an error adding your image!', 2000 );
            console.log( error );
          } );
      }
    } );

  }

}
