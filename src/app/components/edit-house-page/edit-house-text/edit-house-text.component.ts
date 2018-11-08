import { Component, OnInit } from '@angular/core';
import { enterMessageTrigger } from '../../../animations/animations';
import { HouseModelService } from '../../../models/house-model.service';
import { GlobalsService } from '../../../services/globals.service';

@Component({
  selector: 'app-edit-house-text',
  templateUrl: './edit-house-text.component.html',
  styleUrls: ['./edit-house-text.component.css'],
  animations: [enterMessageTrigger]
})
export class EditHouseTextComponent implements OnInit {

  constructor(public houseModel: HouseModelService, public globals: GlobalsService) { }

  ngOnInit() {
  }

}
