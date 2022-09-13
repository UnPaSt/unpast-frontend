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
   private selectedBiclusters: { [key: string]: Bicluster; } = {};

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
         this.formatHeatmapData(response, {});
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
      this.resultService._biclusterSelectedHeatmap$.subscribe((biclusters: { [key: string]: Bicluster; }) => {
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

   public updateHeatmap(biclusters: { [key: string]: Bicluster; }) {
      /** Wrapper of heatmap update functions to show loading */
      this.resultService.heatmapIsLoading = true;
      setTimeout(() => {
         this.formatHeatmapData(JSON.parse(JSON.stringify(this.originalData)), biclusters);
      })
   }

   private pushToEnd(list: any[], listToPush: any[]) {
      let listIntern = JSON.parse(JSON.stringify(list));
      listIntern.push(...listToPush);
      return Array.from(new Set(listIntern.reverse())).reverse();
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
      let aIntern = JSON.parse(JSON.stringify(a));
      aIntern = aIntern.filter((el: any) => !b.includes(el));
      return aIntern
   }

   // public sortSamples(columnsSorted, selectedSamples) {
   //    for (let i = selectedSamples.length - 1; i >= 0; i--) {
   //       const sample = selectedSamples[i];
   //       columnsSorted = this.pushToBeginning(columnsSorted, sample);
   //       for (let j = i; j < selectedSamples.length; j++) {
   //          const subset = selectedSamples.slice(i, j+1);
   //          // @ts-ignore
   //          const leadingList: string[] = this.intersect(subset);
   //          console.log(i, j+1)
   //          columnsSorted = this.pushToBeginning(columnsSorted, leadingList);
   //          for (let k = i; k < j; k++) {
   //             const subset = selectedSamples.slice(i, j+1);
   //             // @ts-ignore
   //             const leadingList: string[] = this.intersect(subset);
   //             columnsSorted = this.pushToBeginning(columnsSorted, leadingList);
   //          }
   //       }
   //    }
   // }
   
   private occurenceInSampleSets(sample: string, samplesSets: any[]) {
      return samplesSets.some((sampleSet) => sampleSet.has(sample))
   }

   private removeSamplesFromSampleSets(samples: string[], samplesSets: any[]) {
      for (let sample of samples) {
         for (let i = 0; i < samplesSets.length; i++) {
            // no need to check for existence
            samplesSets[i].delete(sample)
         }
      }
      return samplesSets
   }

   public sortSamples(sampleSets: Array<Set<string>>, samplesSorted: string[] = []): string[] {
      if (!sampleSets.length) {
         return samplesSorted
      }

      // for all
      for (let sample of sampleSets[0]) {
         if (this.occurenceInSampleSets(sample, sampleSets.slice(1))) {
            samplesSorted.push(sample)
         }
      }
      sampleSets = this.removeSamplesFromSampleSets(samplesSorted, sampleSets);

      // for subsets
      for (let sample of sampleSets[0]) {
         for (let i = 1; i < sampleSets.length; i++) {
            for (let j = i+1; j < sampleSets.length; j++) {
               console.log('i, j')
               console.log(i, j)
               if (this.occurenceInSampleSets(sample, sampleSets.slice(i, j))) {
                  samplesSorted.push(sample)
               }
            }
            if (this.occurenceInSampleSets(sample, [sampleSets[i]])) {
               samplesSorted.push(sample)
            }
         }
      }
      sampleSets = this.removeSamplesFromSampleSets(samplesSorted, sampleSets);

      // first sample set is done
      sampleSets = sampleSets.slice(1);
      return this.sortSamples(sampleSets, samplesSorted)
   }

   public formatHeatmapData(data: any, biclusters: { [key: string]: Bicluster; }) {

      const selectedSamples = Object.values(biclusters).map(bicluster => new Set(bicluster.samples));
      const selectedGenes = Object.values(biclusters).map(bicluster => bicluster.genes);

      const selectedColumns = [...new Set([...selectedSamples.flat(1)])];
      const selectedRows = [...new Set(selectedGenes.flat(1))];
      this.chartOptions.xAxis[1].categories = [];
      // get bicluster axis labels
      for (const [key, value] of Object.entries(biclusters)) {
         for (let i = 0; i < value.genes.length; i++) {
            this.chartOptions.xAxis[1].categories.push(Number(key));
         }
      }

      // // sort columns for bicluster
      // let columnsSorted: any[] = JSON.parse(JSON.stringify(data.columns));
      // for (let i = selectedSamples.length - 1; i >= 0; i--) {
      //    const sample = selectedSamples[i];
      //    columnsSorted = this.pushToBeginning(columnsSorted, sample);
      //    for (let j = i; j < selectedSamples.length; j++) {
      //       const subset = selectedSamples.slice(i, j+1);
      //       // @ts-ignore
      //       let leadingList: string[] = this.intersect(subset);
      //       for (let k = i+1; k < j; k++) {
      //          console.log('i, k, k+1, j+1')
      //          console.log(i, k, k+1, j+1)
      //          let subset = [...selectedSamples.slice(i, k), ...selectedSamples.slice(k+1, j+1)];
      //          subset = this.difference(this.intersect(subset), selectedSamples.slice(k, k+1).flat(1))
      //          console.log(this.difference([1, 2, 3], [1]))
      //          console.log('subset', subset)
      //          // @ts-ignore
      //          leadingList = this.pushToBeginning(leadingList, subset);
      //       }
      //       console.log(i, j+1)
      //       columnsSorted = this.pushToBeginning(columnsSorted, leadingList);

      //    }
      // }

      const columnsSorted = this.sortSamples(selectedSamples)
      data.columns = this.pushToBeginning(data.columns, columnsSorted);

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
      this.chartOptions.xAxis[0].categories = this.chartData.rows;
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

         xAxis: [{
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
            },
            // title: {
            //    text: 'Gene'
            // }
         }, 
         {  
            categories: this.chartData.columns,
            linkedTo: 0,
            opposite: false,
            title: {
               text: 'Cluster'
            }
         }],

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
      Object.values(this.selectedBiclusters).forEach(bicluster => {
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
