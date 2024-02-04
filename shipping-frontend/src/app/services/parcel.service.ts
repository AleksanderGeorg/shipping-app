import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ParcelService {
  private baseUrl = 'http://localhost:3000/parcels';

  constructor(private http: HttpClient) {}

  addParcel(parcel: any): Observable<any> {
    return this.http.post(this.baseUrl, parcel);
  }

  getParcels(filterParams: any, page: number): Observable<any[]> {
    Object.keys(filterParams).forEach(
      (key) => filterParams[key] === '' && delete filterParams[key]
    );
    return this.http.get<any[]>(this.baseUrl, {
      params: {
        ...filterParams,
        page,
      },
    });
  }
}
