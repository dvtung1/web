//Modules
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { AppRoutingModule } from "./app-routing.module";

//Services
import { UserAuthService } from "./services/user-auth.service";

//Components
import { AppComponent } from "./app.component";
import { SignupComponent } from "./components/user-auth/signup/signup.component";
import { RecoveryComponent } from "./components/user-auth/recovery/recovery.component";
import { LoginComponent } from "./components/user-auth/login/login.component";
import { HomeComponent } from "./components/main/home/home.component";

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
