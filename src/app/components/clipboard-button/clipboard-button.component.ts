import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-clipboard-button',
  templateUrl: './clipboard-button.component.html',
  styleUrls: ['./clipboard-button.component.scss']
})
export class ClipboardButtonComponent implements OnInit {

  @Input() public stringList: string[] = [];

  public justCopied = false;
  public iconTimeout = 1000; // ms

  constructor() { }

  ngOnInit(): void {
  }

  public copyToClipboard(stringList: string[]) {
    // sort alphabetically and copy to clipboard
    navigator.clipboard.writeText(stringList.sort().join(','));
    this.justCopied = true;
    setTimeout(() => {
      this.justCopied = false;
    }, this.iconTimeout)
  }

}
