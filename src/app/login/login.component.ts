import {Component, ElementRef, OnInit, Renderer2, TemplateRef, ViewChild} from '@angular/core';
import {PublicService} from '../../service/public.service';
import {Router} from '@angular/router';
import SparkMD5 from 'spark-md5';
import {Dialog} from '../../components/dialog/dialog';
import {Base64} from 'js-base64';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
  flags = false

  constructor(
    private _publicService: PublicService,
    private router: Router,
    private _dialog: Dialog,
    private render: Renderer2
  ) { }

  ngOnInit() {
    this.verifyCode();
  }
  userName;
  passWord;
  vertCode;
  _valid = false;
  vertCodeUrl;
  verifyCode() {
    let obj = {
      _: Date.now(),
      w: 110,
      h:45
    }
    this.vertCodeUrl = this._publicService.verifyCode(obj)
  }


  countdown =  60;
  flagCode =  false;
  codeText =   '获取验证码';
  codeTest() {
    if (localStorage.getItem('countdown') && +localStorage.getItem('countdown') <=  60 && +localStorage.getItem('countdown') > 0) {
      this.countdown = +localStorage.getItem('countdown');
      this.countdown --;
      this.flagCode = true;
      this.codeText = '重新发送';
      localStorage.setItem('countdown', this.countdown + '');
      setTimeout( () => {
        this.codeTest();
      }, 1000)
    } else {  // 不存在 || === 60
      this.countdown = 60;
      this.flagCode = false;
      this.codeText = '获取验证码';
      localStorage.setItem('countdown', this.countdown + '');
    }
  }


  @ViewChild('code_template', {read: TemplateRef}) code_template_ref: TemplateRef<any>;
  @ViewChild('forget_code') forget_code_ref;
  forgetCode;
  pwd_code;
  forgetCodeUrl;
  user_name;
  type = 1;
  pwd_show = false // 是否显示密码框
  _description;
  pwd_vertify_show;
  type_show;
  // 发送验证码前奏
  error;
  errorText;
  verifyPwd() {
    // this._description = undefined;
    this.forgetCode = undefined;
    this.pwd_vertify_show = undefined;
    // this.type_show = undefined;
    this.forget_vertify_Code();
    //
    // this._dialog.open(Login2Component).subscribe(data => {
    //   console.info(data);
    // })


    this._dialog.open(this.code_template_ref, {title: '', flag: true, async: true}).subscribe((data: any) => {
        if (data && this.forget_code_ref.valid && !this.error) {
          let obj = {
            type: this.type,
            user_name: this.user_name,
            img_code: this.forgetCode
          }
          this._publicService.send(obj).subscribe( res => {  // 调用成功后，手机上会出现验证码
              if (res.success === 200) {
                data();
                this.pwd_show = false;
                // 发送验证码
                localStorage.setItem('countdown', this.countdown + '');
                this.codeTest()
              }
          }, error => {  // 这边做了处理 前端是抛出异常
            this.error = error.errorList[0]._code;
            this.errorText = error.errorList[0]._description;
              if (error.errorList[0]._code === 'user_name' || error.errorList[0]._code === 'type') {
                data();
              }
              this.pwd_show = false;
          })
        }
    })
  }

  number = 0
  forget_vertify_Code() {
    ++this.number
    if (document.getElementById('freshen')) {
      this.render.setStyle(document.getElementById('freshen'), 'transform', `rotate(${this.number * 360}deg)`)
    }
    let obj = {
      _: Date.now(),
      w: 500,
      h:45
    }
    this.forgetCodeUrl = this._publicService.verifyCode(obj)
  }

  setInvalidClass(form, formControl) {
    let cl;
    if (formControl && formControl.invalid && (formControl.dirty || formControl.touched || form.submitted)) {
      cl = 'has-error';
    }
    if (formControl && formControl.valid) {
      cl = 'has-success';
    }
    return cl;
  }
  _code;
  // 验证
  save1() {
     let obj = {
       user_name: this.user_name,
       code: this.pwd_code
     }
    this._publicService.checkVerifycode(obj).subscribe( res => {
      if (res.success === 200) {
        this.pwd_show = true;
      }
    }, error => {
      this.error = error.errorList[0]._code;
      this.errorText = error.errorList[0]._description;
      // this._code = error.errorList[0]._code === 'code' ?  error.errorList[0]._description : undefined;
      this.pwd_show = false;
    })
  }

  // 修改密码
  save2() {
    let obj = {
      pwd : SparkMD5.hash(this.password),
      b_pwd :  Base64.encode(this.password)
    }
    this._publicService.resetPassword(obj).subscribe( res => {
        if (res.success === 200 ) {
          this.flags = false;
          this.pwd_show = false;
          this.password = undefined;
          this.old_pwd = undefined;
          this.pwd_code = undefined;
          this.userName = undefined;
          // this.verifyCode();
        }
    }, error => {
      this.pwd_show = false;
      this.password = undefined;
      this.old_pwd = undefined;
      this.pwd_code = undefined;
    })
  }


  errorFocus(errorName) {
    if(errorName === this.error) {
      this.error = undefined;
      this.errorText = undefined;
    }
  }




  password;
  old_pwd;
  flag: boolean = false;
  pwd_comfirm() {
    this.flag = this.password === this.old_pwd ? false : true;
  }

  login(inform) {
   this._valid = true;
   if (inform.valid) {
     this._publicService.login({
       username: this.userName,
       password: SparkMD5.hash(this.passWord),
       veritycode: this.vertCode
     }).subscribe(res => {
       console.log(res)
       if (res.success === 200 ) {
         this.router.navigate(['/home'])
       } else {
         this.router.navigate(['/'])
       }
     })
   }
  }
}

@Component({
  selector: 'app-login2',
  template: ``,
})
export class Login2Component implements OnInit{
  ngOnInit(): void {
  }

}
