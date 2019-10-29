import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {DataService} from '../services/data.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {

  imgFile: File;
  desc: string;
  constructor(
    private _http: HttpClient,
    private _ds: DataService
  ) { }

  ngOnInit() {
  
  }

  fileUpload(event){
    this.imgFile = event.target.files[0];
    console.log(this.imgFile);
  
  }

  hit(){
    console.log(this.imgFile);
    this._ds.uploadFile(this.imgFile, this.desc)
    .subscribe(resp=> console.log(resp))
  }
}
