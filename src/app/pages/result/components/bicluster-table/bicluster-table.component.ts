import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { TaskResult } from 'src/app/interfaces';

@Component({
  selector: 'app-bicluster-table',
  templateUrl: './bicluster-table.component.html',
  styleUrls: ['./bicluster-table.component.scss']
})
export class BiclusterTableComponent implements OnInit, OnDestroy, AfterViewInit {

  public _result?: TaskResult;
  @Input() set result(value: TaskResult) {
    this._result = value;
    setTimeout(() => {
      this.dtTrigger.next(true);
    })
  };

  @ViewChild(DataTableDirective)
  public dtElement!: DataTableDirective;

  public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject();

  constructor() { }

  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
    $.extend(true, $.fn.dataTable.defaults, {
      dom: 'Bfrtip',
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      lengthChange: false,
      info: true,
      columnDefs: [
        {
          // The `data` parameter refers to the data for the cell (defined by the
          // `data` option, which defaults to the column being worked with, in
          // this case `data: 0`.
          render: function (data: any, type: any, row: any) {
            if (data) {
              return data.replaceAll(',', ', ');
            } else {
              return '';
            }
          },
          targets: [3, 5],
        }],
      language: {
        emptyTable: 'No previous tasks',
        searchPanes: {
          emptyPanes: 'There are no panes to display. :/'
        }
      },
      buttons: [
        'copy', 'csv', 'excel'
      ]
    });

  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

}
