import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ErrorHandlerService } from './services/error-handler.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'MiraShop';
  constructor(private _error: ErrorHandlerService, private _route: ActivatedRoute) {}

  ngOnInit() {
    if (!navigator.onLine) {
      this._error.add('browser offline').and.showMessage('Houston, we are offline!');
    }
  }
}
