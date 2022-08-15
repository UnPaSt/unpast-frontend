import { AfterViewInit, Component, Input, OnDestroy, Renderer2, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Bicluster, Task, TaskResult } from 'src/app/interfaces';
import { ResultServiceService } from 'src/app/services/result/result-service.service';

@Component({
  selector: 'app-bicluster-table',
  templateUrl: './bicluster-table.component.html',
  styleUrls: ['./bicluster-table.component.scss']
})
export class BiclusterTableComponent implements OnDestroy, AfterViewInit {

  public _taskData?: Task;
  @Input() set taskData(value: Task) {
    this._taskData = value;
    setTimeout(() => {
      this.dtTrigger.next(true);
    })
  };

  @ViewChild(DataTableDirective)
  public dtElement!: DataTableDirective;

  public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject();

  public minAvgSNR: number = NaN;
  public maxAvgSNR: number = NaN;
  public minGenes: number = NaN;
  public maxGenes: number = NaN;
  public minSamples: number = NaN;
  public maxSamples: number = NaN;


  constructor(private renderer: Renderer2, public resultService: ResultServiceService) { }

  ngAfterViewInit(): void {
    this.setTableSettings();
    this.activateCustomSearch();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  private setTableSettings() {
    $.extend(true, $.fn.dataTable.defaults, {
      dom: 'PlBrtip',
      pagingType: 'full_numbers',
      processing: true,
      lengthMenu: [10, 25, 50],
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
          emptyPanes: 'There are no panes to display.'
        }
      },
      buttons: [
        'copy', 'csv', 'excel'
      ]
    });
  }

  public rowClick(event: any, id: string, bicluster: Bicluster) {
    if (!this._taskData?.query.exprs) {
      // data file for task has been deleted
      return
    }
    const hasClass = event.target.parentNode.classList.contains('selected');
    if (hasClass) {
      this.renderer.removeClass(event.target.parentNode, 'selected');
      this.resultService.removeBicluster(id);
    } else {
      this.renderer.addClass(event.target.parentNode, 'selected');
      this.resultService.selectBicluster(id, bicluster);
    }
  }

  private activateCustomSearch() {
    // datatables js search can handle empty spaces
    // replace other string separators by empty spaces before giving it to search
    const self = this;
    $('#searchfield').on('keyup', function () {
      // @ts-ignore
      const term = this.value.replace(/,|;|\|/gi, function (matched) {
        return ' ';
      });
      // @ts-ignore
      self.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        // @ts-ignore
        dtInstance.search(term).draw();
      });
    });
  }

  private activateColumnFilter(min: any, max: any, colId: number) {
    $.fn['dataTable'].ext.search.push((settings: any, data: any, dataIndex: any) => {
      const id = parseFloat(data[colId]) || 0; // use data for the id column
      if ((isNaN(min) && isNaN(max)) ||
        (isNaN(min) && id <= max) ||
        (min <= id && isNaN(max)) ||
        (min <= id && id <= max)) {
        return true;
      }
      return false;
    });
  }

  public redrawTable(removeFilter = false) {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
      if (removeFilter) {
        // remove filter
        $.fn['dataTable'].ext.search.pop();
        $.fn['dataTable'].ext.search.pop();
        $.fn['dataTable'].ext.search.pop();
      }
    });
  }

  public clearFilterByAvgSNR() {
    this.maxAvgSNR = NaN;
    this.minAvgSNR = NaN;
    this.filter();
  }

  public filter() {
    this.activateColumnFilter(this.minAvgSNR, this.maxAvgSNR, 1);
    this.activateColumnFilter(this.minGenes, this.maxGenes, 3);
    this.activateColumnFilter(this.minSamples, this.maxSamples, 5);
    this.redrawTable(true);
  }

  public clearFilterByGenes() {
    this.maxGenes = NaN;
    this.minGenes = NaN;
    this.filter();
  }

  public clearFilterBySamples() {
    this.maxSamples = NaN;
    this.minSamples = NaN;
    this.filter();
  }

  public displayHeatmap() {
    this.resultService.triggerBiclusterSelectionHeatmap();
    this.resultService.showHeatmap = true;
  }

  public displayNetwork() {
    this.resultService.triggerBiclusterSelectionNetwork();
    this.resultService.showNetwork = true;
  }

}
