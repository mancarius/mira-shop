import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AdminFileUploadComponent } from '../admin-file-upload.component';

@Component({
  selector: 'admin-file-upload-button',
  templateUrl: './admin-file-upload-button.component.html',
  styleUrls: ['./admin-file-upload-button.component.scss'],
})
export class AdminFileUploadButtonComponent implements OnInit {
  constructor(private _dialog: MatDialog) {}

  ngOnInit(): void {}

  open() {
    const dialogRef = this._dialog.open(AdminFileUploadComponent, {
      disableClose: true,
      maxWidth: 500,
      width: '90%',
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
