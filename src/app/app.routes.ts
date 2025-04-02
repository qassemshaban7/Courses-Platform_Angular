import { Routes } from '@angular/router';
import { RegisterComponent } from './components/shared/register/register.component';
import { LoginComponent } from './components/shared/login/login.component';
import { HomeComponent } from './components/shared/home/home.component';
import { NotfoundComponent } from './components/shared/notfound/notfound.component';
import { AuthGuard } from './guards/auth.guard';
import { CourseDetailsComponent } from './components/shared/course-details/course-details.component';
import { SendPinComponent } from './components/shared/send-pin/send-pin.component';
import { EnterPinComponent } from './components/shared/enter-pin/enter-pin.component';
import { ForgetPasswordComponent } from './components/shared/forget-password/forget-password.component';
import { FavouriteComponent } from './components/shared/favourite/favourite.component';
//import { SettingModule } from './setting/setting.module';

export const routes: Routes = [
  //?eager loading for components
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  {path:'register', component:RegisterComponent, title:'Register Page'},
  {path:'login', component:LoginComponent, title:'Login Page'},
  {path:'sendpin', component:SendPinComponent, title:'Send Pin Page'},
  {path:'enterpin/:email/:expireAt', component:EnterPinComponent, title:'Enter Pin Page'},
  {path:'forgetpassword/:email', component:ForgetPasswordComponent, title:'Forget Password Page'},
  {path:'home', canActivate:[AuthGuard],component:HomeComponent, title:'Home Page'},
  {path:'coursedeatils/:id/:fav/:vote', canActivate:[AuthGuard], component:CourseDetailsComponent, title:'Course Details Page'},

  {path:'favourite', canActivate:[AuthGuard],component:FavouriteComponent, title:'Favourite Page'},

  //&dynamic import lazy loading for setting module
  //& used for large application to reduce the initial load time
  {path:'admin', canActivate:[AuthGuard],loadChildren: ()=> import('./components/admin/admin.module').then((x)=> x.AdminModule) , title:'Admin Area'},
  {path:'setting', canActivate:[AuthGuard],loadChildren: ()=> import('./setting/setting.module').then((x)=> x.SettingModule) , title:'Profile Page'},

  //?Eager loading for setting module
  //!{path:'setting', canActivate:[AuthGuard],loadChildren: ()=> SettingModule , title:'Profile Page'},

  {path:'**', canActivate:[AuthGuard],component: NotfoundComponent , title:'NotFound Page'}
];
