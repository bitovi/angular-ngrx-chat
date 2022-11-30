import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginModule } from './login/login.module';
import { StoreModule } from '@ngrx/store';
import * as fromLogin from './store/login/login.reducer';
import { EffectsModule } from '@ngrx/effects';
import { LoginEffects } from './store/login/login.effects';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, LoginModule, StoreModule.forFeature(fromLogin.loginFeatureKey, fromLogin.reducer), EffectsModule.forFeature([LoginEffects])],
  bootstrap: [AppComponent],
})
export class AppModule {}
