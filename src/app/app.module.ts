import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { TimelineService } from './services/timeline.service';
import { UserService } from './services/user.service';
import { HomeComponent } from './home/home.component';
import { ExploreComponent } from './explore/explore.component';
import { NavigationComponent } from './navigation/navigation.component';
import { AccountService } from './services/account.service';

// add routing

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    HomeComponent,
    ExploreComponent,
  ],
  imports: [BrowserModule, FormsModule],
  providers: [AccountService, UserService, TimelineService],
  bootstrap: [AppComponent],
})
export class AppModule {}
