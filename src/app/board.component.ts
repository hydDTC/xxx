import {Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild,} from '@angular/core';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.less']
})
export class BoardComponent implements OnInit, OnDestroy {
  @ViewChild('container') containerFullRef: ElementRef;
  @ViewChild('picList') picList: ElementRef;
  @ViewChild('caseMainLeft') caseMainLeft: ElementRef;
  @ViewChild('caseMainRight') caseMainRight: ElementRef;
  @ViewChild('scheme') scheme: ElementRef;

  constructor(private renderer: Renderer2,
              private title: Title,) {
  }

  destroy = false;

  hash = 'home';
  leftTo;
  height;
  topTo;
  leftNum;
  background: any = {
    background: 'rgba(255,255,255,0.7)',
    'top.px': 0
  };
  setIntervalNum;
  setInterval1;
  setInterval2;
  setinter;
  currentPic = 0;
  currents = 0;
  num = 0;
  user: any = {};
  flags = false;

  ngOnInit(): void {
    this.title.setTitle(`智橙移动 领先的信息流广告投放平台`);

    this.scrolls();
    this.scrolls1();
    this.scrolls2();
    this.schemeImg();
    this.renderer.listen(this.containerFullRef.nativeElement, 'scroll', (event) => {

      this.background['top.px'] = event.target.scrollTop;

      this.background['background'] = `rgba(255,255,255,${(event.target.scrollTop / 180) * 0.3 + 0.7})`;
    });
    this.renderer.listen(this.picList.nativeElement, 'mouseenter', () => {
      clearInterval(this.setIntervalNum);
    });
    this.renderer.listen(this.picList.nativeElement, 'mouseleave', () => {
      this.scrolls();
    });
    this.renderer.listen(this.caseMainLeft.nativeElement, 'mouseenter', () => {
      clearInterval(this.setInterval1);
      clearInterval(this.setInterval2);
    });
    this.renderer.listen(this.caseMainLeft.nativeElement, 'mouseleave', () => {
      this.scrolls1();
      this.scrolls2();
    });
    this.renderer.listen(this.caseMainRight.nativeElement, 'mouseenter', () => {
      clearInterval(this.setInterval1);
      clearInterval(this.setInterval2);
    });
    this.renderer.listen(this.caseMainRight.nativeElement, 'mouseleave', () => {
      this.scrolls1();
      this.scrolls2();
    });
    this.renderer.listen(this.scheme.nativeElement, 'mouseenter', () => {
      clearInterval(this.setinter);
    });
    this.renderer.listen(this.scheme.nativeElement, 'mouseleave', () => {
      this.schemeImg();
    });
  }

  scrolls() {
    this.setIntervalNum = setInterval(() => {
      if (this.destroy) return;
      this.currentPic++;
      if (this.currentPic > 1) {
        this.currentPic = 0;
      }
      if (this.currentPic < 1) {
        this.currentPic = 0;
      }
      this.leftTo = {
        'left.px': -this.currentPic * 1352
      };
    }, 3000);
  }

  scrolls1() {
    this.setInterval1 = setInterval(() => {
      if (this.destroy) return;
      this.currentPic++;
      if (this.currentPic > document.querySelector('.imgbox .list').children.length - 1) {
        this.currentPic = 0;
      }
      this.height = {
        'top.px': -this.currentPic * 472
      };
    }, 3000);
  }

  scrolls2() {
    this.setInterval2 = setInterval(() => {
      if (this.destroy) return;
      this.currentPic++;
      if (this.currentPic > document.querySelector('.text-list .list').children.length - 1) {
        this.currentPic = 0;
      }
      this.topTo = {
        'top.px': -this.currentPic * 298
      };
    }, 3000);
  }

  schemeImg() {
    this.setinter = setInterval(() => {
      if (this.destroy) return;
      this.currents++;
      if (this.currents > document.querySelector('.listimg').children.length - 1) {
        this.currents = 0;
      }
      this.leftNum = {
        'left.px': -this.currents * 85
      };
    }, 2500);
  }

  changeElement(index) {
    this.num = index;
  }

  scrollTop(name) {
    this.hash = name;
    this.containerFullRef.nativeElement.scrollTop = document.getElementById(name).offsetTop - 80;
    if (name === 'home') {
      (<HTMLDivElement>this.containerFullRef.nativeElement).scrollTop = 0;
      // this.containerFullRef.nativeElement.scrollTo({top: 0})
      // this._scrollService.scrollTo(this.containerFullRef.nativeElement, {top: 0})
    }
  }

  current(index) {
    this.currentPic = index;
    this.leftTo = {
      'left.px': -(index * 1352)
    };
  }

  make() {
    if (!this.user.company || !this.user.name || !this.user.phone) {
      alert('不能为空（必填）');
    } else {
      this.flags = !this.flags;
    }
  }

  ngOnDestroy() {
    this.destroy = true;
    clearInterval(this.setInterval1);
    clearInterval(this.setInterval2);
    clearInterval(this.setIntervalNum);
  }
}
