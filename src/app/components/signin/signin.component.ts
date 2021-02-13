import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { ToastrService } from 'ngx-toastr';
import { RegisterService } from 'src/app/services/register.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SigninComponent implements OnInit {
  signinForm: FormGroup;
  btnText: string;
  showLoader: boolean = false;

  constructor(
    @Inject(DOCUMENT) private _document: Document,
    private _fb: FormBuilder,
    private _service: LoginService,
    private _toastr: ToastrService,
    private _rservice: RegisterService
  ) { }

  ngOnInit(): void {
    this.btnText = 'Sign In';
    this.signinForm = this._fb.group({
      EmailId: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z.-]+.[a-z]{2,4}$'),
        ],
      ],
      Password: ['', Validators.required],
    });
  }

  get f() {
    return this.signinForm.controls;
  }

  onSubmit() {
    if (this.signinForm.valid) {
      this.btnText = 'Please Wait';
      this.showLoader = true;
      const functionName = 'Users';
      const email = this.signinForm.value.EmailId;
      let password = this._rservice.encryptLoginPassword(
        '4hKwwRJn',
        this.signinForm.value.EmailId,
        this.signinForm.value.Password
      );

      this._service.signin(email, password, functionName).subscribe(
        (res) => {
          if (res != '') {
            delete res[0]['Password'];
            delete res[0]['Image'];
            let data = JSON.stringify(res[0]);
            this._document.defaultView.location.reload();
            this._toastr.success('SignIn Success');
            sessionStorage.setItem('Users', data);
          } else {
            this.btnText = 'Sign In';
            this.showLoader = false;
            this._toastr.warning('Email or Password is incorrect');
          }
        },
        (err) => {
          this.showLoader = false;
          console.log(err);
        }
      );
    } else {
      this.btnText = 'Sign In';
    }
  }
}
