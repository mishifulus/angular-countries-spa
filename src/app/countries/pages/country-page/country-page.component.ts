import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CountriesService } from '../../services/countries.service';
import { switchMap } from 'rxjs';
import { Country } from '../../interfaces/country';

@Component({
  selector: 'app-country-page',
  templateUrl: './country-page.component.html',
  styles: ``
})
export class CountryPageComponent implements OnInit{

  public country?: Country;

  constructor( private activateRoute: ActivatedRoute, private countriesService: CountriesService, private router: Router){} //PARA TRABAJAR CON LA URL

  ngOnInit(): void {
      //this.activateRoute.params.subscribe( (params) => { console.log({params: params['id']}) } ) //PARAMS ES ANY

      // this.activateRoute.params.subscribe( ({id}) => {
      //   this.countriesService.searchCountryByAlphaCode(id).subscribe( country => {
      //     console.log({country});
      //   });
      // }); //PARAMS ES ANY

      //this.activateRoute.params.subscribe( this.searchCountry );

      this.activateRoute.params
        .pipe(
          switchMap( ({ id }) => this.countriesService.searchCountryByAlphaCode(id)),
        ).subscribe(country => {
          if (!country)
          {
            return this.router.navigateByUrl('');
          }
          else
          {
            return this.country = country;
          }
        })
  }

  // searchCountry( params: Params)
  // {
  //   this.countriesService.searchCountryByAlphaCode(params['id']).subscribe( country => {console.log({country});});
  // }

}
