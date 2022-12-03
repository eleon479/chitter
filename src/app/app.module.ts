import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { TimelineService } from './services/timeline.service';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from '../environments/environment';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireAuthGuardModule } from '@angular/fire/compat/auth-guard';

import {
  AngularFireAnalyticsModule,
  APP_NAME,
  APP_VERSION,
  DEBUG_MODE as ANALYTICS_DEBUG_MODE,
  ScreenTrackingService,
  UserTrackingService,
  COLLECTION_ENABLED,
} from '@angular/fire/compat/analytics';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // for firestore
    AngularFireAnalyticsModule,
    AngularFireAuthModule,
    AngularFireAuthGuardModule,
  ],
  providers: [TimelineService, UserTrackingService, ScreenTrackingService],
  bootstrap: [AppComponent],
})
export class AppModule {}
