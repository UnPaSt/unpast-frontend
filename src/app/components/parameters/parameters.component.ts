import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-parameters',
  templateUrl: './parameters.component.html',
  styleUrls: ['./parameters.component.less']
})
export class ParametersComponent implements OnInit {

  constructor() { }

  public seed: number = Math.floor(Math.random() * 100);
  public alpha: number = 0.5;


  ngOnInit(): void {
    console.log(this.seed)
  }

}
