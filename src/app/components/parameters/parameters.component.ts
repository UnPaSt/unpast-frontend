import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {TaskService} from 'src/app/services/task/task.service';
import { BinarizationAlgorithm, ClusteringAlgorithm, TaskParameters } from 'src/app/interfaces';
import { FormControl } from '@angular/forms';


@Component({
    selector: 'app-parameters',
    templateUrl: './parameters.component.html',
    styleUrls: ['./parameters.component.scss']
})
export class ParametersComponent implements OnInit {

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

    public _louvainSimilarityCutoff: number = -1;
    @Input() public set louvainSimilarityCutoff(value: number) {
        this._louvainSimilarityCutoff = value;
        this._louvainSimilarityCutoffDisplayed = value
        if (this._louvainSimilarityCutoff == -1) {
            this.louvainSimilarityCutoffAutomatic = true;
            this.validateLouvainSimilarityCutoffAutomaticChange();
        }
    }

    @Input() public email: string = '';
    @Input() public alreadyOnServer = false;
    @Input() public bidirectional = false; // if checked, directions = ["BOTH"], else directions = ["UP","DOWN]
    @Input() public ceiling: number = 3; // ceiling for z-scores to reduce outliers; can be >= 0
    @Input() public louvainSimilarityCutoffAutomatic = false;

    ngOnInit(): void {
        this.louvainSimilarityCutoff = this._louvainSimilarityCutoff;
    }

    public paramtersValid = true;
    public isSubmitting = false;
    public _louvainSimilarityCutoffBeforeAuto: number = -1;
    public _louvainSimilarityCutoffDisplayed: number = 0

    public validateParameters() {
        console.log(this.taskForm.nativeElement.classList);
        console.log(this.taskForm.nativeElement.classList.contains('ng-valid'));
        this.paramtersValid = this.taskForm.nativeElement.classList.contains('ng-valid');
    }

    public validateEmail(email: string) {
        const res = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return res.test(String(email).toLowerCase());
    }

    public getRequestData(): TaskParameters {
        return {
            id: this.fileId,
            name: this.name,
            seed: this.seed,
            alpha: this.alpha,
            pValue: this.pValue,
            binarization: this.selectedBinarizationMethod,
            clustering: this.selectedClusteringMethod,
            r: this._louvainSimilarityCutoff,
            dch: this.dynamicTreeCut,
            ds: this.deepSplit,
            mail: this.email,
            exprs: this.fileName,
            directions: this.bidirectional ? ["DOWN", "UP"] : ["BOTH"],
            ceiling: this.ceiling
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
            this._louvainSimilarityCutoffBeforeAuto = this._louvainSimilarityCutoff;
            this._louvainSimilarityCutoffDisplayed = 0;
            this._louvainSimilarityCutoff = -1;
        } else {
            this.louvainSimilarityCutoff = this._louvainSimilarityCutoffBeforeAuto >= 0 && this._louvainSimilarityCutoffBeforeAuto <= 1 ? this._louvainSimilarityCutoffBeforeAuto : 0.5;
        }

    }

}
