import { Component } from '@angular/core';
import { ErrorHandlerService } from './services/error-handler.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'mira-shop';
  constructor(private errorHandler: ErrorHandlerService) {}

  ngOnInit() {
    if (!navigator.onLine) {
      this.errorHandler.add('Houston, we are offline!');
    }
  }
}
