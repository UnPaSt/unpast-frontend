import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingComponent } from './pages/landing/landing.component';
import { ParametersComponent } from './components/parameters/parameters.component';
import { FileUploadModule } from 'ng2-file-upload';
import { NavbarComponent } from './components/navbar/navbar.component';
import { PreviousAnalysesComponent } from './pages/landing/components/previous-analyses/previous-analyses.component';
import { StartTaskComponent } from './pages/landing/components/start-task/start-task.component';
import { ResultComponent } from './pages/result/result.component';
import { HeatmapComponent } from './pages/result/components/heatmap/heatmap.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { ExamplesComponent } from './pages/landing/components/examples/examples.component';
import { ModalComponent } from './components/modal/modal.component';
import { FileFormComponent } from './components/parameters/file-form/file-form.component';
import { HttpClientModule } from "@angular/common/http";
import { BiclusterTableComponent } from './pages/result/components/bicluster-table/bicluster-table.component';
import { DrugstoneComponent } from './pages/result/components/drugstone/drugstone.component';
import { ClipboardButtonComponent } from './components/clipboard-button/clipboard-button.component';


@NgModule({
    declarations: [
        AppComponent,
        LandingComponent,
        ParametersComponent,
        NavbarComponent,
        PreviousAnalysesComponent,
        StartTaskComponent,
        ResultComponent,
        HeatmapComponent,
        ExamplesComponent,
        ModalComponent,
        FileFormComponent,
        BiclusterTableComponent,
        DrugstoneComponent,
        ClipboardButtonComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FileUploadModule,
        FormsModule,
        DataTablesModule,
        HighchartsChartModule,
        NgbModule,
        ReactiveFormsModule,
        HttpClientModule
    ],
    providers: [],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
}
