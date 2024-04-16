import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-gprofiler-button',
  templateUrl: './gprofiler-button.component.html',
  styleUrls: ['./gprofiler-button.component.scss']
})
export class GprofilerButtonComponent implements OnInit {

  @Input() public stringList: string[] = [];

  public justCopied = false;
  public iconTimeout = 1000; // ms

  constructor() { }

  ngOnInit(): void {
  }

  public linkToGprofiler(geneList: string[]) {
    // Input is whitespace-separated list of genes
    const genes = geneList.sort().join(' ');
    // &numeric_namespace=ENTREZGENE_ACC
    const link = `http://biit.cs.ut.ee/gprofiler/gost?organism=hsapiens&query=${genes}&ordered=false&all_results=false&no_iea=false&combined=false&measure_underrepresentation=false&domain_scope=annotated&significance_threshold_method=g_SCS&user_threshold=0.05&sources=GO:MF,GO:CC,GO:BP,KEGG,TF,REAC,MIRNA,HPA,CORUM,HP,WP&background=`;
    // open in new tab
    window.open(link, '_blank');
  }
}
