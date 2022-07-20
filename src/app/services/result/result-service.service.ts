import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Bicluster } from 'src/app/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ResultServiceService {

  public selectedBiclusters: any = {};
  public heatmapIsLoading = false;
  public heatmapDataLoaded = false;
  public showHeatmap = false;
  public showNetwork = false;

  constructor() { }

  private _biclusterSelectedHeatmap = new Subject<Bicluster[]>();
  private _biclusterSelectedNetwork = new Subject<Bicluster[]>();

  get _biclusterSelectedHeatmap$() {
    return this._biclusterSelectedHeatmap.asObservable();
  }

  get _biclusterSelectedNetwork$() {
    return this._biclusterSelectedNetwork.asObservable();
  }

  public selectBicluster(id: string, bicluster: Bicluster) {
    this.selectedBiclusters[id] = bicluster;
  }

  public removeBicluster(id: string) {
    delete this.selectedBiclusters[id];
  }

  public triggerBiclusterSelectionHeatmap() {
    this._biclusterSelectedHeatmap.next(Object.values(this.selectedBiclusters));
  }

  public triggerBiclusterSelectionNetwork() {
    this._biclusterSelectedNetwork.next(Object.values(this.selectedBiclusters));
  }

}
