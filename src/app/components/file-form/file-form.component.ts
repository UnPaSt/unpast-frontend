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


    constructor(public fb: FormBuilder, private http: HttpClient) {
        this.form = this.fb.group({file: [null]})
    }

    ngOnInit() {
    }

    upload({event}: { event: any }) {
        // @ts-ignore
        const file = (event.target as HTMLInputElement).files[0];
        this.form.patchValue({
            file: file
        });
        // @ts-ignore
        this.form.get('file').updateValueAndValidity()
    }

    submit() {
        var formData: any = new FormData();
        // @ts-ignore
        formData.append("file", this.form.get('file').value);

        let headers = ["Content-Type: application/x-www-form-urlencoded"]

        // @ts-ignore
        this.http.post(this.URL, formData).subscribe(
            (response) => {
                // @ts-ignore
                this.idChange.emit(response.id);
            },
            (error) => console.log(error)
        )
    }

}
