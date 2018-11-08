import { Component, OnInit } from '@angular/core';
import {StripeModelService} from '../../../models/stripe-model.service';
import {enterMessageSlowTrigger, enterMessageTrigger} from '../../../animations/animations';

@Component({
  selector: 'app-payment-confirmation',
  templateUrl: './payment-confirmation.component.html',
  styleUrls: ['./payment-confirmation.component.css'],
  animations: [enterMessageSlowTrigger, enterMessageTrigger]
})
export class PaymentConfirmationComponent implements OnInit {

  constructor(public stripeModel: StripeModelService) { }

  ngOnInit() {
  }

}
