import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SignupComponent } from "./components/user-auth/signup/signup.component";
import { RecoveryComponent } from "./components/user-auth/recovery/recovery.component";
import { LoginComponent } from "./components/user-auth/login/login.component";
import { HomeComponent } from "./components/main/home/home.component";
import { ManageComponent } from "./components/user-auth/manage/manage.component";
import { WindsorComponent } from "./components/main/DiningC/windsor/windsor.component";
import { FordComponent } from "./components/main/DiningC/ford/ford.component";
import { HillenbrandComponent } from "./components/main/DiningC/hillenbrand/hillenbrand.component";
import { WileyComponent } from "./components/main/DiningC/wiley/wiley.component";
import { PeteszaComponent } from "./components/main/DiningC/petesza/petesza.component";
import { OnebowlComponent } from "./components/main/DiningC/onebowl/onebowl.component";

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "login", component: LoginComponent },
  { path: "signup", component: SignupComponent },
  { path: "recovery", component: RecoveryComponent },
  { path: "home", component: HomeComponent },
  { path: "manage", component: ManageComponent },
  { path: "windsor", component: WindsorComponent },
  { path: "ford", component: FordComponent },
  { path: "hillenbrand", component: HillenbrandComponent },
  { path: "wiley", component: WileyComponent },
  { path: "onebowl", component: OnebowlComponent },
  { path: "petesza", component: PeteszaComponent }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
