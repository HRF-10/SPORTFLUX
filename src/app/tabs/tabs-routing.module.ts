import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TabsPage } from "./tabs.page";
import { AuthGuard } from "../guard/auth.guard";
import { ReAuthGuard } from "../guard/re-auth.guard";
const routes: Routes = [
  {
    path: "tabs",
    component: TabsPage,
    children: [
      {
        path: "home",
        loadChildren: "../home/home.module#HomePageModule",
        canActivate: [AuthGuard],
      },
      {
        path: "chat-room",
        loadChildren: "../chat-room/chat-room.module#ChatRoomPageModule",
        canActivate: [AuthGuard],
      },
      {
        path: "setting",
        loadChildren: () =>
          import("../setting/setting.module").then((m) => m.SettingPageModule),
      },
      {
        path: "profil",
        loadChildren: () =>
          import("../profil/profil.module").then((m) => m.ProfilPageModule),
      },
      {
        path: "chat",
        loadChildren: "../pages/home/home.module#HomePageModule",
        canActivate: [AuthGuard],
      },
      {
        path: "chat2",
        loadChildren: "../pages/home2/home2.module#Home2PageModule",
        canActivate: [AuthGuard],
      },
     
      { path: "about", loadChildren: "../about/about.module#AboutPageModule" },

      { path: 'device-info', loadChildren: './device-info/device-info.module#DeviceInfoPageModule' },
      
      {
        path: "admin",
        loadChildren: "../admin/admin.module#AdminPageModule",
        canActivate: [AuthGuard],
      },

      // sportflux

      {
        path: 'diagnose',
        loadChildren: () => import('../diagnose/diagnose.module').then( m => m.DiagnosePageModule)
      },
      {
        path: 'device-info',
        loadChildren: () => import('../device-info/device-info.module').then( m => m.DeviceInfoPageModule)
      },
      {
        path: 'login',
        loadChildren: () => import('../login/login.module').then( m => m.LoginPageModule)
      },
      {
        path: 'device',
        loadChildren: () => import('../device/device.module').then( m => m.DevicePageModule)
      },
      {
        path: 'record',
        loadChildren: () => import('../record/record.module').then( m => m.RecordPageModule)
      },
      {
        path: 'trainer',
        loadChildren: () => import('../trainer/trainer.module').then( m => m.TrainerPageModule)
      },
      {
        path: 'fisioterapis',
        loadChildren: () => import('../fisioterapis/fisioterapis.module').then( m => m.FisioterapisPageModule)
      },

      {
        path: 'community',
        loadChildren: () => import('../community/community.module').then( m => m.CommunityPageModule)
      },

      {
        path: 'profile',
        loadChildren: () => import('../profile/profile.module').then( m => m.ProfilePageModule)
      },

      {
        path: 'imu',
        loadChildren: () => import('../imu/imu.module').then( m => m.ImuPageModule)
      },

      {
        path: "", // Rute default untuk tabs, misalnya 'tabs/home'
        redirectTo: "/tabs/home", // Arahkan ke halaman default di dalam tab
        pathMatch: "full",
      },
    ],
  },
  {
    path: "", // Rute default untuk aplikasi
    redirectTo: "/login", // Arahkan ke halaman tabs saat aplikasi dimuat
    pathMatch: "full",
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
