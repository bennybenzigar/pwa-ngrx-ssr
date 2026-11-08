import { Component, inject } from '@angular/core';
import { counterStore } from '../../store/counter.store';

@Component({
  imports: [],
  selector: 'app-counter',
  styleUrl: './counter.scss',
  templateUrl: './counter.html',
})
export class Counter {

  readonly store = inject(counterStore)
}
