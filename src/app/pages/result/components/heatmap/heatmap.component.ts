import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import Heatmap from 'highcharts/modules/heatmap';
import More from 'highcharts/highcharts-more';
import Tree from 'highcharts/modules/treemap';

More(Highcharts);
Tree(Highcharts);
Heatmap(Highcharts);


@Component({
  selector: 'app-heatmap',
  templateUrl: './heatmap.component.html',
  styleUrls: ['./heatmap.component.scss']
})
export class HeatmapComponent implements OnInit {

  public chartOptions: any = {};
  public chartOptionsTree: any = {};
  public highcharts = Highcharts;

  constructor() { }

  ngOnInit(): void {
    this.initChart();
    this.initChartTree();
    this.testData();
  }

  private initChart() {
    this.chartOptions = {   
       chart : {
          type: 'heatmap',
          marginTop: 40,
          marginBottom: 80
       },
       title : {
          text: 'Sales per employee per weekday'
       },
       xAxis : {
          categories: ['Alexander', 'Marie', 'Maximilian', 'Sophia', 'Lukas',
             'Maria', 'Leon', 'Anna', 'Tim', 'Laura']
       },
       yAxis : {
          categories: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
             title: null
       },
       colorAxis : {
          min: 0,
          minColor: '#FFFFFF',
          maxColor: '#000000'
       },
       legend : {
          align: 'right',
          layout: 'vertical',
          margin: 0,
          verticalAlign: 'top',
          y: 25,
          symbolHeight: 280
       },
       tooltip : {
          formatter: function (): any {
            // @ts-ignore
             return '<b>' + this.series.xAxis.categories[this.point.x] +
                '</b> sold <br><b>' +
                // @ts-ignore
                this.point.value +
                '</b> items on <br><b>' +
                // @ts-ignore
                this.series.yAxis.categories[this.point.y] + '</b>';
          }
       },
       series : [{
          name: 'Sales per employee',
          borderWidth: 1,
          data: [[0, 0, 10], [0, 1, 19], [0, 2, 8], [0, 3, 24], [0, 4, 67],
          [1, 0, 92], [1, 1, 58], [1, 2, 78], [1, 3, 117], [1, 4, 48],
          [2, 0, 35], [2, 1, 15], [2, 2, 123], [2, 3, 64], [2, 4, 52],
          [3, 0, 72], [3, 1, 132], [3, 2, 114], [3, 3, 19], [3, 4, 16],
          [4, 0, 38], [4, 1, 5], [4, 2, 8], [4, 3, 117], [4, 4, 115],
          [5, 0, 88], [5, 1, 32], [5, 2, 12], [5, 3, 6], [5, 4, 120],
          [6, 0, 13], [6, 1, 44], [6, 2, 88], [6, 3, 98], [6, 4, 96],
          [7, 0, 31], [7, 1, 1], [7, 2, 82], [7, 3, 32], [7, 4, 30],
          [8, 0, 85], [8, 1, 97], [8, 2, 123], [8, 3, 64], [8, 4, 84],
          [9, 0, 47], [9, 1, 114], [9, 2, 31], [9, 3, 48], [9, 4, 91]],
          
          dataLabels: {
             enabled: true,
             color: '#000000'
          }
       }]
      
    };
 
  }
  

  private initChartTree() {
    
    this.chartOptionsTree = {   
       chart : {
          type: 'treemap',
          layoutAlgorithm: 'squarified',
          marginTop: 40,
          marginBottom: 80,
          allowDrillToNode: true,
            animationLimit: 1000,
            dataLabels: {
                enabled: false
            }
       },
       title : {
          text: 'Treemap test'   
       },
       colorAxis : {
          min: 0,
          minColor: '#FFFFFF',
          maxColor: '#000000'
       },
       legend : {
          align: 'right',
          layout: 'vertical',
          margin: 0,
          verticalAlign: 'top',
          y: 25,
          symbolHeight: 280
       },
       tooltip : {
          formatter: function (): any {
            // @ts-ignore
             return '<b>' + this.series.xAxis.categories[this.point.x] +
                '</b> sold <br><b>' +
                // @ts-ignore
                this.point.value +
                '</b> items on <br><b>' +
                // @ts-ignore
                this.series.yAxis.categories[this.point.y] + '</b>';
          }
       },
       series : [{
          name: 'Sales per employee',
          borderWidth: 1,
          data: [{
            name: 'A',
            value: 6,
            colorValue: 1
        }, {
            name: 'B',
            value: 6,
            colorValue: 2
        }, {
            name: 'C',
            value: 4,
            colorValue: 3
        }, {
            name: 'D',
            value: 3,
            colorValue: 4
        }, {
            name: 'E',
            value: 2,
            colorValue: 5
        }, {
            name: 'F',
            value: 2,
            colorValue: 6
        }, {
            name: 'G',
            value: 1,
            colorValue: 7
        }],
          
          dataLabels: {
             enabled: true,
             color: '#000000'
          }
       }]
      
    };
 
  }

  public testData() {
    const genes = []
    const samples = []
  }
}
