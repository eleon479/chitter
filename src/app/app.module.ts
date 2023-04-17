import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { DmsComponent } from './dms/dms.component';
import { ExploreComponent } from './explore/explore.component';
import { HomeComponent } from './home/home.component';
import { NavigationComponent } from './navigation/navigation.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { NotisComponent } from './notis/notis.component';
import { ProfileComponent } from './profile/profile.component';
import { AccountService } from './services/account.service';
import { TimelineService } from './services/timeline.service';
import { UserService } from './services/user.service';

const appRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'explore', component: ExploreComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    HomeComponent,
    ExploreComponent,
    NotFoundComponent,
    NotisComponent,
    DmsComponent,
    ProfileComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(appRoutes, { enableTracing: true }),
  ],
  providers: [AccountService, UserService, TimelineService],
  bootstrap: [AppComponent],
})
export class AppModule {}
