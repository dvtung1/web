import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignupComponent } from './components/signup/signup.component';
import { RecoveryComponent } from './components/recovery/recovery.component';

const routes: Routes = [
  {path: 'signup', component: SignupComponent},
  {path: 'recovery', component: RecoveryComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
