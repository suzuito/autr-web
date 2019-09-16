import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChartComponent } from './chart/chart.component';
import { HttpClientModule } from '@angular/common/http';
import { InputterComponent } from './inputter/inputter.component';
import { FormsModule } from '@angular/forms';
import { InfoComponent } from './info/info.component';
import { HistoryComponent } from './history/history.component';
import { RealtimeComponent } from './realtime/realtime.component';

@NgModule({
  declarations: [
    AppComponent,
    ChartComponent,
    InputterComponent,
    InfoComponent,
    HistoryComponent,
    RealtimeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,

    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
