import { Injectable, EventEmitter } from '@angular/core';
import { Http } from '@angular/http';

import { GlobalsService } from './globals.service';

declare const google: any;

function toRad( num ) {
  return num * Math.PI / 180;
}

function toDeg( num ) {
  return num * 180 / Math.PI;
}

@Injectable()
export class MapsService {

  public lastMap: any;
  public input: any;
  public infowindow: any;
  public marker: any;

  public gMarkers: any[] = [];
  public emittedBounds = new EventEmitter<any>();
  public infoWindowOpen = '';

  constructor( public http: Http, public globals: GlobalsService ) {
  }

  // attach a new google places object to input.
  attachAutocomplete( input: any ) {
    return new google.maps.places.Autocomplete(
      /** @type {!HTMLInputElement} */
      (input), { types: [ 'geocode' ] } );
  }

  // generate map from lat and long.
  generateMapFromLatLng( lat, lng, htmlref: any ): any {
    // put lat and long in an object.
    const latlng = { lat: lat, lng: lng };
    // set the past map to this one.
    const houseMap = new google.maps.Map( document.getElementById( htmlref ), {
      center: latlng,
      zoom: 10
    } );

    this.marker.setVisible( false );

    // set an icon for this marker... can delete probs??
    this.marker.setIcon( /** @type {google.maps.Icon} */ ({
      url: 'https://maps.gstatic.com/mapfiles/place_api/icons/geocode-71.png',
      size: new google.maps.Size( 71, 71 ),
      origin: new google.maps.Point( 0, 0 ),
      anchor: new google.maps.Point( 17, 34 ),
      scaledSize: new google.maps.Size( 35, 35 )
    }) );

    this.marker.setPosition( latlng );
    this.marker.setVisible( true );

    houseMap.setZoom( 17 );
    houseMap.setCenter( this.marker.position );

    google.maps.event.addListenerOnce( houseMap, 'idle', function () {
      google.maps.event.trigger( houseMap, 'resize' );
    } );

  }

  // get the lat and long of a google place.
  geocodeLatLng( lat, long ) {

    const geocoder = new google.maps.Geocoder;
    const latlng = { lat: lat, lng: long };
    geocoder.geocode( { 'location': latlng }, function ( results, status ) {
      if ( status === 'OK' ) {
        console.log( results );
        if ( results[ 1 ] ) {
          console.log( results[ 1 ].formatted_address );
        } else {
          console.log( 'No results found' );
        }
      } else {
        console.log( 'Geocoder failed due to: ' + status );
      }
    } );
  }

  // gets teh distance in miles between to lat / long points.
  getDistanceFromLatLonInMi( lat1, lon1, lat2, lon2 ) {
    const R = 3959; // Radius of the earth in km
    const dLat = this.deg2rad( lat2 - lat1 ); // deg2rad below
    const dLon = this.deg2rad( lon2 - lon1 );
    const a =
      Math.sin( dLat / 2 ) * Math.sin( dLat / 2 ) +
      Math.cos( this.deg2rad( lat1 ) ) * Math.cos( this.deg2rad( lat2 ) ) *
      Math.sin( dLon / 2 ) * Math.sin( dLon / 2 );
    const c = 2 * Math.atan2( Math.sqrt( a ), Math.sqrt( 1 - a ) );
    const d = R * c; // Distance in km
    return d;
  }

  // changes degrees to radians.
  deg2rad( deg ) {
    return deg * (Math.PI / 180);
  }

  public getLastCenter() {
    console.log( this.lastMap.getCenter().lat() );
    console.log( this.lastMap.getCenter().lng() );

    this.destinationPoint( 90, 100 );
  }

  destinationPoint( brng, dist ) {
    dist = dist / 3959;
    brng = toRad( brng );

    const lat1 = toRad( this.lastMap.getCenter().lat() ),
      lon1 = toRad( this.lastMap.getCenter().lng() );

    const lat2 = Math.asin( Math.sin( lat1 ) * Math.cos( dist ) +
      Math.cos( lat1 ) * Math.sin( dist ) * Math.cos( brng ) );

    const lon2 = lon1 + Math.atan2( Math.sin( brng ) * Math.sin( dist ) *
        Math.cos( lat1 ),
        Math.cos( dist ) - Math.sin( lat1 ) *
        Math.sin( lat2 ) );

    if ( isNaN( lat2 ) || isNaN( lon2 ) ) {
      return null;
    }

    const latlng = new google.maps.LatLng( toDeg( lat2 ), toDeg( lon2 ) );

    const l = { lat: latlng.lat(), lng: latlng.lng() };

  }

  // generates map and sends out the bounds of map to the search components.
  generateMapForSearch( lat, long, htmlref: any ): any {

    // create map for google maps.
    const latlong = { lat: lat, lng: long };
    this.lastMap = new google.maps.Map( document.getElementById( htmlref ), {
      center: latlong,
      zoom: 12,

    } );

    google.maps.event.addListener( this.lastMap, 'idle', () => {
      google.maps.event.trigger( this.lastMap, 'resize' );

      const leftlong = this.lastMap.getBounds().b.b;
      const rightlong = this.lastMap.getBounds().b.f;
      const leftlat = this.lastMap.getBounds().f.b;
      const rightlat = this.lastMap.getBounds().f.f;

      const bounds = {
        toplat: leftlat,
        leftlong: leftlong,
        bottomlat: rightlat,
        rightlong: rightlong
      };

      console.log( 'idle' );
      this.emittedBounds.emit( bounds );

    } );
    // google.maps.event.addListener(this.lastMap, 'bounds_changed', () => {
    //     google.maps.event.trigger(this.lastMap, 'resize');

    //     const leftlong = this.lastMap.getBounds().b.b;
    //     const rightlong = this.lastMap.getBounds().b.f;
    //     const leftlat = this.lastMap.getBounds().f.b;
    //     const rightlat = this.lastMap.getBounds().f.f;

    //     const bounds = {
    //         toplat: leftlat,
    //         leftlong: leftlong,
    //         bottomlat: rightlat,
    //         rightlong: rightlong
    //     }

    //     this.emittedBounds.emit(bounds);

    //     console.log("bounds changed");

    // });

  }

  // add a marker to the map.
  addMarker( dataObj ) {

    // put lat and long in correct formats.
    const lat = dataObj[ 'location' ][ 'lat' ];
    const long = dataObj[ 'location' ][ 'lng' ];

    const lats = Math.floor( lat );
    const longs = Math.floor( long );

    const place = lats + '_' + longs;

    const latlong = { lat: lat, lng: long };

    const contentString =
      `<div class="row">
            <div class="col s10 offset-s1 m3">
                <a target="_blank" href="https://reallytourvr.com/house/${place}/${dataObj[ 'key' ]}">
                <img src="${dataObj[ 'mainStatic' ]}" alt="" class="" style="margin-top: 10px; width:100%;"></a>
            </div>

            <div class="col s12 m9">
                <h5 class="card-title grey-text text-darken-4">${dataObj[ 'title' ]}
                 <span class="chip">$${dataObj[ 'price' ]}</span></h5>
                <p>${dataObj[ 'description' ]}</p>
            </div>
        </div>`;

    // create an info window
    const infowindow = new google.maps.InfoWindow( {
      content: contentString
    } );

    // add the marker.
    const marker = new google.maps.Marker( {
      position: latlong,
      map: this.lastMap,
      animation: google.maps.Animation.DROP,
      title: dataObj[ 'key' ]
    } );
    marker.addListener( 'click', () => {
      infowindow.open( this.lastMap, marker );
      this.infoWindowOpen = marker.title;
    } );

    // push to list of markers.
    this.gMarkers.push( marker );

  }


  // checks if marker is already on the map.
  checkIfOnMap( newTitle: String ) {

    if ( this.gMarkers.length > 0 ) {
      for ( let i = 0; i < this.gMarkers.length; i++ ) {
        if ( this.gMarkers[ i ].title === newTitle ) {
          return true;
        }
      }

    }

    return false;
  }

  // gets address from autocomplete input and shows address in google maps.
  fillInAddress( place ) {

    const lat = (place.geometry.location.lat().toString().replace( '.', '_' ));
    const long = (place.geometry.location.lng().toString().replace( '.', '_' ));


    if ( this.globals.router.url.indexOf( '/search/' ) !== -1 ) {
      this.lastMap.setCenter( { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() } );
      this.lastMap.setZoom( 12 );
    } else {
      this.globals.navigate( 'search/' + lat + '/' + long );

    }

  }

  getLocation() {
    this.globals.toast( 'getting location...', 1000 );
    navigator.geolocation.getCurrentPosition(
      ( position ) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        console.log( 'FOUND CORDS!!' );
        console.log( latitude );
        console.log( longitude );

        const lat = (latitude.toString().replace( '.', '_' ));
        const long = (longitude.toString().replace( '.', '_' ));
        if ( this.globals.router.url.indexOf( '/search/' ) !== -1 ) {
          this.lastMap.setCenter( { lat: latitude, lng: longitude } );
          this.lastMap.setZoom( 12 );
        } else {
          this.globals.navigate( 'search/' + lat + '/' + long );

        }

      },

      ( error ) => {
        this.globals.toast( 'ERROR: Could not get your location!', 2000 );
        console.log( 'could not get location..' );
      } );
  }

  // get the index of a house already on the map.
  getIndexOnMap( newTitle: String ) {

    if ( this.gMarkers.length > 0 ) {
      for ( let i = 0; i < this.gMarkers.length; i++ ) {
        if ( this.gMarkers[ i ].title === newTitle ) {
          return i;
        }
      }

    }

    // holy shit fix this shit code.
    return 999999999999;
  }

  // replaces an existing marker with the updated one.
  updateMarker( dataObj ) {
    const index = this.getIndexOnMap( dataObj[ 'key' ] );
    this.removeMarker( index );
    this.addMarker( dataObj );

  }

  // remove the marker.
  removeMarker( key ) {
    const index = this.getIndexOnMap( key );
    for ( let i = 0; i < this.gMarkers.length; i++ ) {
      if ( i === index ) {
        this.gMarkers[ i ].setMap( null );
        this.gMarkers.splice( i, 1 );
      }
    }
  }

  removeAllMarkers() {
    this.gMarkers.forEach( ( val, i ) => {
      console.log( this.gMarkers.length );
      console.log( 'ran ' + i );
      this.gMarkers[ i ].setMap( null );

    } );

    this.gMarkers = [];
  }

  // vague generate map function.
  generateMap( location: any, htmlref: any ): any {
    // create map for google maps.
    this.lastMap = new google.maps.Map( document.getElementById( htmlref ), {
      center: { lat: -33.8688, lng: 151.2195 },
      zoom: 10
    } );

    this.infowindow = new google.maps.InfoWindow();
    this.marker = new google.maps.Marker( {
      map: this.lastMap,
      anchorPoint: new google.maps.Point( 0, -29 )
    } );

    this.infowindow.close();
    this.marker.setVisible( false );

    const place = location;

    // could not find house? or geometery at least.
    if ( !place ) {
      window.alert( 'Autocomplete\'s returned place contains no geometry' );
      return;
    }

    // If the place has a geometry, then present it on a map.
    if ( place.viewport ) {

      console.log( 'fit bounds..' );
      this.lastMap.fitBounds( place.viewport );

    }

    // set marker on location
    this.marker.setIcon( /** @type {google.maps.Icon} */ ({
      url: place.icon,
      size: new google.maps.Size( 71, 71 ),
      origin: new google.maps.Point( 0, 0 ),
      anchor: new google.maps.Point( 17, 34 ),
      scaledSize: new google.maps.Size( 35, 35 )
    }) );
    this.marker.setPosition( place.location );
    this.marker.setVisible( true );

    this.lastMap.setZoom( 17 );
    this.lastMap.setCenter( this.marker.position );

    google.maps.event.addListenerOnce( this.lastMap, 'idle', function () {
      google.maps.event.trigger( this.lastMap, 'resize' );
    } );
  }

}
