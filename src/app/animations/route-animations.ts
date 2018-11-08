import {animate, style, transition, trigger} from '@angular/animations';

export const routeStateTrigger = trigger('routeState', [
  transition(':enter', [
    style({
      opacity: 0
    }),
    animate(150)
  ])
]);

