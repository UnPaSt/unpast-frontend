import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TaskService } from 'src/app/services/task/task.service';

@Component({
  selector: 'app-parameters',
  templateUrl: './parameters.component.html',
  styleUrls: ['./parameters.component.scss']
})
export class ParametersComponent implements OnInit {

  @ViewChild('inputEmail') inputEmail!: ElementRef;
  @ViewChild('taskForm') taskForm!: ElementRef;

  constructor(public taskService: TaskService) { }


  public seed: number = Math.floor(Math.random() * 100);
  public alpha: number = 0.5;
  public pValue: number = 0.001;
  public selectedBinarizationMethod: string = 'GMM';
  public selectedClusteringMethod: string = 'Louvain';
  public r: number = 0.3;
  public email: string = ''
  public paramtersValid = true;

  ngOnInit(): void {
  }

  public validateParameters() {
    console.log('here')
    this.paramtersValid = this.taskForm.nativeElement.classList.contains('ng-valid');
  }

  public validateEmail(email: string) {
    const res = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return res.test(String(email).toLowerCase());
  }

  public submit() {
    console.log('submitting')
    this.taskService.submitTask();
    this.taskService.triggerLandingPageFeedback();

  }

}
