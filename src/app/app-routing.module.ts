import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';
import { ReAuthGuard } from './guard/re-auth.guard';

const routes: Routes = [

  { path: 'cover', loadChildren: './pages/home/home.module#HomePageModule', canActivate: [AuthGuard] },
  { path: 'chat-room', loadChildren: './chat-room/chat-room.module#ChatRoomPageModule', canActivate: [AuthGuard] },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule', canActivate: [ReAuthGuard]},
  { path: 'register', loadChildren: './register/register.module#RegisterPageModule', canActivate: [ReAuthGuard]},
  { path: 'modal-newchat', loadChildren: './modal-newchat/modal-newchat.module#ModalNewchatPageModule', canActivate: [ReAuthGuard] },
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then( m => m.TabsPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'profil',
    loadChildren: () => import('./profil/profil.module').then( m => m.ProfilPageModule)
  },
  {
    path: 'setting',
    loadChildren: () => import('./setting/setting.module').then( m => m.SettingPageModule)
  },
  {
    path: 'setting',
    loadChildren: () => import('./setting/setting.module').then( m => m.SettingPageModule)
  },
  { path: 'splash1', loadChildren: './splash1/splash1.module#Splash1PageModule' },
  { path: 'preases', loadChildren: './preases/preases.module#PreasesPageModule' , canActivate: [AuthGuard]},
  { path: 'reset-password', loadChildren: './reset-password/reset-password.module#ResetPasswordPageModule' },
  { path: 'about', loadChildren: './about/about.module#AboutPageModule' },
  { path: 'splash2', loadChildren: './splash2/splash2.module#Splash2PageModule' },
  { path: 'splash3', loadChildren: './splash3/splash3.module#Splash3PageModule' },
  { path: 'admin', loadChildren: './admin/admin.module#AdminPageModule' },
  { path: 'chat-room2', loadChildren: './chat-room2/chat-room2.module#ChatRoom2PageModule' },
  { path: 'profile', loadChildren: './profile/profile.module#ProfilePageModule' },
  { path: 'imu', loadChildren: './imu/imu.module#ImuPageModule' },
  { path: 'device-info', loadChildren: './device-info/device-info.module#DeviceInfoPageModule' },
 
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
