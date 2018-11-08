import { Component, OnInit } from '@angular/core';
import {StripeModelService} from "../../../models/stripe-model.service";
import {enterMessageTrigger} from "../../../animations/animations";

@Component({
  selector: 'app-seller-use-current-card',
  templateUrl: './seller-use-current-card.component.html',
  styleUrls: ['./seller-use-current-card.component.css'],
  animations: [enterMessageTrigger]
})
export class SellerUseCurrentCardComponent implements OnInit {

  constructor(public stripeModel: StripeModelService) { }

  ngOnInit() {
  }

}
