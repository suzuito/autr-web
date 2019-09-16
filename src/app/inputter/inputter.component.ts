import { Component, OnInit } from '@angular/core';
import { timezone } from 'strftime';
import { AppService } from '../app.service';
import { newDateTimeFromInput } from '../datetime';

const strftime = timezone('+0900');
const fmtDate = '%Y-%m-%d';
const fmtTime = '%H:%M';
const fmtYYYYMMDDHH = '%Y%m%d%H';
const fmtYYYYMMDDHHMM = '%Y%m%d%H%M';

@Component({
  selector: 'app-inputter',
  templateUrl: './inputter.component.html',
  styleUrls: ['./inputter.component.scss']
})
export class InputterComponent implements OnInit {

  public date: string;
  public time: any;

  constructor(
    private app: AppService,
  ) {
    this.date = strftime(fmtDate, new Date());
    this.time = strftime(fmtTime, new Date());
  }

  ngOnInit() {
    this.clickUpdate();
  }

  public clickUpdate(): void {
    const datetime: Date = newDateTimeFromInput(
      this.date,
      this.time,
    );
    const datehoursChart1sec: Array<string> = [];
    for (let i = 0; i < 2; i++) {
      datehoursChart1sec.push(strftime(
        fmtYYYYMMDDHH,
        new Date(datetime.getTime() - 3600000 * i),
      ));
    }
    const datehourminutesOrderBook: Array<string> = [];
    for (let i = 0; i < 30; i++) {
      datehourminutesOrderBook.push(strftime(
        fmtYYYYMMDDHHMM,
        new Date(datetime.getTime() - 60000 * i),
      ));
    }
    this.app.fetchAll(
      datehoursChart1sec,
      datehourminutesOrderBook,
    );
  }

}
