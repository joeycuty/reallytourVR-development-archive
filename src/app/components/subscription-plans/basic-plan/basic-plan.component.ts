import {Component, OnInit} from '@angular/core';
import {DatabaseService} from '../../../services/database.service';
import {StripeModelService} from "../../../models/stripe-model.service";
import {cardSlideTrigger, enterMessageTrigger} from "../../../animations/animations";

@Component({
  selector: 'app-basic-plan',
  templateUrl: './basic-plan.component.html',
  styleUrls: ['./basic-plan.component.css'],
  animations: [enterMessageTrigger, cardSlideTrigger]
})
export class BasicPlanComponent implements OnInit {

  public basicPerks = [
    '15 Homes with ReallyTour',
    'Standard Queuing',
    'Flyer & TinyURL Generation'];

  constructor(public database: DatabaseService, public stripeModel: StripeModelService) {
  }

  ngOnInit() {
  }

}
