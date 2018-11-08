

//////// generic application modules for various under the hood functions ////
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';


///////////////////////////////// ROOT COMPONENTS ////////////////////////////
// root component
import {AppComponent} from './app.component';
// routing component holds list of urls
import {routing} from './app.routes';


///////////////////////////////// CSS COMPONENTS ////////////////////////////
// materializeCSS for styling
import {MaterializeModule} from 'angular2-materialize';
import {Routes, RouterModule} from '@angular/router';


//////////////////////////////// PAGES & PAGE COMPONENTS //////////////////////////////////////
// main welcome page
import {WelcomeComponent} from './pages/welcome/welcome.component';

// GENERIC MULTIUSE COMPONENTS
// side menu component
import {SideNavComponent} from './components/side-nav/side-nav.component';
// footer component
import {FooterComponent} from './components/footer/footer.component';
// plan feature components
import { FreePlanComponent } from './components/subscription-plans/free-plan/free-plan.component';
import { BasicPlanComponent } from './components/subscription-plans/basic-plan/basic-plan.component';
import { PremiumPlanComponent } from './components/subscription-plans/premium-plan/premium-plan.component';
import { ExecutivePlanComponent } from './components/subscription-plans/executive-plan/executive-plan.component';

// sign in page
import {SignInComponent} from './pages/sign-in/sign-in.component';
// house view page
import { HouseComponent } from './pages/house/house.component';
// edit house page
import { EditHouseComponent } from './pages/edit-house/edit-house.component';
// EDIT HOUSE COMPONENTS
import { EditHouseWelcomeComponent } from './components/edit-house-page/edit-house-welcome/edit-house-welcome.component';
import { EditHouseTextComponent } from './components/edit-house-page/edit-house-text/edit-house-text.component';
import { EditHouseAddressComponent } from './components/edit-house-page/edit-house-address/edit-house-address.component';
import { EditHouseAddressHeaderComponent } from './components/edit-house-page/edit-house-address-header/edit-house-address-header.component';
import { EditHouseUploadPanosComponent } from './components/edit-house-page/edit-house-upload-panos/edit-house-upload-panos.component';
import { EditHouseUploadStaticsComponent } from './components/edit-house-page/edit-house-upload-statics/edit-house-upload-statics.component';
import { EditHouseReviewPanosComponent } from './components/edit-house-page/edit-house-review-panos/edit-house-review-panos.component';
import { EditHousePublishComponent } from './components/edit-house-page/edit-house-publish/edit-house-publish.component';
// POSSIBLE UPGRADE - rename component to same format as others above.
import { ImageFormComponent } from './components/edit-house-page/image-form/image-form.component';

// seller page?
import {SellerComponent} from './pages/seller/seller.component';
// SELLER COMPONENTS
import {SellerSetupComponent} from './components/seller-page/seller-setup/seller-setup.component';
import {SellerSettingsComponent} from './components/seller-page/seller-settings/seller-settings.component';
import {SellerHousesComponent} from './components/seller-page/seller-houses/seller-houses.component';
import {SellerProfileComponent} from './components/seller-page/seller-profile/seller-profile.component';
import {SellerSubscriptionComponent} from './components/seller-page/seller-subscription/seller-subscription.component';
import {SellerPaymentsComponent} from './components/seller-page/seller-payments/seller-payments.component';
import {SellerActiveComponent} from './components/seller-page/seller-active/seller-active.component';
import {SellerProfileTextComponent} from './components/seller-page/seller-profile-text/seller-profile-text.component';
// not sure what these do... POSSIBLE UPGRADE - RENAME THESE COMPONENTS TO REMOVE AMBIGUITY..
import { SellerCardComponent } from './components/seller-page/seller-card/seller-card.component';
import { SellerUseCurrentCardComponent } from './components/seller-page/seller-use-current-card/seller-use-current-card.component';
import { SellerUseFreePlanComponent } from './components/seller-use-free-plan/seller-use-free-plan.component';
import { SellerUpdateCardComponent } from './components/seller-page/seller-update-card/seller-update-card.component';
// payment confirmation modal? not sure if modal
import { PaymentConfirmationComponent } from './components/seller-page/payment-confirmation/payment-confirmation.component';


/////////////////////////////// PIPES ////////////////////////////////////////
// convert seconds to readable date
import { DateSecondsToReadablePipe } from './pipes/date-seconds-to-readable.pipe';


/////////////////////////////// SERVICES ////////////////////////////////////
// globals service - POSSIBLE UPGRADE - REMOVE AND IMPLIMENT INTO MODEL SERVICES?
import {GlobalsService} from './services/globals.service';
// database for firebase service
import {DatabaseService} from './services/database.service';
// autho for firebase service
import {AuthoService} from './services/autho.service';
// login service handles login stuff for sign in page - POSSIBLE UPGRADE - RENAME ALL LOGIN/SIGNIN STUFF TO ONE NAME
// SCHEME.. - OR - CONSOLIDATE INTO ONE SERVICE (AUTHO?)
import {LoggingService} from './services/logging.service';
// communicates with node servers
import {BackendService} from './services/backend.service';
// file service handles picture uploads and reformating. POSSIBLE UPGRADE - some file manipulations can be polished.
import {FileService} from './services/file.service';
// map for search - POSSIBLE UPGRADE - REMOVE - NO LONGER SUPPORTING SEARCH FEATURES..
import { MapsService } from './services/maps.service';
import { AgmCoreModule } from 'angular2-google-maps/core';


/////////////////////////////// MODELS ////////////////////////////////////////
// POSSIBLE UPGRADE - MODELS SHOULD NOT CONTAIN LOGIC! ~BUT THEY CURRENTLY DO - FIX!!!
import {SellerModelService} from './models/seller-model.service';
import {StripeModelService} from './models/stripe-model.service';
import {HouseModelService} from './models/house-model.service';



////////////////////////////////////////////////////////////////////////////////
@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    SideNavComponent,
    FooterComponent,
    SignInComponent,
    SellerComponent,
    SellerSetupComponent,
    SellerSettingsComponent,
    SellerHousesComponent,
    SellerProfileComponent,
    SellerSubscriptionComponent,
    SellerPaymentsComponent,
    SellerActiveComponent,
    SellerProfileTextComponent,
    FreePlanComponent,
    BasicPlanComponent,
    PremiumPlanComponent,
    ExecutivePlanComponent,
    SellerCardComponent,
    SellerUseCurrentCardComponent,
    SellerUseFreePlanComponent,
    PaymentConfirmationComponent,
    DateSecondsToReadablePipe,
    SellerUpdateCardComponent,
    HouseComponent,
    EditHouseComponent,
    EditHouseWelcomeComponent,
    EditHouseTextComponent,
    EditHouseAddressComponent,
    EditHouseAddressHeaderComponent,
    EditHouseUploadPanosComponent,
    EditHouseUploadStaticsComponent,
    EditHouseReviewPanosComponent,
    EditHousePublishComponent,
    ImageFormComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterializeModule,
    BrowserAnimationsModule,
    routing,
    AgmCoreModule.forRoot({
      apiKey: 'PRIVATEKEYREMOVED'
    })
  ],
  providers: [GlobalsService, AuthoService, DatabaseService, LoggingService, BackendService,
    SellerModelService, StripeModelService, HouseModelService, FileService, MapsService],
  bootstrap: [AppComponent]
})
export class AppModule {

}
