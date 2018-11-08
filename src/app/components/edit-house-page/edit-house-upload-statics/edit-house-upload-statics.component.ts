import { Component, OnInit } from '@angular/core';
import { FileService } from '../../../services/file.service';
import { HouseModelService } from '../../../models/house-model.service';

@Component( {
  selector: 'app-edit-house-upload-statics',
  templateUrl: './edit-house-upload-statics.component.html',
  styleUrls: [ './edit-house-upload-statics.component.css' ]
} )
export class EditHouseUploadStaticsComponent implements OnInit {

  constructor( public fileProcessor: FileService, public houseModel: HouseModelService ) {
  }

  ngOnInit() {
  }

}
