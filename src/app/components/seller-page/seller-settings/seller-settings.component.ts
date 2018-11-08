import {Component, OnInit} from '@angular/core';
import {DatabaseService} from '../../../services/database.service';
import { enterMessageTrigger, slideNFadeTrigger } from '../../../animations/animations';
import {SellerModelService} from "../../../models/seller-model.service";
import {StripeModelService} from "../../../models/stripe-model.service";
import {routeStateTrigger} from "../../../animations/route-animations";

@Component({
  selector: 'app-seller-settings',
  templateUrl: './seller-settings.component.html',
  styleUrls: ['./seller-settings.component.css'],
  animations: [slideNFadeTrigger, routeStateTrigger, enterMessageTrigger]
})
export class SellerSettingsComponent implements OnInit {


  constructor(public database: DatabaseService, public sellerModel: SellerModelService, public stripeModel: StripeModelService) {
  }


  ngOnInit() {
  }

}
