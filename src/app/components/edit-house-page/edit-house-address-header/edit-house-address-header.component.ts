import { Component, OnInit } from '@angular/core';
import { HouseModelService } from '../../../models/house-model.service';

@Component({
  selector: 'app-edit-house-address-header',
  templateUrl: './edit-house-address-header.component.html',
  styleUrls: ['./edit-house-address-header.component.css']
})
export class EditHouseAddressHeaderComponent implements OnInit {

  constructor(public houseModel: HouseModelService) { }

  ngOnInit() {
  }

}
