import {Component, OnInit} from '@angular/core';
import {DatabaseService} from '../../../services/database.service';
import {StripeModelService} from "../../../models/stripe-model.service";
import {cardSlideTrigger, enterMessageTrigger} from "../../../animations/animations";

@Component({
  selector: 'app-executive-plan',
  templateUrl: './executive-plan.component.html',
  styleUrls: ['./executive-plan.component.css'],
  animations: [enterMessageTrigger, cardSlideTrigger]
})
export class ExecutivePlanComponent implements OnInit {

  public basicPerks = [
    '50 Homes with ReallyTour',
    'Premium Queuing',
    'Flyer & TinyURL Generation',
    'Free Virtual-Reality headset'
  ];

  constructor(public database: DatabaseService, public stripeModel: StripeModelService) {
  }

  ngOnInit() {
  }

}
