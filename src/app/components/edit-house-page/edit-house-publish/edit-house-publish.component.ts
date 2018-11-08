import { Component, OnInit } from '@angular/core';
import { HouseModelService } from '../../../models/house-model.service';

@Component({
  selector: 'app-edit-house-publish',
  templateUrl: './edit-house-publish.component.html',
  styleUrls: ['./edit-house-publish.component.css']
})
export class EditHousePublishComponent implements OnInit {

  constructor(public houseModel: HouseModelService) { }

  ngOnInit() {
  }

}
