import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RealtimeSettingService {

  public point: boolean;
  public group: boolean;

  constructor(
  ) {
    this.point = false;
    this.group = false;
  }
}
