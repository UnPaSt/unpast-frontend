import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/services/task/task.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.less']
})
export class LandingComponent implements OnInit {

  public openModal = false;

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.taskService._landingPageFeedback$.subscribe((bool) => {
      if (bool) {
        this.openModalFun()
      }
    });
  }

  public openModalFun() {
    this.openModal = true;
  }

  public scroll(el: HTMLElement) {
    el.scrollIntoView();
  }

}
