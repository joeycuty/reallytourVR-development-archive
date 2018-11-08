import {Component, OnInit} from '@angular/core';
import {DatabaseService} from '../../../services/database.service';
import {SellerModelService} from '../../../models/seller-model.service';
import {FileService} from '../../../services/file.service';
import {enterMessageSlowTrigger, enterMessageTrigger} from '../../../animations/animations';

@Component({
  selector: 'app-seller-profile',
  templateUrl: './seller-profile.component.html',
  styleUrls: ['./seller-profile.component.css'],
  animations: [enterMessageSlowTrigger, enterMessageTrigger]
})
export class SellerProfileComponent implements OnInit {

  public updatingProfileOptions = false;
  public updatingProfileImage = false;


  constructor(public database: DatabaseService, public sellerModel: SellerModelService, public fileProcessor: FileService) {
  }

  ngOnInit() {
  }

  profilePreview(event) {

    this.sellerModel.previewProfileImage.file = event.srcElement.files[0];

    const reader = new FileReader();
    reader.onload = () => {

      let output;
      output = document.getElementById('profile1');
      output.setAttribute('src', reader.result);
      output = document.getElementById('profile2');
      output.setAttribute('src', reader.result);
      output = document.getElementById('profile3');
      output.setAttribute('src', reader.result);

      // add image size reduction later...
      // this.globals.profileFile = this.dataURItoBlob(this.downscaleImage(reader.result, 50, 'image/jpeg', 0.5));

    };

    reader.readAsDataURL(event.target.files[0]);

    this.sellerModel.updatingProfileOptions = true;

  }

  cancelUpload() {
    this.sellerModel.previewProfileImage = null;
    let output;
    output = document.getElementById('profile1');
    output.setAttribute('src', this.database.sellerData['photoURL']);
    output = document.getElementById('profile2');
    output.setAttribute('src', this.database.sellerData['photoURL']);
    output = document.getElementById('profile3');
    output.setAttribute('src', this.database.sellerData['photoURL']);
    this.sellerModel.updatingProfileOptions = false;
  }
}
