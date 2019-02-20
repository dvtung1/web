import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SignupComponent } from "./components/user-auth/signup/signup.component";
import { RecoveryComponent } from "./components/user-auth/recovery/recovery.component";
import { LoginComponent } from "./components/user-auth/login/login.component";
import { HomeComponent } from "./components/main/home/home.component";
import { ManageComponent } from './components/user-auth/manage/manage.component';
import { WindsorComponent } from './components/main/diningc/windsor/windsor.component';
import { AirhartComponent } from './components/main/diningc/airhart/airhart.component';
import { FordComponent } from './components/main/diningc/ford/ford.component';
import { HillenbrandComponent } from './components/main/diningc/hillenbrand/hillenbrand.component';
import { WileyComponent } from './components/main/diningc/wiley/wiley.component';

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "login", component: LoginComponent },
  { path: "signup", component: SignupComponent },
  { path: "recovery", component: RecoveryComponent },
  { path: "home", component: HomeComponent },
  { path: "manage", component: ManageComponent },
  { path: "windsor", component: WindsorComponent},
  { path: "airhart", component: AirhartComponent},
  { path: "ford", component: FordComponent},
  { path: "hillenbrand", component: HillenbrandComponent},
  { path: "wiley", component: WileyComponent}
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}