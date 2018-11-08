import {Component, OnInit} from '@angular/core';
import { enterMessageTrigger, slideNFadeTrigger, slowDisableTrigger } from '../../../animations/animations';
import {SellerModelService} from '../../../models/seller-model.service';
import {StripeModelService} from "../../../models/stripe-model.service";
import {DatabaseService} from "../../../services/database.service";

@Component({
  selector: 'app-seller-setup',
  templateUrl: './seller-setup.component.html',
  styleUrls: ['./seller-setup.component.css'],
  animations: [slideNFadeTrigger, slowDisableTrigger, enterMessageTrigger]
})
export class SellerSetupComponent implements OnInit {


  constructor(public sellerModel: SellerModelService, public stripeModel: StripeModelService, public database: DatabaseService) {
  }

  ngOnInit() {
  }


}
