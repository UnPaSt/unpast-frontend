import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  public maxTasks: number = 3;
  public currentTasks: number = 0;

  private _landingPageFeedback = new Subject<boolean>();

  get _landingPageFeedback$ () {
    return this._landingPageFeedback.asObservable();
  }

  constructor() { }

  public submitTask(data: any) {
    let URL = "http://localhost:8001/run_task"
    console.log("submitting task to "+URL)
  }

  public triggerLandingPageFeedback() {
    this._landingPageFeedback.next(true);
  }
}
