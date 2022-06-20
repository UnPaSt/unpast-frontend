import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {HttpClient} from "@angular/common/http";


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
    URL = 'http://localhost:8001/upload_matrix';
    id = "";
    file = {name:''};


    constructor(public fb: FormBuilder, private http: HttpClient) {
    }

    ngOnInit() {
        this.form = this.fb.group({
            file: ['']
        });
    }

    upload({event}: { event: any }) {
        if (event.target.files.length > 0) {
            this.file = event.target.files[0];
        }
    }

    submit() {
        const formData: any = new FormData();
        formData.append("file", this.file, this.file.name);

        this.http.post(this.URL, formData).subscribe(
            (response) => {
                // @ts-ignore
                this.idChange.emit(response.id);
            },
            (error) => console.log(error)
        )
    }

}
