import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, Subscription, debounceTime } from 'rxjs';

@Component({
  selector: 'shared-search-box',
  templateUrl: './search-box.component.html',
  styles: ``
})
export class SearchBoxComponent implements OnInit, OnDestroy{

  private debouncer: Subject<string> = new Subject<string>(); //TIPO ESPECIAL DE OBSERVABLE, COMO CREAR UNO MANUAL

  private debouncerSuscription?: Subscription;

  @Input()
  public initialValue: string = "";

  @Input()
  public placeholder: string = "";

  @Output()
  public onValue: EventEmitter<string> = new EventEmitter();

  @Output()
  public onDebounce: EventEmitter<string> = new EventEmitter();

  ngOnInit(): void {
    this.debouncerSuscription = this.debouncer
      .pipe(
        debounceTime(1000) //CUANDO EL USUARIO DEJA UN SEGUNDO DE EMITIR VALORES, SE LANZA EL VALOR AL EMITER
      )
      .subscribe(value => {
        this.onDebounce.emit( value );
      })
  }

  ngOnDestroy(): void {

    //this.debouncer.unsubscribe();
    this.debouncerSuscription?.unsubscribe();
  }

  emitValue( value:string ):void {
    this.onValue.emit( value );
  }

  onKeyPress( serchTerm: string )
  {
    this.debouncer.next( serchTerm );
  }
}
