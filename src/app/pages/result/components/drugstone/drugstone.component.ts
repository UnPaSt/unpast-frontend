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

  constructor(
    public resultService: ResultServiceService,
    public scroller: ViewportScroller) { }

  @Input() public network: any = JSON.stringify({'nodes': []});

  ngOnInit(): void {
    this.resultService._biclusterSelectedNetwork$.subscribe((biclusters: Bicluster[]) => {
      this.updateNetwork(biclusters);
    });
  }

  public updateNetwork(biclusters: Bicluster[]) {
    const selectedGenes = Object.values(biclusters).map(bicluster => bicluster.genes);
    const selectedGenesUnique = [...new Set(selectedGenes.flat(1))];
    const nodeList: any[] = [];
    selectedGenesUnique.forEach((gene: string) => {
      nodeList.push({'id': gene, 'group': 'Protein'});
    })
    this.network = JSON.stringify({'nodes': nodeList});
    setTimeout(() => {
      this.scroller.scrollToAnchor('network');
    }, 100)
  }
}
