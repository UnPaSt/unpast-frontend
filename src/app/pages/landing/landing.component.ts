import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/services/task/task.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  public openModal = false;
  public taskId = '';

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.taskService._landingPageFeedback$.subscribe((taskId) => {
      this.taskId = taskId;
      this.openModalFun()
    });
  }

  public openModalFun() {
    this.openModal = true;
  }

  public scroll(el: HTMLElement) {
    el.scrollIntoView();
  }

}
