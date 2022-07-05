import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/services/task/task.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
}
