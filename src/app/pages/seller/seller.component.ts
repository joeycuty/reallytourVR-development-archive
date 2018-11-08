import {AfterViewInit, Component, EventEmitter, HostBinding, OnInit} from '@angular/core';
import {AuthoService} from '../../services/autho.service';
import {LoggingService} from '../../services/logging.service';
import {routeStateTrigger} from '../../animations/route-animations';
import {enterMessageTrigger, profileSizeStylingTrigger} from '../../animations/animations';
import {GlobalsService} from '../../services/globals.service';
import {DatabaseService} from '../../services/database.service';
import {ActivatedRoute, Router} from '@angular/router';
import {SellerModelService} from '../../models/seller-model.service';
import {FileService} from "../../services/file.service";
import {StripeModelService} from "../../models/stripe-model.service";

const page = 'seller';

@Component({
  selector: 'app-seller',
  templateUrl: './seller.component.html',
  styleUrls: ['./seller.component.css'],
  animations: [routeStateTrigger, enterMessageTrigger, profileSizeStylingTrigger]
})

export class SellerComponent implements AfterViewInit {
  @HostBinding('@routeState') animations = true;

  modalActions = new EventEmitter<any>();
  vrModal = new EventEmitter<any>();
  public resendMessage = '';

  params = [];

  constructor(public autho: AuthoService, public log: LoggingService, public globals: GlobalsService,
              public database: DatabaseService, public route: ActivatedRoute, public sellerModel: SellerModelService,
              public fileProcessor: FileService, public stripeModel: StripeModelService) {

    this.sellerModel.sellerId = this.route.snapshot.params['id'];

    this.sellerModel.openModal_verifyEmail.subscribe((openModal) => {
      if (openModal) {
        this.openModal();
      } else {
        this.closeModal();
      }
    });

  }

  ngAfterViewInit() {
    this.sellerModel.asyncAuthoStatus();
  }


  openModal() {
    setTimeout(() => {
        this.modalActions.emit({action: 'modal', params: ['open']});
      },
      3000
    )
    ;

  }

  closeModal() {

    this.modalActions.emit({action: 'modal', params: ['close']});
  }


  resendEmail() {
    this.autho.user.sendEmailVerification()
      .then(() => {
        // notify that email is sent.
        this.log.note(page, 'email sent');
        this.resendMessage = 'A new verification email has been sent.';
        this.clearMessage();

      })
      .catch((error) => {
        // update failed..
        this.log.failure(page, error);
        this.resendMessage = 'ERROR: Please contact customer service.';
        this.clearMessage();
      });
  }

  clearMessage() {
    setTimeout(() => {
      this.resendMessage = '';
    }, 5000);
  }
}
