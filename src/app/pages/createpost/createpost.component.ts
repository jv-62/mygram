import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { PostService } from "../../services/post.service";
export interface Fruit {
  name: string;
}

@Component({
  selector: 'app-createpost',
  templateUrl: './createpost.component.html',
  styleUrls: ['./createpost.component.css']
})

export class CreatepostComponent implements OnInit {

  addPostForm: FormGroup;
  btnText: string;
  element = [];
  image = '../../../assets/Avtar.jpg';
  imagePath: any;
  imgURL: any;
  message: string;

  constructor(private _fb: FormBuilder,
    private _router: Router,
    private _service: PostService,
    private _toastr: ToastrService) { }

  ngOnInit(): void {
    this.btnText = 'Post';
    this.addPostForm = this._fb.group({
      Image: ['', Validators.required],
      Title: ['', Validators.required],
      Description: ['', Validators.required],
      HashTag: [''],
    });
  }

  get f() {
    return this.addPostForm.controls;
  }

  onSubmit() {
    if (this.addPostForm.valid) {

      for (let i = 0; i < this.fruits.length; i++) {
        this.element.push(this.fruits[i].name);
      }
      this.addPostForm.value.HashTag = this.element;
      this.addPostForm.value.Image = this.imgURL;
      this.addPostForm.value.Likes = [];
      this.addPostForm.value.PostCreatedOn = new Date();

      const postData = this.addPostForm.value;
      let loggedUser = JSON.parse(sessionStorage.getItem('Users'));
      postData['PostedBy'] = loggedUser.id;
      let funName = 'Posts';
      this._service.addPost(postData, funName).subscribe((res) => {
        console.log("Api Response", res);
        this._router.navigate(['/']);
        this._toastr.success("Post Added successfully");
      }, (err) => {
        console.log(err);
      })

      this.addPostForm.patchValue({
        Title: [],
        Description: []
      })
      this.fruits = [];
    } else {
      return false
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

  // Chips
  visible = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  fruits: Fruit[] = [];

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.fruits.push({ name: "#" + value.replace(/\s/g, "") });
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(fruit: Fruit): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }
  // Chips end

}
