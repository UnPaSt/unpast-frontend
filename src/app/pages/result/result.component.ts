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
      seed: 0,
      alpha: 0,
      pValue: 0,
      binarization: 'GMM',
      clustering: 'DESMOND',
      r: 0,
      mail: '',
      exprs: ''
    },
  };
  public matrix: any;

  constructor(public taskService: TaskService, private route: ActivatedRoute, public resultService: ResultServiceService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.key = params['key'];
      this.taskService.getTask(this.key).then(response => {
        this.taskData = response;
        this.taskData.query.mail = this.taskData.query.mail ? this.taskData.query.mail : '';
      });
    })
  }

}
