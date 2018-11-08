
import {RouterModule, Routes} from '@angular/router';
import {SellerComponent} from './pages/seller/seller.component';
import {SignInComponent} from './pages/sign-in/sign-in.component';
import {WelcomeComponent} from './pages/welcome/welcome.component';
import { EditHouseComponent } from './pages/edit-house/edit-house.component';

const APP_ROUTES: Routes = [
  {path: '', component: WelcomeComponent},
  {path: 'welcome', component: WelcomeComponent},
  {path: 'signin', component: SignInComponent},
  {path: 'seller/:id', component: SellerComponent},
  {path: 'edithouse/:id', component: EditHouseComponent}

];

export const routing = RouterModule.forRoot(APP_ROUTES);
