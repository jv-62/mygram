import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterService } from '../../services/register.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  btnText: string;
  EmailId: 'null';
  showLoader: boolean = false;

  image = '../../../assets/Avtar.jpg';
  imagePath: any;
  imgURL: any;
  message: string;

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _service: RegisterService,
    private _toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.btnText = 'Sign Up';
    this.signupForm = this._fb.group({
      Image: [''],
      Name: ['', Validators.required],
      userName: ['', Validators.required],
      EmailId: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z.-]+.[a-z]{2,4}$'),
        ],
      ],
      Password: ['', Validators.required],
      Number: ['', Validators.required],
    });
  }

  get f() {
    return this.signupForm.controls;
  }
  public mobileNo = {
    guide: false,
    keepCharPositions: false,
    showMask: true,
    mask: [
      /[0-9]/,
      /[0-9]/,
      /[0-9]/,
      " ",
      /[0-9]/,
      /[0-9]/,
      /[0-9]/,
      " ",
      /[0-9]/,
      /[0-9]/,
      /[0-9]/,
      /[0-9]/,
    ],
  }

  onSubmit() {
    if (this.signupForm.valid) {
      this.btnText = 'Please Wait';
      this.showLoader = true;
      const email = this.signupForm.value.EmailId;
      const fun = 'Users';
      this._service.getUsers(email, fun).subscribe(
        (res) => {
          if (res != '') {
            this.btnText = 'Sign Up';
            this.EmailId = res[0].EmailId;
            this.showLoader = false;
          } else {
            const functionName = 'Users';

            this.signupForm.value.Image = this.imgURL;
            this.signupForm.value.Followers = this.signupForm.value.Following = [];
            this.signupForm.value.RegDate = new Date();

            let data = this.signupForm.value;
            data['Password'] = this._service.encryptLoginPassword(
              '4hKwwRJn',
              this.signupForm.value.EmailId,
              this.signupForm.value.Password
            );

            this._service.signup(data, functionName).subscribe(
              (res) => {
                this._toastr.success('Signup Success');
                this._router.navigateByUrl('/signin');
              },
              (error) => {
                console.log(error);
                this._toastr.error(error);
              }
            );
          }
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      this.btnText = 'Sign Up';
    }
  }

  preview(files) {
    if (files.length === 0)
      return;

    let mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }

    let reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
    }
  }

}
