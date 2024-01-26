import { CacheStore } from './../interfaces/cache-store.interface';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, map, tap } from 'rxjs';
import { Country } from '../interfaces/country';
import { Region } from '../interfaces/region.type';

@Injectable({providedIn: 'root'})
export class CountriesService {

  private apiURL: string = 'https://restcountries.com/v3.1';

  public cacheStore: CacheStore = {
    byCapital: { term: '', countries: []},
    byCountries: { term: '', countries: []},
    byRegion: { region: '', countries: []},
  }

  constructor(private http: HttpClient) {
    this.loadFromLocalStorage();
   }

  private saveToLocalStorage()
  {
    localStorage.setItem('cacheStore', JSON.stringify(this.cacheStore));
  }

  private loadFromLocalStorage()
  {
    if(!localStorage.getItem('cacheStore')) return;

    this.cacheStore = JSON.parse(localStorage.getItem('cacheStore')!);
  }

  private getCountriesRequest( url: string ): Observable<Country[]>
  {
    return this.http.get<Country[]>(url)
      .pipe(catchError( error => {
        console.log(error);
        return of([]); // ATRAPA EL ERROR Y REGRESA UN ARREGLO VACIO EN LUGAR DEL ERROR
      }),
      //delay(2000)
    );
  }

  searchCountryByAlphaCode( code: string ): Observable<Country | null>
  {
    const url = `${ this.apiURL }/alpha/${ code }`;
    return this.http.get<Country[]>( url )
      .pipe(
        map( countries => countries.length > 0 ? countries[0]: null),
        catchError( error => {
          console.log(error);
          return of(null);
      } ));
  }

  searchCapital( term: string ): Observable<Country[]>
  {
    const url = `${ this.apiURL }/capital/${ term }`;
    return this.getCountriesRequest(url)
      .pipe(
        //tap( countries => this.cacheStore.byCapital.countries = countries)
        //tap( countries => this.cacheStore.byCapital = {term: term, countries: countries})
        tap( countries => this.cacheStore.byCapital = {term, countries}),
        tap( () => this.saveToLocalStorage())
      );

  }

  searchRegion( region: Region ): Observable<Country[]>
  {
    const url = `${ this.apiURL }/region/${ region }`;
    return this.getCountriesRequest(url)
      .pipe(
        tap( countries => this.cacheStore.byRegion = {region, countries}),
        tap( () => this.saveToLocalStorage())
      );
  }

  searchCountry( term: string ): Observable<Country[]>
  {
    const url = `${ this.apiURL }/name/${ term }`;
    return this.getCountriesRequest(url)
      .pipe(
        tap( countries => this.cacheStore.byCountries = {term, countries}),
        tap( () => this.saveToLocalStorage())
      );
  }

}
