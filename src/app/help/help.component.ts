import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.less']
})
export class HelpComponent implements OnInit {

  constructor(private router: Router,
              private route: ActivatedRoute,) {

    // this.auth = route.snapshot.data.auth
  }

  // auth

  ngOnInit(): void {

  }

  num = 0;

  changeElement(index) {
    this.num = index;
  }
}
