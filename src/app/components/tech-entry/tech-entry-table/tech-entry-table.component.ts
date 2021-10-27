import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, PageEvent, MatDialog } from '@angular/material';
import { Router } from '@angular/router';

import { TechEntryService } from 'src/app/services/tech-entry.service';
import { TechEntry } from 'src/app/models/tech-entry.model';
import { Status } from 'src/app/models/status';
import { MatTableService } from 'src/app/services/mat-table.service';
import { Subscription } from 'rxjs';
import { SpinnerModalComponent } from '../../spinner-modal/spinner-modal.component';

@Component({
  selector: 'app-tech-entry-table',
  templateUrl: './tech-entry-table.component.html',
  styleUrls: ['./tech-entry-table.component.css']
})
export class TechEntryTableComponent implements OnInit, OnDestroy {
  @Input() techEntryTableQuery;

  techEntryTable: MatTableDataSource<any>;
  columns: string[] = ['actions', 'customerName', 'company',
  'department', 'location', 'deviceType', 'deviceSn', 'status'];
  filter: string;
  entrySubscription: Subscription;

  @ViewChild(MatSort) matSort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  pageSize = MatTableService.pageSize;
  pageSizeOptions = MatTableService.pageSizeOptions;
  currentPage = 0;
  totalEntries;

  constructor(private techentryService: TechEntryService,
    private router: Router,
    private matTableService: MatTableService,
    private matDialog: MatDialog) { }

  ngOnInit() {
    this.techentryService.getTechEntriesAPI(this.techEntryTableQuery,
      this.currentPage, this.pageSize);

    this.entrySubscription = this.techentryService
    .getEntriesUpdated()
    .subscribe(entryObj => {

      if (this.techEntryTable) {
        this.techEntryTable.data = entryObj.entries;
      } else {
        this.techEntryTable = this.matTableService.initTable(entryObj.entries, this.columns);
      }

      this.techEntryTable.sort = this.matSort;
      this.totalEntries = entryObj.totalEntries;

    });

  }


  onSearchClear(inputElement: HTMLInputElement) {
    inputElement.value = '';    
    this.techEntryTable.filter = inputElement.value;
  }

  filterTable(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.techEntryTable.filter = filterValue.trim().toLowerCase();
  }

  onEditNavigate(techentry: TechEntry) {
    this.router.navigate(['edit-entry', techentry.id]);
  }

  async onDelete(techEntry: TechEntry, index: number) {
    const dialogRef = this.matDialog.open(SpinnerModalComponent, {
      width: 'auto',
      height: 'auto'
    });
    await this.techentryService.deleteTechEntry(techEntry, index);
    dialogRef.close();
    if (this.techEntryTable.data.length === 0) {
      this.paginator.previousPage();
    }
  }

  setComplete(techEntry: TechEntry) {
    techEntry.status = Status.COMPLETE;
    const params = {params: { operationCause: 'statusUpdate' }};
    this.techentryService.updateTechEntry(techEntry, params);
  }

  onChangedPage(pageData: any) {
    this.currentPage = pageData.pageIndex;
    this.pageSize = pageData.pageSize;

    this.techentryService
    .getTechEntriesAPI(this.techEntryTableQuery,
      this.currentPage, this.pageSize);
  }

  ngOnDestroy() {
    this.entrySubscription.unsubscribe();
  }
}
