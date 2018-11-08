import {Component, OnInit} from '@angular/core';
import {StripeModelService} from '../../../models/stripe-model.service';
import {cardSlideTrigger, enterMessageTrigger} from '../../../animations/animations';

@Component({
  selector: 'app-free-plan',
  templateUrl: './free-plan.component.html',
  styleUrls: ['./free-plan.component.css'],
  animations: [enterMessageTrigger, cardSlideTrigger]
})
export class FreePlanComponent implements OnInit {

  public basicPerks = [
    '2 Homes with ReallyTour',
    'Standard Queuing',
    'Flyer & TinyURL Generation'
  ]

  constructor( public stripeModel: StripeModelService) {
  }

  ngOnInit() {
  }

}
