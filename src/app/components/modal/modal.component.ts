import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ViewportScroller } from "@angular/common";


@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  @ViewChild('modalContainer') modalContainer!: NgbModal;

  public _open = false;
  get open(): boolean {
    return this._open;
  }
  @Input() set open(value: boolean) {
    console.log('do we see this? open value', value)
    this._open = value;
    if (this._open) {
      this.openModal()
    }
  }
  @Input() callbackScrollId!: string;
  @Input() title!: string;
  @Input() buttonLabel!: string;
  @Input() content!: string;

  @Output() updateOpen: EventEmitter<boolean> = new EventEmitter<boolean>();

  closeResult = '';

  constructor(private modalService: NgbModal, public scroller: ViewportScroller) { }

  ngOnInit(): void {
  }

  openModal() {
    console.log('this.modalService', this.modalService);
    this.modalService.open(this.modalContainer, { ariaLabelledBy: 'modal-title', centered: true }).result.then((result) => {
      this.updateOpen.emit(false)
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  public closeModalButton() {
    if (this.callbackScrollId) {
      this.callbackScroll(this.callbackScrollId);
    }
  }

  public callbackScroll(elementId: string) {
    this.scroller.scrollToAnchor(elementId);
  }

  private getDismissReason(reason: any): string {
    this.updateOpen.emit(false)

    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}
