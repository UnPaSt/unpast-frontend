import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-previous-analyses',
  templateUrl: './previous-analyses.component.html',
  styleUrls: ['./previous-analyses.component.less']
})
export class PreviousAnalysesComponent implements OnInit {

  public dtOptions: DataTables.Settings = {};
  public analyses = [{id: 1, date: '10.06.2022'}, {id: 2, date: '10.06.2022'}, {id: 3, date: '10.06.2022'}]

  constructor() { }

  ngOnInit(): void {
    this.initTable();
  }

  public initTable() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true
    };
  }

}
