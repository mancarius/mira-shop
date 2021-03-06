import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonServiceModuleStub } from 'src/test/CommonServiceModuleStub';
import { AppComponent } from './app.component';
import { ErrorHandlerService } from './services/error-handler.service';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, CommonServiceModuleStub],
      declarations: [AppComponent],
      providers: [
        { provide: ErrorHandlerService, useValue: { add: () => {} } },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'mira-shop'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('mira-shop');
  });
});
