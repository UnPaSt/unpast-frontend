import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Task } from 'src/app/interfaces';
import { ResultServiceService } from 'src/app/services/result/result-service.service';
import { TaskService } from 'src/app/services/task/task.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {

  public key: string = '';
  public taskData: Task = {
    id: '',
    status: '',
    created: 0,
    query: {
      id: '',
      name: '',
      seed: 1,
      alpha: 0,
      pValue: 0,
      binarization: 'GMM',
      clustering: 'DESMOND',
      r: 0,
      dch: 0.995,
      ds: 0,
      mail: '',
      exprs: '',
      directions: ["BOTH"],
      ceiling: 0
    },
  };
  public matrix: any;

  public delay = (ms: any) => new Promise(res => setTimeout(res, ms));

  constructor(public taskService: TaskService, private route: ActivatedRoute, public resultService: ResultServiceService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.key = params['key'];
      this.getTask();
    })
  }

  public getTask() {
    this.taskService.getTask(this.key).then(response => {
      if (response.result !== undefined) {
        // add id to biclusters
        Object.entries(response.result).forEach(([key, value]: any) => {
          value.id = key;
        });
      }
      this.taskData = response;
      this.taskData.query.mail = this.taskData.query.mail ? this.taskData.query.mail : '';

      this.checkTaskStatus();
    });
  }

  public async checkTaskStatus() {
    if (this.taskData.status !== 'Done') {
      await this.delay(3000);
      this.getTask(), 1
    }
  }

}
