import { Component } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';

// const URL = '/api/';
const URL = 'http://localhost:8001/upload_matrix';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {

  uploader: FileUploader;
  hasBaseDropZoneOver: boolean;
  hasAnotherDropZoneOver: boolean;
  response: string;
  fileIsUploaded = false;

  ngOnInit(): void {
  }
 
  constructor (){
    this.uploader = new FileUploader({
      url: URL,
      disableMultipart: true, // 'DisableMultipart' must be 'true' for formatDataFunction to be called.
      formatDataFunctionIsAsync: true,
      authTokenHeader: "",
      formatDataFunction: async (item: any) => {
        return new Promise( (resolve, reject) => {
          resolve({
            name: item._file.name,
            length: item._file.size,
            contentType: item._file.type,
            date: new Date()
          });
        });
      }
    });
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false};
 
    this.hasBaseDropZoneOver = false;
    this.hasAnotherDropZoneOver = false;

    this.response = '';
 
    this.uploader.response.subscribe( res => this.response = res );
  }
 
  public fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }
 
  public fileOverAnother(e:any):void {
    this.hasAnotherDropZoneOver = e;
  }

}
