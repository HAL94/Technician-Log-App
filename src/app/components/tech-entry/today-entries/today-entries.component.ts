import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-today-entries',
  templateUrl: './today-entries.component.html',
  styleUrls: ['./today-entries.component.css']
})
export class TodayEntriesComponent implements OnInit {
  techEntryTableRequest = 'TodaysEntries';

  constructor() { }

  ngOnInit() {
  }

}
