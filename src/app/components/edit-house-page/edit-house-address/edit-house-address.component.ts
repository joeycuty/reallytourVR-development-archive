import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MapsService } from '../../../services/maps.service';
import { HouseModelService } from '../../../models/house-model.service';
import { AuthoService } from '../../../services/autho.service';
import { GlobalsService } from '../../../services/globals.service';

@Component( {
  selector: 'app-edit-house-address',
  templateUrl: './edit-house-address.component.html',
  styleUrls: [ './edit-house-address.component.css' ]
} )
export class EditHouseAddressComponent implements OnInit, AfterViewInit {

  public googleMapsAddress: any;
  public mapCardDescription: any;

  constructor( public maps: MapsService, public houseModel: HouseModelService, public autho: AuthoService,
               public globals: GlobalsService ) {
  }

  ngOnInit() {
    this.houseModel.house.owner = this.autho.userId;
  }

  ngAfterViewInit() {
    // connect the google maps autocomplete api with search input
    this.googleMapsAddress = this.maps.attachAutocomplete( document.getElementById( 'editHouseMapsAutoComplete' ) );
    // When the user selects an address from the dropdown, populate the address
    // fields in the form.
    this.googleMapsAddress.addListener( 'place_changed', () => {
      this.fillInAddress();
    } );

  }

  fillInAddress() {

    const place = this.googleMapsAddress.getPlace();

    this.houseModel.house.address = place.formatted_address;
    //  this.globals.newHouseGeo[ 'icon' ] = place.icon;

    // this.globals.newHouseText[ 'location' ] = {};
    // this.globals.newHouseText[ 'owner' ] = this.globals.uid;

    this.houseModel.house.map.lat = place.geometry.location.lat();
    this.houseModel.house.map.lng = place.geometry.location.lng();

    for ( let i = 0; i < place.address_components.length; i++ ) {
      for ( let j = 0; j < place.address_components[ i ].types.length; j++ ) {
        if ( place.address_components[ i ].types[ j ] === 'postal_code' ) {
          this.houseModel.house.zipCode = place.address_components[ i ].long_name;
        }
      }
    }
    console.log( this.houseModel.house.zipCode );

    //  this.maps.generateMapFromLatLng( this.houseModel.house.map.lat, this.houseModel.house.map.lng, 'editHouseMap' );

    this.globals.globalChangeDetectorRef.emit( true );
  }

}
