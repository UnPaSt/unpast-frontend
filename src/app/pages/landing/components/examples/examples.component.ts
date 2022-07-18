import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-examples',
  templateUrl: './examples.component.html',
  styleUrls: ['./examples.component.scss']
})
export class ExamplesComponent implements OnInit {

  public linkExample: string = environment.api + 'download_example'

  constructor() { }

  ngOnInit(): void {
    console.log(this.linkExample)
  }

}
