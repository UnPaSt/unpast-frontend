import { ViewportScroller } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Bicluster } from 'src/app/interfaces';
import { ResultServiceService } from 'src/app/services/result/result-service.service';

@Component({
  selector: 'app-drugstone',
  templateUrl: './drugstone.component.html',
  styleUrls: ['./drugstone.component.scss']
})
export class DrugstoneComponent implements OnInit {

  public biclusterColors = ['#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78', '#2ca02c', '#98df8a', '#d62728', '#ff9896', '#9467bd', '#c5b0d5', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5'];

  constructor(
    public resultService: ResultServiceService,
    public scroller: ViewportScroller) { }

  @Input() public network: any = JSON.stringify({ 'nodes': [] });
  public config: any = { "showSidebar": false, "identifier": "symbol", "title": "Protein interaction network of selected bicluster", "nodeShadow": true, "edgeShadow": false, "autofillEdges": true, "showLegend": true, "showFooter": false, "showOverview": false, "showQuery": false, "showItemSelector": false, "showAdvAnalysis": false, "showSelection": false, "showTasks": false, "showLegendEdges": false, "physicsOn": true , "interactionProteinProtein":"NeDRex"};

  ngOnInit(): void {
    this.resultService._biclusterSelectedNetwork$.subscribe((biclusters: Bicluster[]) => {
      this.updateNetwork(biclusters);
    });
  }

  public updateNetwork(biclusters: Bicluster[]) {
    const nodeGroups: any = {};
    const nodeList: any[] = [];
    for (let i: number = 0; i < biclusters.length; i++) {
      const bicluster = biclusters[i];
      const biclusterName = `Bicluster ${i+1}`;
      // only 20 colors, repeat colors if more than 20 biclusters are selected
      const color = this.biclusterColors.length > i ? this.biclusterColors[i] : this.biclusterColors[i - this.biclusterColors.length];
      nodeGroups[biclusterName] = { "type": "Protein", "color": color, "groupName": biclusterName , 'shape': 'ellipse'};
      bicluster.genes.forEach((gene: string) => {
        nodeList.push({ 'id': gene, 'group': biclusterName });
      })
    }
    this.network = JSON.stringify({ 'nodes': nodeList });
    this.config.nodeGroups = nodeGroups;
    setTimeout(() => {
      this.scroller.scrollToAnchor('network');
    }, 100)
  }

}
