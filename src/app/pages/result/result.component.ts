import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Bicluster, Task } from 'src/app/interfaces';
import { TaskService } from 'src/app/services/task/task.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {

  public key: string = '';
  public taskData: Task = {
    id: '',
    status: '',
    query: {
      id: '',
      seed: 0,
      alpha: 0,
      pValue: 0,
      binarization: 'GMM',
      clustering: 'DESMOND',
      r: 0,
      mail: ''
    },
  };
  public allSamples: Set<string> = new Set();
  public allGenes: Set<string> = new Set();

  constructor(public taskService: TaskService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.key = params['key'];
      this.taskService.getTask(this.key).then(response => {
        this.taskData = response;
        
        this.extractFeatureSpace();
      });
    })
  }



  public extractFeatureSpace() {
    if (!this.taskData?.result) {
      return
    }
    Object.values(this.taskData.result).forEach((bicluster: Bicluster) => {
      console.log(bicluster)
      bicluster.samples.map((sample: string) => {
        if (!this.allSamples.has(sample)) {
          this.allSamples.add(sample)
        }
      })
      bicluster.genes.map((gene: string) => {
        if (!this.allGenes.has(gene)) {
          this.allGenes.add(gene)
        }
      })
    })
  }



}
