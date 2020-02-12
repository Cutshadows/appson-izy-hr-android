import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardPageModule' },
  { path: 'entermark', loadChildren: './entermark/entermark.module#EntermarkPageModule' },
  { path: 'profile', loadChildren: './profile/profile.module#ProfilePageModule' },
  { path: 'changepassword', loadChildren: './changepassword/changepassword.module#ChangepasswordPageModule' },
  { path: 'calendar', loadChildren: './calendar/calendar.module#CalendarPageModule' },
  { path: 'mymark', loadChildren: './mymark/mymark.module#MymarkPageModule' },
  { path: 'events', loadChildren: './events/events.module#EventsPageModule' },
  { path: 'eventsubmit', loadChildren: './eventsubmit/eventsubmit.module#EventsubmitPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    ]
    ,
  exports: [RouterModule]
})
export class MemberRoutingModule { }
