import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Bicluster } from 'src/app/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ResultServiceService {

  public selectedBiclusters: any = {};
  public heatmapIsLoading = false;

  constructor() { }

  private _biclusterSelected = new Subject<Bicluster[]>();

  get _biclusterSelected$() {
    return this._biclusterSelected.asObservable();
  }

  public selectBicluster(id: string, bicluster: Bicluster) {
    this.selectedBiclusters[id] = bicluster;
    this.triggerBiclusterSelection();
  }

  public removeBicluster(id: string) {
    delete this.selectedBiclusters[id];
    this.triggerBiclusterSelection();
  }

  public triggerBiclusterSelection() {
    this._biclusterSelected.next(Object.values(this.selectedBiclusters));
  }

}
