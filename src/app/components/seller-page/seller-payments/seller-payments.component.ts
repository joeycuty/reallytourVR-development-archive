import {AfterViewInit, Component} from '@angular/core';
import {StripeModelService} from '../../../models/stripe-model.service';
import {routeStateTrigger} from '../../../animations/route-animations';

@Component({
  selector: 'app-seller-payments',
  templateUrl: './seller-payments.component.html',
  styleUrls: ['./seller-payments.component.css'],
  animations: [routeStateTrigger]
})
export class SellerPaymentsComponent implements AfterViewInit {

  constructor(public stripeModel: StripeModelService) {
  }

  ngAfterViewInit() {
  }


}
