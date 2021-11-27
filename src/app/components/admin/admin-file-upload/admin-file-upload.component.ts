import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-admin-file-upload',
  templateUrl: './admin-file-upload.component.html',
  styleUrls: ['./admin-file-upload.component.scss'],
})
export class AdminFileUploadComponent implements OnInit, OnDestroy {
  isConverting = false;
  isUploading = false;
  file: File | null = null;
  invalidFile = { is: false, message: '' };

  radioControl = new FormControl('merge');

  constructor() {}

  ngOnInit(): void {}

  readFile(input: any): void {
    console.log(input.target.files);
    const tmpFile = input.target?.files[0];
    const fileType = tmpFile?.type;

    if (fileType !== 'application/vnd.ms-excel') {
      this.invalidFile = {
        is: true,
        message: 'Invalid format. Only .csv files are accepted',
      };
      return;
    }

    if (tmpFile.size > 0) {
      this.file = tmpFile;
      this.invalidFile.is = false;
    } else {
      this.invalidFile = {
        is: true,
        message: 'This file is empty',
      };
    }
  }

  removeFile(): void {
    this.file = null;
  }

  convert(): void {
    this.isConverting = true;
  }

  upload(): void {
    this.isUploading = true;
  }

  abort(): void {}

  ngOnDestroy() {
    console.log('dialog is destroing');
  }
}