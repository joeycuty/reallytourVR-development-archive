import { AfterViewInit, Component, OnInit } from '@angular/core';
import { HouseModelService } from '../../../models/house-model.service';
import { Pano } from '../../../models/classes/pano.class';
import { GlobalsService } from '../../../services/globals.service';

declare const VRView: any;

@Component( {
  selector: 'app-edit-house-review-panos',
  templateUrl: './edit-house-review-panos.component.html',
  styleUrls: [ './edit-house-review-panos.component.css' ]
} )
export class EditHouseReviewPanosComponent implements OnInit, AfterViewInit {

  public vrView: any;
  public panoTitle: any;
  public panoDescription: any;

  constructor( public houseModel: HouseModelService, public globals: GlobalsService ) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    if ( this.vrView == null ) {

      this.vrView = new VRView.Player( '#vrview', {
        image: this.houseModel.house.mainPano,
        is_stereo: false,
        width: '100%',
        height: '500px'
      } );
    }
  }

  selectPano( img ) {

    this.panoTitle = img.title;
    this.panoDescription = img.description;

    const oldURL = img.imageSource;
    let index = 0,
      newURL = oldURL;
    index = oldURL.indexOf( 'media&' );
    if ( index !== -1 ) {
      newURL = oldURL.substring( 0, index + 5 );
    }

    const new2URL = oldURL.substring( index, oldURL.length );

    let tokenURL = new2URL;
    index = new2URL.indexOf( '=' );
    if ( index !== -1 ) {
      tokenURL = new2URL.substring( index + 1, new2URL.length );
    }

    console.log( newURL.toString() + '&token=' + tokenURL.toString() );

    this.vrView.setContent( {
      image: newURL.toString(),
      token: tokenURL.toString(),
      is_stereo: false
    } );

    this.globals.globalChangeDetectorRef.emit( true );

  }
}
