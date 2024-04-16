import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { TaskParameters } from 'src/app/interfaces';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BackendControllerService {

  constructor(private http: HttpClient) { }

  public async uploadFile(formData: any): Promise<any> {
    try {
      const response = lastValueFrom(this.http.post(`${environment.api}upload_matrix`, formData));
      return response
    } catch (error) {
      console.log(error);
    }
  }

  public async deleteTask(taskId: string): Promise<any> {
    try {
      const response = lastValueFrom(this.http.get(`${environment.api}remove_task?id=${taskId}`));
      return response
    } catch (error) {
      console.log(error);
    }
  }

  public async deleteFile(fileId: string): Promise<any> {
    try {
      const response = lastValueFrom(this.http.get(`${environment.api}remove_matrix?id=${fileId}`));
      return response
    } catch (error) {
      console.log(error);
    }
  }

  public async runTask(params: TaskParameters): Promise<any> {
    try {
      const response = lastValueFrom(this.http.post<any>(`${environment.api}run_task`, params));
      return response
    } catch (error) {
      console.log(error);
    }
  }

  public async getTask(task_id: string): Promise<any> {
    try {
      const response = lastValueFrom(this.http.get<any>(`${environment.api}get_task?id=${task_id}`));
      return response
    } catch (error) {
      console.log(error);
    }
  }


  public async getTaskData(task_id: string): Promise<any> {
    console.log(`${environment.api}get_task_data?id=${task_id}`)
    try {
      const response = lastValueFrom(this.http.get<any>(`${environment.api}get_task_data?id=${task_id}`));
      return response
    } catch (error) {
      console.log(error);
    }
  }

  public async getTasks(task_ids: string[]): Promise<any> {
    try {
      const response = lastValueFrom(this.http.post<any>(`${environment.api}get_task_statuses`, {ids: task_ids}));
      return response
    } catch (error) {
      console.log(error);
    }
  }

}
