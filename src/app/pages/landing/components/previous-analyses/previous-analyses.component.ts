import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Task } from 'src/app/interfaces';
import { TaskService } from 'src/app/services/task/task.service';

@Component({
  selector: 'app-previous-analyses',
  templateUrl: './previous-analyses.component.html',
  styleUrls: ['./previous-analyses.component.scss']
})
export class PreviousAnalysesComponent implements OnInit, OnDestroy {

  @ViewChild(DataTableDirective)
  public dtElement!: DataTableDirective;

  public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject();
  public taskList: Task[] = [];


  constructor(public taskService: TaskService) {
  }

  ngOnInit(): void {
    this.setTableStyle();

    this.taskService._taskListUpdate$.subscribe((taskList: Task[]) => {
      this.destroyTable();
      this.taskList = taskList;
      if (taskList.length) {
        this.dtTrigger.next(true);
      }
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  public setTableStyle() {
    $.extend(true, $.fn.dataTable.defaults, {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true,
      lengthChange: false,
      info: false,
      order: [[0, 'desc']],
      language: {
        emptyTable: 'No previous tasks',
        searchPanes: {
          emptyPanes: 'There are no panes to display. :/'
        }
      }
    });
  }

  public destroyTable() {
    if (this.dtElement?.dtInstance) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
      })
    }
  }

  public formatDate(unix_timestamp: number) {
    // Create a new JavaScript Date object based on the timestamp
    // multiplied by 1000 so that the argument is in milliseconds, not seconds.
    const date = new Date(unix_timestamp * 1000);
    return date.toLocaleString();
  }
}
