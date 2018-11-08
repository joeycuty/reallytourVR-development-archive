import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { StripeModelService } from '../../../models/stripe-model.service';
import { enterMessageTrigger } from '../../../animations/animations';

declare const Materialize: any;
declare const Card: any;

@Component({
  selector: 'app-seller-update-card',
  templateUrl: './seller-update-card.component.html',
  styleUrls: ['./seller-update-card.component.css'],
  animations: [enterMessageTrigger]
})
export class SellerUpdateCardComponent implements OnInit, AfterViewChecked {

  constructor(public stripeModel: StripeModelService) {
  }

  ngOnInit() {
    //this.stripeModel.resetPaymentDetails();
    const updateCard = new Card({
      form: '#update-card-form',
      container: '.update-card-wrapper',

      // Default placeholders for rendered fields - optional
      placeholders: {
        number: '•••• •••• •••• ••••',
        name: 'Full Name',
        expiry: '••/••',
        cvc: '•••'
      },
      width: 300, // optional — default 350px

    });
  }

  ngAfterViewChecked() {
    Materialize.updateTextFields();
  }


}
