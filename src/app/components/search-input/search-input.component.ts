import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss']
})
export class SearchInputComponent implements OnInit {

  @Output() onSearch = new EventEmitter();
  public value: string = '';

  constructor() { }

  ngOnInit(): void {
  }

  public send() {
    if (this.value.length > 0) {
      this.onSearch.emit(this.value);
    }
  }

}
