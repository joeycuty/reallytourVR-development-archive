import { Component, OnInit } from '@angular/core';
import {StripeModelService} from '../../models/stripe-model.service';
import {enterMessageTrigger} from '../../animations/animations';

@Component({
  selector: 'app-seller-use-free-plan',
  templateUrl: './seller-use-free-plan.component.html',
  styleUrls: ['./seller-use-free-plan.component.css'],
  animations: [enterMessageTrigger]
})
export class SellerUseFreePlanComponent implements OnInit {

  constructor(public stripeModel: StripeModelService) { }

  ngOnInit() {
  }

}
