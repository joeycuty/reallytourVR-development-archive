import {Component, OnInit} from '@angular/core';
import {GlobalsService} from '../../../services/globals.service';
import {SellerModelService} from '../../../models/seller-model.service';
import {DatabaseService} from '../../../services/database.service';

@Component({
  selector: 'app-seller-active',
  templateUrl: './seller-active.component.html',
  styleUrls: ['./seller-active.component.css']
})
export class SellerActiveComponent implements OnInit {

  constructor(public globals: GlobalsService, public sellerModel: SellerModelService, public database: DatabaseService) {
  }

  ngOnInit() {
  }


}
