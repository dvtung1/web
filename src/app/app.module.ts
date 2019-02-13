import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { SignupComponent } from "./components/signup/signup.component";
import { RecoveryComponent } from "./components/recovery/recovery.component";
import { UserAuthService } from "./services/user-auth.service";

@NgModule({
  declarations: [AppComponent, SignupComponent, RecoveryComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [UserAuthService],
  bootstrap: [AppComponent]
})
export class AppModule {}
