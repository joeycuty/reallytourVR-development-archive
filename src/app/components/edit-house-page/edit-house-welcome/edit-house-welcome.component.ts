import { Component, OnInit } from '@angular/core';
import { StripeModelService } from '../../../models/stripe-model.service';
import { GlobalsService } from '../../../services/globals.service';
import { HouseModelService } from '../../../models/house-model.service';
import { SellerModelService } from '../../../models/seller-model.service';

@Component( {
  selector: 'app-edit-house-welcome',
  templateUrl: './edit-house-welcome.component.html',
  styleUrls: [ './edit-house-welcome.component.css' ]
} )
export class EditHouseWelcomeComponent implements OnInit {

  constructor( public stripeModel: StripeModelService, public globals: GlobalsService, public houseModel: HouseModelService,
               public sellerModel: SellerModelService ) {
  }

  ngOnInit() {
  }

}
