import {AfterViewChecked, Component, OnInit} from '@angular/core';
import {StripeModelService} from '../../../models/stripe-model.service';
import {enterMessageTrigger} from "../../../animations/animations";

declare const Card: any;
declare const Materialize: any;

@Component({
  selector: 'app-seller-card',
  templateUrl: './seller-card.component.html',
  styleUrls: ['./seller-card.component.css'],
  animations: [enterMessageTrigger]
})
export class SellerCardComponent implements OnInit, AfterViewChecked {


  constructor(public stripeModel: StripeModelService) {
  }

  ngOnInit() {
    // this.stripeModel.resetPaymentDetails();
    const card = new Card({
      form: '#myform',
      container: '.card-wrapper',

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
