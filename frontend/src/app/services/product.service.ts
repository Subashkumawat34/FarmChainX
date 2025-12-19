import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private apiUrl = '/api';

    constructor(private http: HttpClient) { }

    uploadProduct(formData: FormData): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/products/upload`, formData);
    }

    getMyProducts(page: number = 0, size: number = 9): Observable<any> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());
        return this.http.get<any>(`${this.apiUrl}/products/my`, { params });
    }

    getMarketProducts(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/products/market`);
    }
}
