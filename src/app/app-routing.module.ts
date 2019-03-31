import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SignupComponent } from "./components/user-auth/signup/signup.component";
import { RecoveryComponent } from "./components/user-auth/recovery/recovery.component";
import { LoginComponent } from "./components/user-auth/login/login.component";
import { HomeComponent } from "./components/main/home/home.component";
import { ManageComponent } from "./components/user-auth/manage/manage.component";
import { DiningCourtComponent } from "./components/main/dining-court/dining-court.component";
import { CreateCommentComponent } from "./components/main/create-comment/create-comment.component";
import { FeedbackFormComponent } from "./components/user-auth/feedback-form/feedback-form.component";

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "login", component: LoginComponent },
  { path: "signup", component: SignupComponent },
  { path: "recovery", component: RecoveryComponent },
  { path: "manage", component: ManageComponent },
  { path: "dining/:diningName", component: DiningCourtComponent },
  { path: "dining/:diningName/create/:id", component: CreateCommentComponent },
  { path: "dining/:diningName/create", component: CreateCommentComponent },
  { path: "feedbackform", component: FeedbackFormComponent}
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
