import { Component, VERSION, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';

import { combineLatest, fromEvent } from 'rxjs';
import { startWith, map, distinctUntilChanged, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  name = 'Angular ' + VERSION.major;
  @ViewChildren('discountInput', { read: ElementRef } ) discountInputs: QueryList<ElementRef>;
  r = [1, 2, 3, 4, 5];
  output: string[];

  ngAfterViewInit(): void {
    combineLatest(
      this.discountInputs.map(discountInput => 
        fromEvent(discountInput.nativeElement, 'keyup').pipe(
          distinctUntilChanged((prev: KeyboardEvent, curr: KeyboardEvent) => {  // doesn't work yet
            return prev.target.value !== curr.target.value;
          }),
          startWith(null)
        )
      )
    ).pipe(
      map((events: any) => {
        return events.map(event => {
          if (event) {
            return event.target.value;
          } else {
            return event;
          }
        });
      }),
      debounceTime(300)
    ).subscribe((texts: string[]) => {
      if (texts.some(text => text)) {
        this.output = texts;
        console.log(texts);
      }
    });
  }
}
