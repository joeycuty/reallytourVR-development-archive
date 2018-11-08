import { Component, OnInit, Input } from '@angular/core';
import { FileService } from '../../../services/file.service';
import { HouseModelService } from '../../../models/house-model.service';
import { DatabaseService } from '../../../services/database.service';
import { isUndefined } from 'util';

@Component( {
  selector: 'app-image-form',
  templateUrl: './image-form.component.html',
  styleUrls: [ './image-form.component.css' ]
} )

export class ImageFormComponent implements OnInit {
  @Input() image: any;
  @Input() index: any;
  @Input() fileType: any;

  public updatingTimerArray: any[] = [];

  constructor( public fileProcessor: FileService, public houseModel: HouseModelService, public database: DatabaseService ) {
  }

  ngOnInit() {
  }

  updateImageMetaData( text, loc, i, type ) {

    let uniqueTimer = '';
    let dbName = '';

    console.log( text );
    console.log( loc );
    console.log( i );
    console.log( type );

    if ( type === 'pano' ) {
      dbName = this.houseModel.house.panos[ i ].id;
      uniqueTimer = loc + i + 'p';
    } else {
      dbName = this.houseModel.house.statics[ i ].id;
      uniqueTimer = loc + i + 's';
    }

    clearTimeout( this.updatingTimerArray[ uniqueTimer ] );
    this.updatingTimerArray[ uniqueTimer ] =
      setTimeout(
        () => {

          if ( text !== undefined && this.houseModel.house.id !== null ) {

            const template = {};
            template[ loc ] = text;
            let databaseLocation = '';
            // show loading screens

            if ( type === 'pano' ) {
              this.houseModel.house.panos[ i ].savingTextData = true;
              databaseLocation = this.houseModel.house.id + '/Panos/' + dbName;
            } else {
              this.houseModel.house.statics[ i ].savingTextData = true;
              databaseLocation = this.houseModel.house.id + '/Statics/' + dbName;
            }

            if ( this.houseModel.houseIsBeingEdited ) {
              databaseLocation = 'PublishedHouses/' + databaseLocation;
            } else {
              databaseLocation = 'Houses/' + databaseLocation;
            }
            this.database.writeHouseData( databaseLocation, template )

              .then( ( success ) => {

                console.log( 'update successful!' );

                setTimeout(
                  () => {

                    if ( type === 'pano' ) {
                      this.houseModel.house.panos[ i ].savingTextData = false;
                    } else {
                      this.houseModel.house.statics[ i ].savingTextData = false;
                    }

                  }, 250 );
              } )
              .catch( ( error ) => {
                console.log( 'failure updating..' );
              } );
          } else {
            console.log( 'no template to update..' );

          }
        }

        , 1000 );
  }

}
