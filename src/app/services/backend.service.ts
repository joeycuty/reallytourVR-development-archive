import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/Rx';
import { LoggingService } from './logging.service';

declare const firebase: any;
const page = 'backend';

@Injectable()
export class BackendService {

  constructor( public http: Http, public log: LoggingService ) {
  }

  testServer( obj ) {
    const body = JSON.stringify( obj );
    const headers = new Headers();
    headers.append( 'Content-Type', 'application/json' );

    return this.http.post( 'https://reallytourvr.herokuapp.com/inbound', body, { headers: headers } )
      .map( ( data: Response ) => data.json() ).toPromise();
  }

  initToken() {
    return firebase.auth().currentUser.getToken( /* forceRefresh */ true );
  }

  getCustomer( idToken, cusId ) {

    const obj = {
      utoken: idToken,
      cusId: cusId
    };

    const body = JSON.stringify( obj );
    const headers = new Headers();
    headers.append( 'Content-Type', 'application/json' );

    return this.http.post( 'https://reallytourvr.herokuapp.com/getcustomer', body, { headers: headers } )
      .map( ( data: Response ) => data.json() ).toPromise();
  }

  newCustomer( obj ) {
    const body = JSON.stringify( obj );
    const headers = new Headers();
    headers.append( 'Content-Type', 'application/json' );
    return this.http.post( 'https://reallytourvr.herokuapp.com/newcustomer', body, { headers: headers } )
      .map( ( data: Response ) => data.json() ).toPromise();
  }

  setNewSubscriptionWithCard( obj ) {
    const body = JSON.stringify( obj );
    const headers = new Headers();
    headers.append( 'Content-Type', 'application/json' );

    return this.http.post( 'https://reallytourvr.herokuapp.com/set-new-subscription-with-card', body, { headers: headers } )
      .map( ( data: Response ) => data.json() ).toPromise();
  }

  setNewSubscriptionWithOldCard( obj ) {
    const body = JSON.stringify( obj );
    const headers = new Headers();
    headers.append( 'Content-Type', 'application/json' );

    return this.http.post( 'https://reallytourvr.herokuapp.com/set-new-subscription-with-old-card', body, { headers: headers } )
      .map( ( data: Response ) => data.json() ).toPromise();
  }

  getProratedPrice( obj ) {

    const body = JSON.stringify( obj );
    const headers = new Headers();
    headers.append( 'Content-Type', 'application/json' );

    return this.http.post( 'https://reallytourvr.herokuapp.com/get-prorated-price', body, { headers: headers } )
      .map( ( data: Response ) => data.json() ).toPromise();
  }

  getUpcomingInvoices( obj ) {

    const body = JSON.stringify( obj );
    const headers = new Headers();
    headers.append( 'Content-Type', 'application/json' );

    return this.http.post( 'https://reallytourvr.herokuapp.com/get-upcoming-invoices', body, { headers: headers } )
      .map( ( data: Response ) => data.json() ).toPromise();
  }

  getPreviousInvoices( obj ) {

    const body = JSON.stringify( obj );
    const headers = new Headers();
    headers.append( 'Content-Type', 'application/json' );

    return this.http.post( 'https://reallytourvr.herokuapp.com/get-all-invoices', body, { headers: headers } )
      .map( ( data: Response ) => data.json() ).toPromise();
  }

  updateCardInfo( obj ) {

    const body = JSON.stringify( obj );
    const headers = new Headers();
    headers.append( 'Content-Type', 'application/json' );

    return this.http.post( 'https://reallytourvr.herokuapp.com/update-card-info', body, { headers: headers } )
      .map( ( data: Response ) => data.json() ).toPromise();
  }

}
