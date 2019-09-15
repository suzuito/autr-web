import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import {
  HttpHeaders,
  HttpParams,
  HttpClient,
  HttpEvent,
} from '@angular/common/http';
import { Execution, ChartEach, OrderBook } from './model';

function url(
  path: string,
): string {
  if (environment.api.ignorePort) {
    return `${environment.api.protocol}://${environment.api.hostname}/${environment.projectId}${path}`;
  }
  return `${environment.api.protocol}://${environment.api.hostname}:${environment.api.port}/${environment.projectId}${path}`;
}

class OptBuilder {
  private o: any;
  constructor() {
    this.o = {
      headers: new HttpHeaders(),
      params: new HttpParams(),
      withCredentials: false, // Must be false for Google Cloud Storage
    };
  }
  public header(k: string, v: string): OptBuilder {
    this.o.headers = this.o.headers.set(k, v);
    return this;
  }
  public nextCursor(v: string): OptBuilder {
    if (!v) { return this; }
    this.header('X-Next-Cursor', v);
    return this;
  }
  public atoken(v: string): OptBuilder {
    this.header('Chat001-Agent', v);
    return this;
  }
  public auth(v: string): OptBuilder {
    this.header('X-App-Auth', v);
    return this;
  }
  public param(k: string, v: string): OptBuilder {
    this.o.params = this.o.params.set(k, v);
    return this;
  }
  public limits(l: number): OptBuilder {
    if (l > 0) {
      this.o.params = this.o.params.set('limits', l);
    }
    return this;
  }
  public jsonResponseBody(): OptBuilder {
    this.o.responseType = 'json';
    return this;
  }
  public textResponseBody(): OptBuilder {
    this.o.responseType = 'text';
    return this;
  }
  public fullResponse(): OptBuilder {
    this.o.observe = 'response';
    return this;
  }
  public gen(): any {
    return this.o;
  }
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
  ) { }

  public async getExecutions(
    datehourminute: string,
  ): Promise<Map<number, Execution>> {
    return this.http.get<Map<number, Execution>>(
      url(`/executions/${datehourminute}.json`),
      new OptBuilder()
        .jsonResponseBody()
        .gen(),
    ).toPromise().then(
      (res: any) => res
    );
  }

  public async getChart1sec(
    datehour: string,
  ): Promise<Map<string, ChartEach>> {
    return this.http.get<Map<string, ChartEach>>(
      url(`/chart1sec/${datehour}.json`),
      new OptBuilder()
        .jsonResponseBody()
        .gen(),
    ).toPromise().then(
      (res: any) => res
    );
  }

  public async getOrderBooks(
    datehourminute: string,
  ): Promise<any> {
    return this.http.get<any>(
      url(`/order_books/${datehourminute}.json`),
      new OptBuilder()
        .jsonResponseBody()
        .gen(),
    ).toPromise().then(
      (res: any) => res
    );
  }
}
