import {AfterViewInit, Component } from '@angular/core';
import {StripeModelService} from '../../../models/stripe-model.service';
import {routeStateTrigger} from '../../../animations/route-animations';

@Component({
  selector: 'app-seller-subscription',
  templateUrl: './seller-subscription.component.html',
  styleUrls: ['./seller-subscription.component.css'],
  animations: [routeStateTrigger]
})
export class SellerSubscriptionComponent implements AfterViewInit {

  constructor(public stripeModel: StripeModelService) { }


  ngAfterViewInit() {
  }


}
