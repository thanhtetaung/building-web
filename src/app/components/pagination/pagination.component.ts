import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {

  @Input() page = 1;
  @Input() recordPerPage = 10;
  @Input() totalRecord = 0;
  @Output('pageChanged') pageChangedEvent = new EventEmitter<number>();

  constructor() { }

  ngOnInit() {
  }

  pageChanged(page: number) {
    this.pageChangedEvent.emit(page);
  }


}
