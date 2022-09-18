import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface objectQuery {
  limit?: number;
  offset?: number;
  query?: string;
}

@Injectable({
  providedIn: 'root',
})
export class GiphyService {
  API_KEY = '3ToYZX8B6rFtay0LGE6yU99x7HiFyFRP';
  BASE_URL = 'https://api.giphy.com/v1/gifs';
  constructor(private http: HttpClient) {}

  getTrendingGifs(objQuery?: objectQuery): Observable<any> {
    const { limit = 10, offset } = objQuery || {};
    let query = `${this.BASE_URL}/trending?api_key=${this.API_KEY}&limit=${limit}`;
    if (offset) {
      query += `&offset=${offset}`;
    }
    return this.http.get(query);
  }

  searchGifs(query: string, limit = 20): Observable<any> {
    return this.http.get(
      `${this.BASE_URL}/search?api_key=${this.API_KEY}&q=${query}&limit=${limit}`
    );
  }

  getGifById(id: number): Observable<any> {
    return this.http.get(`${this.BASE_URL}/${id}`);
  }
}
