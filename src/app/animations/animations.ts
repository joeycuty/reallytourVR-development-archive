import {animate, style, transition, trigger, state} from '@angular/animations';

export const signinStateTrigger = trigger('signinState', [
  transition(':enter', [
    style({
      opacity: 0
    }),
    animate(300)
  ]),
  transition(':leave', animate(300, style({
    opacity: 0
  })))
]);


export const cardSlideTrigger = trigger('cardSlideState', [
  transition(':enter', [
    style({
      opacity: 0,
      transform: 'translateX(-50%)'
    }),
    animate(150)
  ])
]);


export const enterMessageTrigger = trigger('enterMessageState', [
  transition(':enter', [
    style({
      opacity: 0,
      transform: 'translateY(-50%)'
    }),
    animate(100)
  ]),
  transition(':leave', [
    animate(50, style({
      opacity: 0,
      transform: 'translateY(-100%)'
    }))
  ])
]);

export const enterMessageSlowTrigger = trigger('enterMessageSlowState', [
  transition(':enter', [
    style({
      opacity: 0,
      transform: 'translateY(-50%)'
    }),
    animate(200)
  ]),
  transition(':leave', [
    animate(100, style({
      opacity: 0,
      transform: 'translateY(-50%)'
    }))
  ])
]);

export const slowDisableTrigger = trigger('slowDisableState', [
  state('1', style({
    'background-color': '#9e9e9e'
  })),
  transition('* <=> *', animate(150))
]);

export const profileSizeStylingTrigger = trigger('profileSizeStylingState', [
  state('visible-parallax', style({
    /*
     'height': 'auto'*/
  })),
  state('hidden-parallax', style({
    'height': '0px'
  })),
  state('visible-container', style({
    'margin-top': '-128px'
  })),
  state('hidden-container', style({
    'margin-top': '0px'
  })),
  transition('* <=> *', animate(150))
]);

export const slideNFadeTrigger = trigger('nextSelection', [
  state('hidden', style({
    'opacity': 0,
    'z-index': 0,
    'position': 'absolute',
    'left': '50px',
    'display': 'none'
  })),
  state('fadeIn', style({
    'opacity': 1,
    'z-index': 2,
    'position': 'absolute',
    'left': '0px',
    'display': 'block',
    'width' : '100%'
  })),
  state('fadeOut', style({
    'opacity': 0,
    'z-index': 0,
    'position': 'absolute',
    'left': '-50px',
    'display': 'none'
  })),
  transition('* <=> *', animate(200))
]);



