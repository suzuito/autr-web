import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChartComponent } from './chart/chart.component';
import { HistoryComponent } from './history/history.component';
import { RealtimeComponent } from './realtime/realtime.component';


const routes: Routes = [
  {
    component: RealtimeComponent,
    path: '',
  },
  {
    component: HistoryComponent,
    path: 'history',
  },
  {
    component: RealtimeComponent,
    path: 'realtime',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
