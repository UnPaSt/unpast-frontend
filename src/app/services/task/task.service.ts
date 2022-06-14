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

  public submitTask() {
    console.log('task submitted')
  }

  public triggerLandingPageFeedback() {
    this._landingPageFeedback.next(true);
  }
}
