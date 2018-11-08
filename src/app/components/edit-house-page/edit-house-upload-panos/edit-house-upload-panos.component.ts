import { Component, OnInit } from '@angular/core';
import { FileService } from '../../../services/file.service';
import { HouseModelService } from '../../../models/house-model.service';

@Component({
  selector: 'app-edit-house-upload-panos',
  templateUrl: './edit-house-upload-panos.component.html',
  styleUrls: ['./edit-house-upload-panos.component.css']
})
export class EditHouseUploadPanosComponent implements OnInit {

  constructor(public fileProcessor: FileService, public houseModel: HouseModelService) { }

  ngOnInit() {
  }

}
