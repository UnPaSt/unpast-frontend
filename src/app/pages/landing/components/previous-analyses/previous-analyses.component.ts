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
    $.extend(true, $.fn.dataTable.defaults, {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true,
      lengthChange: false,
      info: false,
      language: {
        emptyTable: 'No previous tasks',
        searchPanes: {
          emptyPanes: 'There are no panes to display. :/'
        }
      }
    });

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

  public destroyTable() {
    if (this.dtElement?.dtInstance) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
      })
    }
  }
}
