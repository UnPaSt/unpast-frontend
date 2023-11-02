import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { TaskParameters, Task } from 'src/app/interfaces';
import { BackendControllerService } from '../backend-controller/backend-controller.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private localStorageKey = window.location.host + '.taskKeys'
  public maxTasks: number = 3;
  public currentTasks: number = 0;
  public taskList: Task[] = [];

  private _landingPageFeedback = new Subject<string>();
  private _taskListUpdate = new Subject<Task[]>();

  get _taskListUpdate$() {
    return this._taskListUpdate.asObservable();
  }

  get _landingPageFeedback$() {
    return this._landingPageFeedback.asObservable();
  }

  constructor(public backend: BackendControllerService) {
    const keys = this.readKeys();
    backend.getTasks(keys).then((response) => {
      this.taskList = response;
      this.triggerTaskListUpdate();
    });
  }

  public getTaskKeys() {
    /** Returns keys from task objects stored in task service */
    return this.taskList.map((task) => task.id);
  }

  public storeKeys(keys: string[]) {
    /** Reads keys to local storage */
    localStorage.setItem(this.localStorageKey, JSON.stringify(keys));
  }

  public readKeys() {
    /** Reads keys from local storage */
    const keyList = localStorage.getItem(this.localStorageKey);
    return keyList ? JSON.parse(keyList) : []
  }
  
  public async deleteTask(uid: string): Promise<any> {
    this.taskList = this.taskList.filter(function( obj ) {
      return obj.id !== uid;
    });
    this.storeKeys(this.getTaskKeys())
    this.triggerTaskListUpdate();
    const response = this.backend.deleteTask(uid);
    return
  }

  public async submitTask(data: TaskParameters): Promise<string> {
    const response = await this.backend.runTask(data);
    this.taskList.push({id: response.id, status: 'Submitted', query: data, created: new Date().getTime()});
    this.storeKeys(this.getTaskKeys())
    this.triggerTaskListUpdate();
    return response.id
  }

  public async getTask(id: string): Promise<any> {
    const response = await this.backend.getTask(id);
    return response
  }

  public async getTaskData(id: string): Promise<any> {
    const response = await this.backend.getTaskData(id);
    return response
  }

  public triggerTaskListUpdate() {
    this._taskListUpdate.next(this.taskList);
  }

  public triggerLandingPageFeedback(taskId: string) {
    this._landingPageFeedback.next(taskId);
  }
}

