import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { BackendControllerService } from 'src/app/services/backend-controller/backend-controller.service';


@Component({
    selector: 'app-file-form',
    templateUrl: './file-form.component.html',
    styleUrls: ['./file-form.component.scss']
})
export class FileFormComponent implements OnInit {

    @Output() idChange: EventEmitter<string> = new EventEmitter();
    // @ts-ignore
    form: UntypedFormGroup;
    @Input() fileIsUploaded = false;
    @Input() id = '';
    file = { name: '', size: 0 };
    isUploading = false;
    displayedFileName = '';
    @Input() set fileName(displayedFileName: string) {
        this.displayedFileName = displayedFileName;
    }


    constructor(public fb: UntypedFormBuilder, private backend: BackendControllerService) {
    }

    ngOnInit() {
        this.form = this.fb.group({
            file: ['']
        });
    }

    private MAX_FILE_SIZE = 200; //MB

    public fileTooLargeAlert = false;
    public fileTypeWrongAlert = false;

    public selectFile({ event }: { event: any }) {
        if (event.target.files.length > 0) {
            this.file = event.target.files[0];

            const size = this.file.size / 1024 / 1024; //MB
            if (size > this.MAX_FILE_SIZE) {
                this.fileTooLargeAlert = true;
                return
            } else {
                this.fileTooLargeAlert = false
            }

            if (!(this.file.name.endsWith('.tsv') || this.file.name.endsWith('.txt') || this.file.name.endsWith('.gzip') || this.file.name.endsWith('.gz'))) {
                this.fileTypeWrongAlert = true;
                return
            } else {
                this.fileTypeWrongAlert = false
            }

            this.displayedFileName = this.file.name;
        }
    }

    public async upload() {
        this.isUploading = true;
        const formData: any = new FormData();
        formData.append("file", this.file, this.file.name);
        const response = await this.backend.uploadFile(formData);
        this.idChange.emit(response.id);
        this.fileIsUploaded = true;
        this.isUploading = false;
    }

    public resetFile() {
        this.id = '';
        this.fileIsUploaded = false;
        this.file = { name: '', size: 0 };
        this.displayedFileName = '';
        this.idChange.emit('');
    }

    public async delete() {
        if (!confirm('This will delete the uploaded file for all tasks. Do you want to continue?')) {
            return
          }
        if (this.fileIsUploaded) {
            await this.backend.deleteFile(this.id);
        }
        this.resetFile();
    }

}
