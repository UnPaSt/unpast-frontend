import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TaskService } from './services/task/task.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'UnPaSt';

  public domain = window.location.origin;
  public baseHref = '';
  public openModal = false;
  public taskId = '';

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.taskService._landingPageFeedback$.subscribe((taskId) => {
      this.taskId = taskId;
      this.openModalFun()
    });

    if (window.location.href.includes('unpast')) {
      // in production
      this.baseHref = '/unpast';
    }
  }

  public openModalFun() {
    this.openModal = true;
  }

}
