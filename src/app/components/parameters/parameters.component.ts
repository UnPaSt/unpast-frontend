import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {TaskService} from 'src/app/services/task/task.service';
import { BinarizationAlgorithm, ClusteringAlgorithm, TaskParameters } from 'src/app/interfaces';
import { FormControl } from '@angular/forms';


@Component({
    selector: 'app-parameters',
    templateUrl: './parameters.component.html',
    styleUrls: ['./parameters.component.scss']
})
export class ParametersComponent {

    @ViewChild('inputEmail') inputEmail!: ElementRef;
    @ViewChild('taskForm') taskForm!: ElementRef;

    constructor(public taskService: TaskService) {
    }

    @Input() public fileName: string = "";
    @Input() public fileId: string = "";
    @Input() public name: string = "";
    @Input() public seed: number = 101;
    @Input() public alpha: number = 0.5;
    @Input() public deepSplit: 0 | 1 | 2 | 3 | 4 = 3;
    @Input() public dynamicTreeCut: number = 0.995;
    @Input() public pValue: number = 0.01;
    @Input() public selectedBinarizationMethod: BinarizationAlgorithm = 'kmeans';
    @Input() public selectedClusteringMethod: ClusteringAlgorithm = 'WGCNA';
    @Input() public louvainSimilarityCutoff: number = 0;
    @Input() public email: string = '';
    @Input() public alreadyOnServer = false;
    @Input() public bidirectional = false; // if checked, directions = ["BOTH"], else directions = ["UP","DOWN]
    @Input() public ceiling: number = 3; // ceiling for z-scores to reduce outliers; can be >= 0
    @Input() public louvainSimilarityCutoffAutomatic = true;


    public paramtersValid = true;
    public isSubmitting = false;
    public _louvainSimilarityCutoffBeforeAuto: number = -1;

    public validateParameters() {
        this.paramtersValid = this.taskForm.nativeElement.classList.contains('ng-valid');
    }

    public validateEmail(email: string) {
        const res = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return res.test(String(email).toLowerCase());
    }

    public getRequestData(): TaskParameters {
        console.log({
            id: this.fileId,
            name: this.name,
            seed: this.seed,
            alpha: this.alpha,
            pValue: this.pValue,
            binarization: this.selectedBinarizationMethod,
            clustering: this.selectedClusteringMethod,
            r: this.louvainSimilarityCutoff,
            dch: this.dynamicTreeCut,
            ds: this.deepSplit,
            mail: this.email,
            exprs: this.fileName
        })
        return {
            id: this.fileId,
            name: this.name,
            seed: this.seed,
            alpha: this.alpha,
            pValue: this.pValue,
            binarization: this.selectedBinarizationMethod,
            clustering: this.selectedClusteringMethod,
            r: this.louvainSimilarityCutoff,
            dch: this.dynamicTreeCut,
            ds: this.deepSplit,
            mail: this.email,
            exprs: this.fileName
        }
    }

    public async submit() {
        this.isSubmitting = true;
        const taskId = await this.taskService.submitTask(this.getRequestData());
        this.taskService.triggerLandingPageFeedback(taskId);
        this.isSubmitting = false;
    }

    public setFileId(id: string) {
        this.fileId = id;
    }

    public validateLouvainSimilarityCutoffAutomaticChange() {
        if (this.louvainSimilarityCutoffAutomatic) {
            this._louvainSimilarityCutoffBeforeAuto = this.louvainSimilarityCutoff;
            this.louvainSimilarityCutoff = -1;
        } else {
            this.louvainSimilarityCutoff = this._louvainSimilarityCutoffBeforeAuto >= 0 && this._louvainSimilarityCutoffBeforeAuto <= 1 ? this._louvainSimilarityCutoffBeforeAuto : 0.5;
        }

    }

}
