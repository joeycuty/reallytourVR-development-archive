import { Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HouseModelService } from '../../models/house-model.service';
import { routeStateTrigger } from '../../animations/route-animations';
import { StripeModelService } from '../../models/stripe-model.service';

@Component( {
  selector: 'app-edit-house',
  templateUrl: './edit-house.component.html',
  styleUrls: [ './edit-house.component.css' ],
  animations: [ routeStateTrigger ]
} )
export class EditHouseComponent implements OnInit {
  @HostBinding( '@routeState' ) animations = true;

  constructor( public route: ActivatedRoute, public houseModel: HouseModelService, public stripeModel: StripeModelService ) {

    // clear old house model stuff if user is making a new house
    if ( this.route.snapshot.params[ 'id' ] === 'new' ) {
      this.houseModel.resetHouseModel();
    } else {
      // house is not new - may not be needed...
    }
  }

  ngOnInit() {
  }

  extractURLData( url ) {
    return url.split('_');
  }

}
