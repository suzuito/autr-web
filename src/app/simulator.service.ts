import { Injectable } from '@angular/core';
import { Simulator, Pair } from './simulator';
import { Entry, ExecutedEntry, SideBuy } from './model';

@Injectable({
  providedIn: 'root'
})
export class SimulatorService {

  private simulator: Simulator;

  constructor() {
    this.simulator = null;
  }

  public setSimulator(simulator: Simulator): void {
    this.simulator = simulator;
  }

  public start(createdAtStart: number, createdAtEnd: number): void {
    this.simulator.start(createdAtStart, createdAtEnd);
    this.simulator.cancelEntries((e: Entry) => e.side === SideBuy);
  }

  public getEntries(): Array<Entry> {
    return this.simulator.getEntries();
  }

  public getExecutedEntries(): Array<ExecutedEntry> {
    return this.simulator.getExecutedEntries();
  }

  public getEEPairs(): Array<Pair> {
    return this.simulator.getEEPairs();
  }

  public clear(): void {
    this.simulator.clear();
  }
}
