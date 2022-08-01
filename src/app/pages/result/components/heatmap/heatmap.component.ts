import { Component, Input, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import Heatmap from 'highcharts/modules/heatmap';
import More from 'highcharts/highcharts-more';
import { TaskService } from 'src/app/services/task/task.service';
import { Bicluster } from 'src/app/interfaces';
import { ResultServiceService } from 'src/app/services/result/result-service.service';
import { ViewportScroller } from '@angular/common';

More(Highcharts);
Heatmap(Highcharts);


@Component({
   selector: 'app-heatmap',
   templateUrl: './heatmap.component.html',
   styleUrls: ['./heatmap.component.scss']
})
export class HeatmapComponent implements OnInit {

   public originalData: any = {};
   private lineCoords: any[] = [];
   private selectedBiclusters: Bicluster[] = [];

   private COLUMNSIZEFACTOR = 6;
   private ROWSIZEFACTOR = 8;

   @Input() set key(value: string) {
      this.taskService.getTaskData(value).then((response: any) => {
         if (!response) {
            return
         }
         this.originalData = JSON.parse(JSON.stringify(response));
         this.formatHeatmapData(response, []);
         this.resultService.heatmapDataLoaded = true;
      })
   };

   public chartWidth = 800;
   public chartHeight = 800;

   public matrix: any;
   public chartOptions: any = {};
   // public chartOptionsTree: any = {};
   public highcharts = Highcharts;
   public heatmapTestData: any = [];
   public updateFlag = false;
   public chart: any;
   public self: any;

   public chartData = {
      columns: ['placeholder'],
      rows: ['placeholder'],
      values: [[0, 0, 10]],
   };

   constructor(
      public taskService: TaskService,
      public resultService: ResultServiceService,
      public scroller: ViewportScroller) {
   }

   ngOnInit(): void {
      this.self = this;
      this.initChart();
      this.resultService._biclusterSelectedHeatmap$.subscribe((biclusters: Bicluster[]) => {
         this.selectedBiclusters = biclusters;
         this.updateHeatmap(biclusters);
      });
   }

   public chartCallback(chart: any) {
      chart.myLine = chart.renderer.path(['M', chart.plotLeft, chart.plotTop, 'L', chart.plotWidth + chart.plotLeft, chart.plotHeight + chart.plotTop])
         .attr({
            'stroke-width': 10,
            stroke: 'black',
            zIndex: 10
         })
         .add();
   }

   public removeLastOccurenceByValue(array: any[], value: any) {
      const index = array.lastIndexOf(value);
      if (index !== -1) {
         array.splice(index, 1);
      }
      return array
   }

   public updateHeatmap(biclusters: Bicluster[]) {
      /** Wrapper of heatmap update functions to show loading */
      this.resultService.heatmapIsLoading = true;
      setTimeout(() => {
         this.formatHeatmapData(JSON.parse(JSON.stringify(this.originalData)), biclusters);
      })
   }

   public formatHeatmapData(data: any, biclusters: Bicluster[]) {

      const selectedSamples = Object.values(biclusters).map(bicluster => bicluster.samples);
      const selectedGenes = Object.values(biclusters).map(bicluster => bicluster.genes);
      // const selectedSamplesIndices = Object.values(biclusters).map(bicluster => bicluster.sample_indices);
      // const selectedGenesIndices = Object.values(biclusters).map(bicluster => bicluster.gene_indices);

      const selectedColumns = [...new Set(selectedSamples.flat(1))];
      const selectedRows = [...new Set(selectedGenes.flat(1))];
      // const selectedColumnsIndices = [...new Set(selectedSamplesIndices.flat(1))];
      // const selectedRowsIndices = [...new Set(selectedGenesIndices.flat(1))];

      // // descending order
      // selectedColumnsIndices.sort(function(a,b){ return b - a; });
      // selectedRowsIndices.sort(function(a,b){ return b - a; });

      if (selectedColumns) {
         let columnsSorted: any = JSON.parse(JSON.stringify(selectedColumns));
         columnsSorted.push(...data.columns);
         for (const value of selectedColumns) {
            columnsSorted = this.removeLastOccurenceByValue(columnsSorted, value);
         }
         data.columns = columnsSorted;
      }

      if (selectedRows) {
         let rowsSorted: any = JSON.parse(JSON.stringify(selectedRows));
         rowsSorted.push(...data.rows);
         for (const value of selectedRows) {
            rowsSorted = this.removeLastOccurenceByValue(rowsSorted, value);
         }
         data.rows = rowsSorted;
      }

      // remove rows that are not selected to make heatmap smaller
      data.rows = data.rows.filter((row: string) => selectedRows.includes(row));

      const columnLookup: any = {};
      for (const i in data.columns) {
         columnLookup[data.columns[i]] = parseInt(i);
      }

      const rowLookup: any = {};
      for (const i in data.rows) {
         rowLookup[data.rows[i]] = parseInt(i);
      }

      const valuesFormatted: any = [];
      for (const value of data.values) {
         const row = rowLookup[value[0]];
         if (row === undefined) {
            // gene that was not selected
            continue
         }
         const column = columnLookup[value[1]];
         valuesFormatted.push([row, column, value[2]]);
      }


      data.values = valuesFormatted;
      this.chartData = data;

      if (!(selectedColumns.length || selectedRows.length)) {
         // do not show initial heatmap
         return
      }

      this.chartOptions.yAxis.categories = this.chartData.columns;
      this.chartOptions.xAxis.categories = this.chartData.rows;
      this.chartOptions.series[0].data = this.chartData.values;

      // if (selectedColumns.length) {
      //    this.chartOptions.yAxis.plotLines = [{
      //       width: 4,
      //       color: '#ff0000',
      //       value: selectedColumns.length - 0.5,
      //       zIndex: 3
      //    }]
      // } else {
      //    this.chartOptions.yAxis.plotLines = [];
      // }

      // if (selectedRows.length) {
      //    this.chartOptions.xAxis.plotLines = [{
      //       width: 2,
      //       color: '#ff0000',
      //       value: selectedRows.length-0.5,
      //       zIndex: 3
      //     }]
      // } else {
      //    this.chartOptions.xAxis.plotLines = [];
      // }
      const maxWidth: number = $(window).width() as number - 100;
      const idealWidth = 200 + this.chartData.columns.length * this.COLUMNSIZEFACTOR;

      if (idealWidth > maxWidth) {
         this.chartWidth = maxWidth;
         this.chartOptions.yAxis.labels.enabled = false;
      } else {
         this.chartWidth = idealWidth;
         this.chartOptions.yAxis.labels.enabled = true;
      }
      this.chartHeight = 200 + this.chartData.rows.length * this.ROWSIZEFACTOR;
      this.updateFlag = true;
      this.resultService.heatmapIsLoading = false;
      this.scroller.scrollToAnchor('heatmap');
   }

   private initChart() {
      this.chartOptions = {
         chart: {
            type: 'heatmap',
            marginTop: 40,
            marginBottom: 80,
            plotBorderWidth: 1,
            inverted: true,
            events: {
               redraw: (e: any) => {
                  const chart = e.target;
                  // adapt chart size
                  chart.reflow();
                  // draw lines in chart
                  this.drawBiclusterLines(chart.plotLeft, chart.plotTop, chart.xAxis[0].minPixelPadding, chart.yAxis[0].minPixelPadding);
                  chart.myLine.destroy();
                  chart.myLine = chart.renderer.path(this.lineCoords)
                     .attr({
                        'stroke-width': 4,
                        stroke: 'black',
                        zIndex: 3
                     })
                     .add();
               },
            }
         },

         boost: {
            useGPUTranslations: true
         },

         title: {
            text: 'Expression Heatmap',
            align: 'left',
            x: 40
         },

         // subtitle: {
         //    text: 'Select bicluster in the table to highlight them in the chart',
         //    align: 'left',
         //    x: 40
         // },

         xAxis: {
            categories: this.chartData.columns,
            tickLength: 1,
            tickWidth: 1,
            minPadding: 0,
            maxPadding: 0,
            startOnTick: false,
            endOnTick: false,
            labels: {
               enabled: true,
               step: 1,
               style: {
                  color: 'black',
                  fontSize: '7px'
               }
            }
         },

         yAxis: {
            categories: this.chartData.rows,
            title: null,
            startOnTick: false,
            endOnTick: false,
            tickLength: 1,
            tickWidth: 1,
            // reversed: true,
            minPadding: 0,
            maxPadding: 0,
            labels: {
               enabled: true,
               step: 1,
               rotation: 90,
               style: {
                  color: 'black',
                  fontSize: '7px'
               }
            }
         },

         legend: {
            align: 'left',
            layout: 'vertical',
            margin: 0,
            verticalAlign: 'top',
            y: 25,
            symbolHeight: 280
         },

         colorAxis: {
            stops: [
               [0, '#3060cf'],
               [0.5, '#fffbbc'],
               [1, '#c4463a']
            ],
            startOnTick: false,
            endOnTick: false,
            labels: {
               format: '{value}'
            }
         },
         tooltip: {
            formatter: function (): any {
               // @ts-ignore
               return 'Gene: <b>' + this.series.xAxis.categories[this.point.x] + '</b> <br>' +
                  // @ts-ignore
                  'Sample: <b>' + this.series.yAxis.categories[this.point.y] + '</b> <br>' +
                  // @ts-ignore
                  'Expression: <b>' + this.point.value + '</b>';
            }
         },
         series: [{
            nullColor: '#EFEFEF',
            boostThreshold: 100000,
            name: 'Expression (z-normalized)',
            borderWidth: 0,
            colsize: 1,
            rowsize: 1,
            data: this.chartData.values,
         }],

      }
   }

   public drawBiclusterLines(x: number, y: number, xPadding: number, yPadding: number) {
      // reset line coords
      this.lineCoords = [];

      const seenSamples: Set<string> = new Set([]);

      // padding applies to both sides
      xPadding = xPadding * 2;
      yPadding = yPadding * 2;
      let nNewSamples = 0;
      this.selectedBiclusters.forEach(bicluster => {
         nNewSamples = 0;
         bicluster.samples.forEach( (sample: string) => {
            if (!seenSamples.has(sample)) {
               nNewSamples ++;
               seenSamples.add(sample);
            }
         })

         // 'L' with two coords to draw free line
         this.lineCoords.push(...['M', x - 1, y, 'H', x + nNewSamples * yPadding + 1]);
         this.lineCoords.push(...['M', x, y - 1, 'V', y + bicluster.genes.length * xPadding + 1]);

         x = x + nNewSamples * yPadding;
         y = y + bicluster.genes.length * xPadding;

         this.lineCoords.push(...['M', x + 1, y, 'H', x - nNewSamples * yPadding - 1]);
         this.lineCoords.push(...['M', x, y + 1, 'V', y - bicluster.genes.length * xPadding - 1]);

      });

   }

}
