import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {TaskService} from 'src/app/services/task/task.service';
import { BinarizationAlgorithm, ClusteringAlgorithm, TaskParameters } from 'src/app/interfaces';

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
    @Input() public seed: number = Math.floor(Math.random() * 100);
    @Input() public alpha: number = 0.5;
    @Input() public pValue: number = 0.001;
    @Input() public selectedBinarizationMethod: BinarizationAlgorithm = 'GMM';
    @Input() public selectedClusteringMethod: ClusteringAlgorithm = 'Louvain';
    @Input() public r: number = 0.3;
    @Input() public email: string = '';
    @Input() public alreadyOnServer = false;

    public paramtersValid = true;

    ngOnInit(): void {
    }

    public validateParameters() {
        this.paramtersValid = this.taskForm.nativeElement.classList.contains('ng-valid');
    }

    public validateEmail(email: string) {
        const res = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return res.test(String(email).toLowerCase());
    }

    public getRequestData(): TaskParameters {
        return {
            id: this.fileId,
            seed: this.seed,
            alpha: this.alpha,
            pValue: this.pValue,
            binarization: this.selectedBinarizationMethod,
            clustering: this.selectedClusteringMethod,
            r: this.r,
            mail: this.email,
            exprs: this.fileName
        }
    }

    public async submit() {
        const taskId = await this.taskService.submitTask(this.getRequestData());
        this.taskService.triggerLandingPageFeedback(taskId);
    }

    public setFileId(id: string) {
        this.fileId = id;
    }

}
