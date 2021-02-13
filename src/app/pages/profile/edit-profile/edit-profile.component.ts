import { PostService } from 'src/app/services/post.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  editUserForm: FormGroup;
  id: number;
  image: string;
  message: string;
  imagePath: any;
  imgURL: any;
  btnText: string;
  userData: any;

  constructor(private route: ActivatedRoute, private _fb: FormBuilder, private _service: PostService, private _router: Router) {
    this.btnText = 'Update'
    this.editUserForm = this._fb.group({
      Image: [''],
      Name: [''],
      userName: [''],
      Number: [''],
    });
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

  get f() {
    return this.editUserForm.controls;
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(p => {
      this.id = +p.get('id');
    });

    this.getData(this.id);
  }

  getData(id) {
    this._service.getUser('users', id).subscribe((res) => {
      this.image = res['Image'];
      this.userData = res;
      this.editUserForm.setValue({
        'Image': '',
        'Name': res['Name'],
        'userName': res['userName'],
        'Number': res['Number']
      })
    }, (err) => {
      console.log(err);
    })
  }

  onSubmit() {
    if (this.editUserForm.valid) {
      if (this.imgURL === undefined) {
        this.editUserForm.value.Image = this.image;
      } else {
        this.editUserForm.value.Image = this.imgURL;
      }
      this.editUserForm.value.Password = this.userData['Password'];
      this.editUserForm.value.EmailId = this.userData['EmailId'];
      this.editUserForm.value.Followers = this.userData['Followers'];
      this.editUserForm.value.Following = this.userData['Following'];
      this._service.updateUser(this.userData['id'], this.editUserForm.value).subscribe((res) => {
        this._router.navigateByUrl(`home/profile?id=${this.id}`);
      })
    }
  }
  preview(files) {
    if (files.length === 0)
      return;

    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }

    var reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
    }
  }

}
