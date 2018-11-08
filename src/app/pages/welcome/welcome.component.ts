// basic imports
import {Component, HostBinding, AfterViewChecked} from '@angular/core';
import {GlobalsService} from '../../services/globals.service';
import {routeStateTrigger} from '../../animations/route-animations';

// declare vrview so typescript allows it
declare var VRView: any;

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
  animations: [routeStateTrigger]
})

export class WelcomeComponent implements AfterViewChecked {
  @HostBinding('@routeState') animations = true;

  constructor(public globals: GlobalsService) {

    // subscribe to screen size emitter
    this.globals.screenSizeEmitter.subscribe((screen) => {
      // reformat article cards to be in the middle of screen.
      this.verticalCenterCards(screen);
    });
  }

  public vrView: any;

  ngAfterViewChecked() {

    // load the VR Viewer if the viewer does not exist.
    if (this.vrView == null) {
      this.vrView = new VRView.Player('#vr-welcome-view', {
        image: "assets/imgs/mainlobby.jpg",
        is_stereo: false,
        width: "100%",
        height: "350px"
      });
    }

    // emit screen size
    this.globals.onResize();
  }

  // takes the current screen size and reformats the article cards. this should be abstracted into a service
  // or seperate class eventually. also a loop should be used... POSSIBLE UPGRADE.
  verticalCenterCards(screen) {

    if (screen === 'small' || screen === 'medium') {

      document.getElementById('mainimg1').style.marginTop = '1px';
      document.getElementById('maincard1').style.marginTop = '15px';

      document.getElementById('mainimg2').style.marginTop = '1px';
      document.getElementById('maincard2').style.marginTop = '15px';

      document.getElementById('mainimg3').style.marginTop = '1px';
      document.getElementById('maincard3').style.marginTop = '15px';
    } else {

      const img1Height = document.getElementById('mainimg1').clientHeight;
      const card1Height = document.getElementById('maincard1').clientHeight;

      let margin1 = 0;

      if (img1Height > card1Height) {
        margin1 = Math.floor((img1Height - card1Height) / 2) - 5;

        document.getElementById('maincard1').style.marginTop = margin1 + 'px';
        document.getElementById('mainimg1').style.marginTop = '0px';
      } else {
        margin1 = Math.floor((card1Height - img1Height) / 2) - 5;

        document.getElementById('mainimg1').style.marginTop = margin1 + 'px';
        document.getElementById('maincard1').style.marginTop = '0px';
      }

      const img2Height = document.getElementById('mainimg2').clientHeight;
      const card2Height = document.getElementById('maincard2').clientHeight;

      let margin2 = 0;

      if (img2Height > card2Height) {
        margin2 = Math.floor((img2Height - card2Height) / 2) - 5;

        document.getElementById('maincard2').style.marginTop = margin2 + 'px';
        document.getElementById('mainimg2').style.marginTop = '0px';
      } else {
        margin2 = Math.floor((card2Height - img2Height) / 2) - 5;

        document.getElementById('mainimg2').style.marginTop = margin2 + 'px';
        document.getElementById('maincard2').style.marginTop = '0px';
      }


      const img3Height = document.getElementById('mainimg3').clientHeight;
      const card3Height = document.getElementById('maincard3').clientHeight;

      let margin3 = 0;

      if (img3Height > card3Height) {
        margin3 = Math.floor((img3Height - card3Height) / 3) - 5;

        document.getElementById('maincard3').style.marginTop = margin3 + 'px';
        document.getElementById('mainimg3').style.marginTop = '0px';
      } else {
        margin3 = Math.floor((card3Height - img3Height) / 3) - 5;

        document.getElementById('mainimg3').style.marginTop = margin3 + 'px';
        document.getElementById('maincard2').style.marginTop = '0px';
      }

    }
  }

}
