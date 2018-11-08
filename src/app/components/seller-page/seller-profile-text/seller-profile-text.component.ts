import {AfterViewChecked, Component, OnInit} from '@angular/core';
import {DatabaseService} from '../../../services/database.service';
import {enterMessageTrigger} from '../../../animations/animations';
import {SellerModelService} from '../../../models/seller-model.service';
import {AuthoService} from '../../../services/autho.service';

declare var Materialize: any;

@Component({
  selector: 'app-seller-profile-text',
  templateUrl: './seller-profile-text.component.html',
  styleUrls: ['./seller-profile-text.component.css'],
  animations: [enterMessageTrigger]
})
export class SellerProfileTextComponent implements AfterViewChecked {

  public updatingTimer: any = {};

  constructor(public database: DatabaseService, public sellerModel: SellerModelService, public autho: AuthoService) {
  }

  ngAfterViewChecked() {
    try {
      Materialize.updateTextFields();
    } catch (e) {
      console.log(e);
    }
  }


  updateText(text, loc) {
    const updateloc = loc;
    const updatetext = text;

    this.sellerModel.updatingProfileForm = 'Saving Changes..';

    clearTimeout(this.updatingTimer[loc]);

    this.updatingTimer[loc] =
      setTimeout(
        () => {

          if (this.autho.user != null && updatetext !== undefined) {
            const tempObj = {};
            tempObj[updateloc] = updatetext;

            this.database.writeUserData(this.autho.user.uid, tempObj, true)
              .then((success) => {
                setTimeout(
                  () => {
                    this.sellerModel.updatingProfileForm = 'Changes Saved';
                  }, 250);
              })
              .catch((error) => {
                this.sellerModel.updatingProfileForm = 'Changes Saved';
              });
          } else {
            this.sellerModel.updatingProfileForm = 'Changes Saved';

          }
        }

        , 1000);
  }

}
