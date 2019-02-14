//Modules
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { AppRoutingModule } from "./app-routing.module";

//Components
import { AppComponent } from "./app.component";
import { SignupComponent } from "./components/signup/signup.component";
import { RecoveryComponent } from "./components/recovery/recovery.component";

//Services
import { UserAuthService } from "./services/user-auth.service";
import { LoginComponent } from "./components/login/login.component";
import { HomeComponent } from './components/home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    RecoveryComponent,
    LoginComponent,
    HomeComponent
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, FormsModule],
  providers: [UserAuthService],
  bootstrap: [AppComponent]
})
export class AppModule {}
