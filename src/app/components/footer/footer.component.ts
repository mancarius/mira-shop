import { Component, Input, OnInit } from '@angular/core';
import { AdminRoute } from 'src/app/shared/enums/admin-route';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  @Input() title: string = '';
  public adminRoute = AdminRoute;

  constructor() {}

  ngOnInit(): void {}
}
