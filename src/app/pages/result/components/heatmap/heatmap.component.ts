import { Component, Input, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import Heatmap from 'highcharts/modules/heatmap';
import More from 'highcharts/highcharts-more';
import { TaskService } from 'src/app/services/task/task.service';
import { Bicluster } from 'src/app/interfaces';
import { ResultServiceService } from 'src/app/services/result/result-service.service';
import { ViewportScroller } from '@angular/common';
import * as _ from 'lodash';

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

   private updateChartLines = false;

   private COLUMNSIZEFACTOR = 6;
   private ROWSIZEFACTOR = 8;

   private columnLookup: any = {};
   private rowLookup: any = {};

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
         this.updateChartLines = true;
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

   public updateHeatmap(biclusters: Bicluster[]) {
      /** Wrapper of heatmap update functions to show loading */
      this.resultService.heatmapIsLoading = true;
      setTimeout(() => {
         this.formatHeatmapData(JSON.parse(JSON.stringify(this.originalData)), biclusters);
      })
   }

   private pushToBeginning(list: any[], listToPush: any[]) {
      let listToPushIntern = JSON.parse(JSON.stringify(listToPush));
      listToPushIntern.push(...list);
      return Array.from(new Set(listToPushIntern));
   }

   private intersect(listOfArrays: any[]) {
      return _.intersection.apply(_, listOfArrays);
   }

   private union(a: any[], b: any[]) {
      return [...new Set([...a, ...b])]
   }

   private difference(a: any[], b: any[]) {
      const aIntern = JSON.parse(JSON.stringify(a));
      aIntern.filter((el: any) => !b.includes(el));
      return aIntern
   }

   public formatHeatmapData(data: any, biclusters: Bicluster[]) {

      const selectedSamples = Object.values(biclusters).map(bicluster => bicluster.samples);
      const selectedGenes = Object.values(biclusters).map(bicluster => bicluster.genes);

      const selectedColumns = [...new Set(selectedSamples.flat(1))];
      const selectedRows = [...new Set(selectedGenes.flat(1))];

      // sort columns for bicluster
      let columnsSorted: any[] = JSON.parse(JSON.stringify(data.columns));
      for (let i = selectedSamples.length - 1; i >= 0; i--) {
         const sample = selectedSamples[i];
         columnsSorted = this.pushToBeginning(columnsSorted, sample);
         for (let j = i; j < selectedSamples.length; j++) {
            // const subset = i > 0 ? selectedSamples.slice(i, j) : selectedSamples.slice(j);
            const subset = selectedSamples.slice(i, j+1);
            // @ts-ignore
            const leadingList: string[] = this.intersect(subset);
            columnsSorted = this.pushToBeginning(columnsSorted, leadingList);
         }
      }
      data.columns = columnsSorted;

      // remove rows that are not selected to make heatmap smaller
      data.rows = data.rows.filter((row: string) => selectedRows.includes(row));
      // sort rows
      data.rows = this.pushToBeginning(data.rows, selectedRows);

      this.columnLookup = {};
      for (const i in data.columns) {
         this.columnLookup[data.columns[i]] = parseInt(i);
      }

      this.rowLookup = {};
      for (const i in data.rows) {
         this.rowLookup[data.rows[i]] = parseInt(i);
      }

      // assign values to correct position in heatmap
      const valuesFormatted: any = [];
      for (const value of data.values) {
         const row = this.rowLookup[value[0]];
         if (row === undefined) {
            // gene that was not selected
            continue
         }
         const column = this.columnLookup[value[1]];
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
                  // control trigger manually, this would get triggered twice otherwise
                  if (this.updateChartLines) {
                     // draw lines in chart
                     this.drawBiclusterLines(chart.plotLeft, chart.plotTop, chart.xAxis[0].minPixelPadding, chart.yAxis[0].minPixelPadding, chart.yAxis[0].categories);
                     chart.myLine.destroy();
                     chart.myLine = chart.renderer.path(this.lineCoords)
                        .attr({
                           'stroke-width': 1,
                           stroke: 'black',
                           zIndex: 3
                        })
                        .add();
                  }
                  this.updateChartLines = false;
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

   public drawBiclusterLines(x: number, y: number, xPadding: number, yPadding: number, categoryLabels: string[]) {
      // reset line coords
      const topLeftX = x;

      this.lineCoords = [];

      const seenSamples: Set<string> = new Set([]);

      // padding applies to both sides
      xPadding = xPadding * 2;
      yPadding = yPadding * 2;
      this.selectedBiclusters.forEach(bicluster => {
         const biclusterSamples = new Set(bicluster.samples);
         let nNewSamples = 0;
         let nOldSamplesCur = 0;
         let nOldSamples = 0;
         let outlineSeenSamples = false;
         for (const [index, sample] of categoryLabels.entries()) {
            if (biclusterSamples.has(sample)) {
               if (!seenSamples.has(sample)) {
                  nNewSamples++;
                  seenSamples.add(sample);
               } else {
                  nOldSamples++;
                  nOldSamplesCur++;
                  outlineSeenSamples = true;
               }
            } else {
               if (!seenSamples.has(sample)) {
                  // draw last box outside of loop to merge with new samples
                  break
               }
               if (outlineSeenSamples) {
                  outlineSeenSamples = false;
                  this.outlineFields(topLeftX + (index - nOldSamplesCur) * yPadding, y, nOldSamplesCur, bicluster.genes.length, xPadding, yPadding);
                  nOldSamplesCur = 0;
               }
            }
         }
         this.outlineFields(x, y, nNewSamples, bicluster.genes.length, xPadding, yPadding);
         x = x + nNewSamples * yPadding;
         y = y + bicluster.genes.length * xPadding;
      });
   }

   private outlineFields(x: number, y: number, nCol: number, nRows: number, xPadding: number, yPadding: number) {
      // x = x top left
      // y = y top left

      // 'L' with two coords to draw free line
      this.lineCoords.push(...['M', x - 1, y, 'H', x + nCol * yPadding + 1]);
      this.lineCoords.push(...['M', x, y - 1, 'V', y + nRows * xPadding + 1]);

      x = x + nCol * yPadding;
      y = y + nRows * xPadding;

      this.lineCoords.push(...['M', x + 1, y, 'H', x - nCol * yPadding - 1]);
      this.lineCoords.push(...['M', x, y + 1, 'V', y - nRows * xPadding - 1]);
   }

}
