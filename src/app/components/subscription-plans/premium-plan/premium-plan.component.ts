import {Component, OnInit} from '@angular/core';
import {DatabaseService} from '../../../services/database.service';
import {StripeModelService} from '../../../models/stripe-model.service';
import {cardSlideTrigger, enterMessageTrigger} from '../../../animations/animations';

@Component({
  selector: 'app-premium-plan',
  templateUrl: './premium-plan.component.html',
  styleUrls: ['./premium-plan.component.css'],
  animations: [cardSlideTrigger, enterMessageTrigger]
})
export class PremiumPlanComponent implements OnInit {

  public basicPerks = [
    '30 Homes with ReallyTour',
    'Premium Queuing',
    'Flyer & TinyURL Generation',
    'Free Virtual-Reality headset'
  ];

  constructor(public database: DatabaseService, public stripeModel: StripeModelService) {
  }

  ngOnInit() {
  }
}
