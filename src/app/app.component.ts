import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, ViewChild, OnInit } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { IGetRowsParams } from 'ag-grid-community';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public columnDefs: any[];
  public rowData: any[];
  public gridOptions: any;
  public info: string;
  @ViewChild('grid') grid: AgGridAngular;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.initializeGridSettings();
  }

  private initializeGridSettings() {
    this.columnDefs = [
      { headerName: 'Address', field: 'Address', filter: 'agTextColumnFilter' },
      { headerName: 'Email', field: 'Email', filter: 'agTextColumnFilter' },
      { headerName: 'Id', field: 'Id' },
      { headerName: 'Name', field: 'Name', filter: true }
    ];
    this.gridOptions = {
      filter: true,
      floatingFilter: true,
      quickFilterText: true,
      rowSelection: 'single',
      cacheBlockSize: 10,
      maxBlocksInCache: 1,
      enableServerSideFilter: true,
      rowModelType: 'infinite',
      pagination: true,
      paginationPageSize: 10
    };
  }

  private getRowData(startRow: number, endRow: number): Observable<any[]> {
    const params: HttpParams = new HttpParams()
      .append('skip', `${startRow}`)
      .append('top', `${endRow}`);
    return this.http.get(`/users`, { params }).pipe(map((res: any) => res));
  }

  onGridReady(params: any) {
    const datasource = {
      getRows: (getRowsParams: IGetRowsParams) => {
        this.getRowData(getRowsParams.startRow, getRowsParams.endRow)
          .subscribe(data => getRowsParams.successCallback(data));
      }
    };
    params.api.setDatasource(datasource);
  }

}
