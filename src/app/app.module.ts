//Modules
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { AppRoutingModule } from "./app-routing.module";
import { ChartsModule } from "ng2-charts";

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
import { MenuComponent } from "./components/main/menu/menu.component";
import { DiningCourtComponent } from "./components/main/dining-court/dining-court.component";
import { CreateCommentComponent } from "./components/main/create-comment/create-comment.component";
import { FeedbackFormComponent } from "./components/user-auth/feedback-form/feedback-form.component";
import { GraphComponent } from './components/main/graph/graph.component';
import { GraphTwoComponent } from './components/main/graph-two/graph-two.component';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    RecoveryComponent,
    LoginComponent,
    HomeComponent,
    NavbarComponent,
    ManageComponent,
    MenuComponent,
    DiningCourtComponent,
    CreateCommentComponent,
    FeedbackFormComponent,
    GraphComponent,
    GraphTwoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ChartsModule
  ],
  providers: [UserAuthService, DiningService],
  bootstrap: [AppComponent]
})
export class AppModule {}
