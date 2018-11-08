import {EventEmitter, Injectable} from '@angular/core';
import {Router} from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

declare const Materialize: any;

@Injectable()
export class GlobalsService {

  public screenSizeEmitter = new EventEmitter<string>();
  public globalChangeDetectorRef = new EventEmitter<any>();
  public screenSize = '';
  public logging = true;
  public runningAsynconousFunctions = false;

  public routeAfterLogin = '';

  constructor(public router: Router, public sanitizer: DomSanitizer) {
  }

  toggleBackground() {
    console.log('test');
  }

  toast(message, time) {
    Materialize.toast(message, time);
  }

  s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }

  randId() {
    return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
      this.s4() + '-' + this.s4() + this.s4() + this.s4();
  }

  // function emits screen size to components that are listenging to emitter.
  onResize() {

    if (this.logging) {
      console.log('resize fired');
    }

    const w = window,
      d = document,
      e = d.documentElement,
      g = d.getElementsByTagName('body')[0],
      x = w.innerWidth || e.clientWidth || g.clientWidth,
      y = w.innerHeight || e.clientHeight || g.clientHeight;

    if (x <= 600) {
      this.screenSizeEmitter.emit('small');
      this.screenSize = 'small';
    } else if (x <= 992) {
      this.screenSizeEmitter.emit('medium');
      this.screenSize = 'medium';
    } else if (x > 992) {
      this.screenSizeEmitter.emit('large');
      this.screenSize = 'large';
    }

  }

  navigate(location) {
    this.router.navigate([location]);
    this.scrollTo(0, 100);
  }

  delayedNav(location) {
    setTimeout(() => {
      this.router.navigate([location]);
    }, 250);
  }

  reloadPage(){
    location.reload();
  }

  //doesnt work
  delayFunctionFor(milliseconds, callback) {
    function saysomething(){
      callback()
    }
    setTimeout(saysomething, milliseconds);
  }

  // global input sanitizer.
  cleanInput(dirty: string): string {
    return dirty.replace(/[^a-zA-Z0-9_@.]/gi, '');
  }

  cleanInputWithSpaces(dirty: string): string {
    return dirty.replace(/[^a-zA-Z0-9_@./ \n?!"'()$#%&*,]/gi, '');
  }

  delay(run, time) {
    setTimeout(run, time);
  }

  objLen(obj) {
    return Object.keys(obj).length;
  }

  scrollTo(to, duration) {

    const element = document.body;

    if (duration <= 0) {
      return;
    }
    const difference = to - element.scrollTop;
    const perTick = difference / duration * 10;
    setTimeout(() => {
      element.scrollTop = element.scrollTop + perTick;
      if (element.scrollTop === to) {
        return;
      }
      this.scrollTo(to, duration - 10);
    }, 10);
  }

  dateSecondsToReadable(value) {
    const timeInSeconds = new Date(1970, 0, 1); // Epoch
    timeInSeconds.setSeconds(value);

    let day: any = timeInSeconds.getDay();
    if (day === 0) {
      day = 'Sunday';
    } else if (day === 1) {
      day = 'Monday';
    } else if (day === 2) {
      day = 'Tuesday';
    } else if (day === 3) {
      day = 'Wednesday';
    } else if (day === 4) {
      day = 'Thursday';
    } else if (day === 5) {
      day = 'Friday';
    } else if (day === 6) {
      day = 'Saturday';
    }

    const monthDate = timeInSeconds.getDate();

    let month: any = timeInSeconds.getMonth();
    if (month === 0) {
      month = 'January';
    } else if (month === 1) {
      month = 'February';
    } else if (month === 2) {
      month = 'March';
    } else if (month === 3) {
      month = 'April';
    } else if (month === 4) {
      month = 'May';
    } else if (month === 5) {
      month = 'June';
    } else if (month === 6) {
      month = 'July';
    } else if (month === 7) {
      month = 'August';
    } else if (month === 8) {
      month = 'September';
    } else if (month === 9) {
      month = 'October';
    } else if (month === 10) {
      month = 'November';
    } else if (month === 11) {
      month = 'December';
    }

    const year: any = timeInSeconds.getFullYear();
    const finalDate = `${day}, ${month} ${monthDate}, ${year}`;

    return finalDate;
  }

}
