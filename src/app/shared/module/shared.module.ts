import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OauthComponent } from 'src/app/components/auth/login/oauth/oauth.component';
import { byteConverterPipe } from '../pipes/byteConverter.pipe';
import { TruncateTextPipe } from '../pipes/truncate-text.pipe';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [OauthComponent, byteConverterPipe, TruncateTextPipe],
  exports: [OauthComponent, byteConverterPipe, TruncateTextPipe],
  imports: [CommonModule, MatProgressSpinnerModule],
})
export class SharedModule {}
