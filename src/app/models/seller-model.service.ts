import {EventEmitter, Injectable} from '@angular/core';
import {GlobalsService} from '../services/globals.service';
import {DatabaseService} from '../services/database.service';
import {LoggingService} from '../services/logging.service';
import {AuthoService} from '../services/autho.service';
import {StripeModelService} from "./stripe-model.service";
import { ProfileImage } from './classes/profileImage.class';

const page = 'seller-model';

@Injectable()
export class SellerModelService {
  get houses(): Array<any> {
    return this._houses;
  }

  set houses( value: Array<any> ) {
    this._houses = value;
  }

  public openModal_verifyEmail = new EventEmitter<boolean>();

  // profile page
  // track user state active small screen animations.
  public _moveParallax = 'hidden-parallax';
  public _moveContainer = 'hidden-container';

  public _sellerId = '';
  public _sellerState = '';
  public _sellerHouseLength = 9999;
  public _sellerHouseData = {};
  public _sellerData = {};
  public _houses = [];
  public _userIsOwner = false;
  public _updatingProfileOptions = false;
  public _updatingProfileImage = false;

  public _previewProfileImage: ProfileImage = new ProfileImage;

  public _asyncObj = {
    sellerDataExists: false,
    sellerHouseDataExists: false,
    userSignedIn: false
  };

  // settings vars
  public _settingsState = 0;
  public _proratedPrice = 0;
  public _settingsStates = ['hidden', 'hidden', 'hidden', 'hidden'];

  // setup vars
  public _setupState = 0;
  public _setupProgress = 1;
  public _setupProgressString = '1%';
  public _setupStates = ['fadeIn', 'hidden', 'hidden', 'hidden', 'hidden'];
  public _userNotSubscribed = false;

  // profile text vars
  public _updatingProfileForm = 'Changes Saved!';
  public _profileFormMessage = '';

  constructor(public globals: GlobalsService, public database: DatabaseService, public log: LoggingService,
              public autho: AuthoService) {
  }

  // balance async sign in obj
  asyncAuthoStatus() {
    // check if user exists
    if (this.autho.user !== null) {
      // if user exists check if they have verified their email, if not - lock page for them.
      if (!this.autho.user.emailVerified && this.autho.userProvider !== 'facebook.com'
        && ( this._sellerId === this.autho.userId || this._sellerId === 'me')) {

        this.openModal_verifyEmail.emit(true);
        console.log("OPEN MODALLLLL");
        this.setSellerState('verifyEmail');
       // this.database.getSellerData(this.globals.cleanInput(this.autho.userId));
        this._userIsOwner = true;

        // user exists and owns page, has verified email.
      } else if (this._sellerId === this.autho.userId || this._sellerId === 'me') {

        this.database.getSellerData(this.globals.cleanInput(this.autho.userId));
        this._userIsOwner = true;

      } else {
        // user is logged in but does not own page, get data for user to view seller page.
        this.database.getSellerData(this.globals.cleanInput(this._sellerId));

      }
    } else {
      // user is not logged in but can still view page.
      this.database.getSellerData(this.globals.cleanInput(this._sellerId));

    }
  }

  // balance async seller data
  balanceAsyncObj() {
    if (this.globals.objLen(this.database.sellerData) > 0) {
      this.log.note(page, 'triggered.');
      this.asyncObj.sellerDataExists = true;
      if (this.database.sellerData['newUser'] === 1 && this.sellerState !== 'setup') {
        console.log("what the heck");
        console.log(this.sellerState);
        this.setSellerState('setup');
      } else if (this.database.sellerData['newUser'] === 10 && this.sellerState !== 'settings') {
        console.log("active in model");
        this.setSellerState('active');


      }
    } else {
      console.log(this.database.sellerData);
    }
    if (this.globals.objLen(this._sellerHouseData) > 0) {
      this._asyncObj.sellerHouseDataExists = true;
    }

  }

  // main state machine
  setSellerState(state) {
    this._sellerState = state;
    this.globals.onResize();

      if (state !== 'active' && ( this.globals.screenSize === 'small' || this.globals.screenSize === 'medium')) {
        console.log("hide parallax");
        this._moveContainer = 'hidden-container';
        this._moveParallax = 'hidden-parallax';
      } else {
        console.log("show parallax");
        this._moveParallax = 'visible-parallax';
        this._moveContainer = 'visible-container';
      }
      this.globals.globalChangeDetectorRef.emit(true);

  }

  // settings page state machine
  setSettingsState(state) {
    this._settingsState = state;
    let found = false;
    for (let i = 0; i < this._settingsStates.length; i++) {
      if (i !== this._settingsState && !found) {
        this._settingsStates[i] = 'fadeOut';
      } else if (i !== this._settingsState && found) {
        this._settingsStates[i] = 'hidden';
      } else {
        this._settingsStates[i] = 'fadeIn';
        found = true;
      }
    }
  }

  setSetupProgress(num) {
    this._setupProgress = this._setupProgress + num;
    this._setupProgressString = this._setupProgress + '%';
  }

  setupNext() {
    this.setSetupProgress(33);
    this.setSetupState(this._setupState + 1);
  }

  setupPrev() {
    this.setSetupProgress(-33);
    this.setSetupState(this._setupState - 1);
  }

  setSetupState(state) {

    if (state < 0) {
      this._setupState = 0;
    } else {
      this._setupState = state;
    }

    if (this.setupState === 4) {
      setTimeout(() => {
        this.database.writeUserData(this.autho.userId, {newUser: 10}, true);
      }, 3000);
    }

    let found = false;
    for (let i = 0; i < this._setupStates.length; i++) {
      if (i !== this._setupState && !found) {
        this._setupStates[i] = 'fadeOut';
      } else if (i !== this._setupState && found) {
        this._setupStates[i] = 'hidden';
      } else {
        this._setupStates[i] = 'fadeIn';
        found = true;
      }
    }
    this.globals.globalChangeDetectorRef.emit(true);
  }


  get moveParallax(): string {
    return this._moveParallax;
  }

  set moveParallax(value: string) {
    this._moveParallax = value;
  }

  get moveContainer(): string {
    return this._moveContainer;
  }

  set moveContainer(value: string) {
    this._moveContainer = value;
  }

  get sellerId(): string {
    return this._sellerId;
  }

  set sellerId(value: string) {
    this._sellerId = value;
  }

  get sellerState(): string {
    return this._sellerState;
  }

  set sellerState(value: string) {
    this._sellerState = value;
    this.globals.globalChangeDetectorRef.emit(true);
  }

  get sellerHouseLength(): number {
    return this._sellerHouseLength;
  }

  set sellerHouseLength(value: number) {
    this._sellerHouseLength = value;
  }

  get sellerHouseData(): {} {
    return this._sellerHouseData;
  }

  set sellerHouseData(value: {}) {
    this._sellerHouseData = value;
  }

  get sellerData(): {} {
    return this._sellerData;
  }

  set sellerData(value: {}) {
    this._sellerData = value;
  }

  get userIsOwner(): boolean {
    return this._userIsOwner;
  }

  set userIsOwner(value: boolean) {
    this._userIsOwner = value;
  }

  get updatingProfileOptions(): boolean {
    return this._updatingProfileOptions;
  }

  set updatingProfileOptions(value: boolean) {
    this._updatingProfileOptions = value;
  }

  get updatingProfileImage(): boolean {
    return this._updatingProfileImage;
  }

  set updatingProfileImage(value: boolean) {
    this._updatingProfileImage = value;
  }

  get previewProfileImage(): any {
    return this._previewProfileImage;
  }

  set previewProfileImage(value: any) {
    this._previewProfileImage = value;
  }

  get asyncObj(): { sellerDataExists: boolean; sellerHouseDataExists: boolean; userSignedIn: boolean } {
    return this._asyncObj;
  }

  set asyncObj(value: { sellerDataExists: boolean; sellerHouseDataExists: boolean; userSignedIn: boolean }) {
    this._asyncObj = value;
  }

  get settingsState(): number {
    return this._settingsState;
  }

  set settingsState(value: number) {
    this._settingsState = value;
  }

  get proratedPrice(): number {
    return this._proratedPrice;
  }

  set proratedPrice(value: number) {
    this._proratedPrice = value;
  }

  get settingsStates(): string[] {
    return this._settingsStates;
  }

  set settingsStates(value: string[]) {
    this._settingsStates = value;
  }

  get setupState(): number {
    return this._setupState;
  }

  set setupState(value: number) {
    this._setupState = value;
  }

  get setupProgress(): number {
    return this._setupProgress;
  }

  set setupProgress(value: number) {
    this._setupProgress = value;
  }

  get setupProgressString(): string {
    return this._setupProgressString;
  }

  set setupProgressString(value: string) {
    this._setupProgressString = value;
  }

  get setupStates(): (string | string)[] {
    return this._setupStates;
  }

  set setupStates(value: (string | string)[]) {
    this._setupStates = value;
  }

  get userNotSubscribed(): boolean {
    return this._userNotSubscribed;
  }

  set userNotSubscribed(value: boolean) {
    this._userNotSubscribed = value;
  }

  get updatingProfileForm(): string {
    return this._updatingProfileForm;
  }

  set updatingProfileForm(value: string) {
    this._updatingProfileForm = value;
  }

  get profileFormMessage(): string {
    return this._profileFormMessage;
  }

  set profileFormMessage(value: string) {
    this._profileFormMessage = value;
  }
}
