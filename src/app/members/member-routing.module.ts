import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardPageModule' },
  { path: 'entermark', loadChildren: './entermark/entermark.module#EntermarkPageModule' },
  { path: 'profile', loadChildren: './profile/profile.module#ProfilePageModule' },
  { path: 'changepassword', loadChildren: './changepassword/changepassword.module#ChangepasswordPageModule' },
  { path: 'calendar', loadChildren: './calendar/calendar.module#CalendarPageModule' },
  { path: 'testing', loadChildren: './testing/testing.module#TestingPageModule' },
  { path: 'mymark', loadChildren: './mymark/mymark.module#MymarkPageModule' },
  { path: 'events', loadChildren: './events/events.module#EventsPageModule' },
  { path: 'casino', loadChildren: './casino/casino.module#CasinoPageModule' },
  { path: 'casinoservice', loadChildren: './casinoservice/casinoservice.module#CasinoservicePageModule' },
  { path: 'casinooption', loadChildren: './casinooption/casinooption.module#CasinooptionPageModule' },
  // { path: 'optionmodal', loadChildren: './optionmodal/optionmodal.module#OptionmodalPageModule' },
  // { path: 'modal', loadChildren: './modal/modal.module#ModalPageModule' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MemberRoutingModule { }
