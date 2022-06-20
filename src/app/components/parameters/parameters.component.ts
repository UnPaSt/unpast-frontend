import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {TaskService} from 'src/app/services/task/task.service';
import {HttpClient} from "@angular/common/http";

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

    public id: string = ""

    public seed: number = Math.floor(Math.random() * 100);
    public alpha: number = 0.5;
    public pValue: number = 0.001;
    public selectedBinarizationMethod: string = 'GMM';
    public selectedClusteringMethod: string = 'Louvain';
    public r: number = 0.3;
    public email: string = ''
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

    public getRequestData(): any {
        return {
            id: this.id,
            seed: this.seed,
            alpha: this.alpha,
            pValue: this.pValue,
            binarization: this.selectedBinarizationMethod,
            clustering: this.selectedClusteringMethod,
            r: this.r,
            mail: this.email
        }
    }

    public submit() {
        this.taskService.submitTask(this.getRequestData());
        this.taskService.triggerLandingPageFeedback();
    }

    public setID(id: string) {
        this.id = id
    }

}
