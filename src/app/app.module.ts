//Modules
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { AppRoutingModule } from "./app-routing.module";

//Services
import { UserAuthService } from "./services/user-auth.service";
import { DiningService } from "./services/dining.service";

//Components
import { AppComponent } from "./app.component";
import { SignupComponent } from "./components/user-auth/signup/signup.component";
import { RecoveryComponent } from "./components/user-auth/recovery/recovery.component";
import { LoginComponent } from "./components/user-auth/login/login.component";
import { HomeComponent } from "./components/main/home/home.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { ManageComponent } from "./components/user-auth/manage/manage.component";
import { WindsorComponent } from "./components/main/DiningC/windsor/windsor.component";
import { WileyComponent } from "./components/main/DiningC/wiley/wiley.component";
import { HillenbrandComponent } from "./components/main/DiningC/hillenbrand/hillenbrand.component";
import { FordComponent } from "./components/main/DiningC/ford/ford.component";
import { CommonComponent } from "./components/main/DiningC/common/common.component";
import { AirhartComponent } from "./components/main/DiningC/airhart/airhart.component";
import { PeteszaComponent } from "./components/main/DiningC/petesza/petesza.component";
import { OnebowlComponent } from "./components/main/DiningC/onebowl/onebowl.component";
import { EarhartComponent } from './components/main/diningc/earhart/earhart.component';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    RecoveryComponent,
    LoginComponent,
    HomeComponent,
    NavbarComponent,
    ManageComponent,
    WindsorComponent,
    WileyComponent,
    HillenbrandComponent,
    FordComponent,
    CommonComponent,
    AirhartComponent,
    PeteszaComponent,
    OnebowlComponent,
    EarhartComponent
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, FormsModule],
  providers: [UserAuthService, DiningService],
  bootstrap: [AppComponent]
})
export class AppModule {}
