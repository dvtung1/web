import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SignupComponent } from "./components/user-auth/signup/signup.component";
import { RecoveryComponent } from "./components/user-auth/recovery/recovery.component";
import { LoginComponent } from "./components/user-auth/login/login.component";
import { HomeComponent } from "./components/main/home/home.component";

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "login", component: LoginComponent },
  { path: "signup", component: SignupComponent },
  { path: "recovery", component: RecoveryComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}