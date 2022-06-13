import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingComponent } from './pages/landing/landing.component';
import { ParametersComponent } from './components/parameters/parameters.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { FileUploadModule } from 'ng2-file-upload';
import { NavbarComponent } from './components/navbar/navbar.component';
import { PreviousAnalysesComponent } from './components/previous-analyses/previous-analyses.component';
import { StartTaskComponent } from './components/start-task/start-task.component';
import { ResultComponent } from './pages/result/result.component';
import { HeatmapComponent } from './components/heatmap/heatmap.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { ExamplesComponent } from './components/examples/examples.component';


@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    ParametersComponent,
    FileUploadComponent,
    NavbarComponent,
    PreviousAnalysesComponent,
    StartTaskComponent,
    ResultComponent,
    HeatmapComponent,
    ExamplesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FileUploadModule,
    FormsModule,
    DataTablesModule,
    HighchartsChartModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
