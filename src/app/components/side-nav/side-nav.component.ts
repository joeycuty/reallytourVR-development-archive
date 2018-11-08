import {Component, OnInit} from '@angular/core';
import {GlobalsService} from '../../services/globals.service';
import {AuthoService} from '../../services/autho.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})

export class SideNavComponent implements OnInit {
  public smSwitchSearch = false;

  constructor(public globals: GlobalsService, public autho: AuthoService) {
  }

  ngOnInit() {
  }

  fire() {
    console.log("TST");
  }

}
