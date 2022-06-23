import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import { lastValueFrom } from 'rxjs';
import { BackendControllerService } from 'src/app/services/backend-controller/backend-controller.service';


@Component({
    selector: 'app-file-form',
    templateUrl: './file-form.component.html',
    styleUrls: ['./file-form.component.scss']
})
export class FileFormComponent implements OnInit {

    @Output() idChange: EventEmitter<string> = new EventEmitter();
    // @ts-ignore
    form: FormGroup;
    fileIsUploaded = false;
    id = "";
    file = {name:''};
    isUploading = false;


    constructor(public fb: FormBuilder, private http: HttpClient, private backend: BackendControllerService) {
    }

    ngOnInit() {
        this.form = this.fb.group({
            file: ['']
        });
    }

    public selectFile({event}: { event: any }) {
        if (event.target.files.length > 0) {
            this.file = event.target.files[0];
            console.log(this.file)
        }
    }

    public async upload() {
        this.isUploading = true;
        const formData: any = new FormData();
        formData.append("file", this.file, this.file.name);
        const response = await this.backend.uploadFile(formData);
        // @ts-ignore
        this.idChange.emit(response.id);
        this.fileIsUploaded = true;
        this.isUploading = false;
    }

}
