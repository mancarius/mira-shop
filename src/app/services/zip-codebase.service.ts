import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ZipCodebaseResponse } from '../shared/interfaces/zip-codebase-response';
import { ZipCodebaseAddress } from '../shared/interfaces/zip-codebase-address';

@Injectable({
  providedIn: 'root',
})
export class ZipCodebaseService {
  private _cache = new Map<string, string>();
  private _apiEndpoint: string = environment.zipcodebase.endpoint;
  private _apikey: string = environment.zipcodebase.apikey;
  private _httpOptions = {
    observe: 'body' as const,
    responseType: 'json' as const,
  };

  constructor(private _http: HttpClient) {}

  public async find(
    zip: number,
    countryCode: string
  ): Promise<ZipCodebaseResponse> {
    const url = `${this._apiEndpoint}/search?apikey=${this._apikey}&codes=${zip}&country=${countryCode}`;
    let response: ZipCodebaseResponse | undefined;

    if (this._isInCache(zip + countryCode)) {
      return Promise.resolve(this._getFromCache(zip + countryCode));
    }

    try {
      response = await this._http
        .get<ZipCodebaseResponse>(url, this._httpOptions)
        .toPromise();
    } catch (err) {
      throw err;
    }

    this._saveInCache(zip + countryCode, response);

    return response;
  }

  private _isInCache(key: string): boolean {
    return this._cache.has(key);
  }

  private _saveInCache(key: string, response: ZipCodebaseResponse): void {
    this._cache.set(key, JSON.stringify(response));
  }

  private _getFromCache(key: string): ZipCodebaseResponse {
    const value = this._cache.get(key);
    if (value) {
      try {
        return JSON.parse(value);
      } catch (err) {
        throw err;
      }
    } else {
      throw new Error('Cache returns udefined.');
    }
  }

  public async getCities(
    zip: number,
    countryCode: string
  ): Promise<ZipCodebaseAddress['city'][]> {
    let response: ZipCodebaseResponse;
    try {
      response = await this.find(zip, countryCode);
    } catch (err) {
      throw err;
    }

    const addresses: ZipCodebaseAddress[] = response.results?.[zip];

    return addresses?.map((address) => address.city) || [];
  }

  public async getProvince(
    zip: number,
    countryCode: string
  ): Promise<ZipCodebaseAddress['province'] | null> {
    let response: ZipCodebaseResponse;
    try {
      response = await this.find(zip, countryCode);
    } catch (err) {
      throw err;
    }

    const address: ZipCodebaseAddress | undefined =
      response.results?.[zip]?.shift();

    return address?.province || null;
  }
}
