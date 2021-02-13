import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from 'src/app/services/post.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-view-post',
  templateUrl: './view-post.component.html',
  styleUrls: ['./view-post.component.css']
})
export class ViewPostComponent implements OnInit {

  constructor(private route: ActivatedRoute, private _service: PostService, private _fb: FormBuilder, private _location: Location) {
    this.addComment = this._fb.group({
      Comment: [''],
    });
  }

  Post: any;
  addComment: FormGroup;
  id: number;

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(p => {
      this.id = +p.get('id');
    });
    this.getData(this.id);
  }

  getData(id) {
    this._service.getPostsById(id).subscribe((res) => {
      this.Post = res;
      if (this.Post.Comments.length) {
        for (let j = 0; j < this.Post.Comments.length; j++) {
          this._service.getUser('Users', this.Post.Comments[j].UserId).subscribe((response) => {
            this.Post.Comments[j].UserName = response['Name'];
          }, (err) => {
            console.log(err);
          })
        }
      }
      this._service.getUser('Users', this.Post.PostedBy).subscribe((response) => {
        this.Post.UserImage = response['Image'];
        this.Post.PostedByName = response['Name'];
      }, (err) => {
        console.log(err);
      })
    }, (err) => {
      console.log(err);
    })
  }

  onComment(id) {
    const funName = 'Comments';
    this.addComment;
    this.addComment.value.UserId = this.id;
    this.addComment.value.PostId = id;

    this._service.addComment(funName, this.addComment.value).subscribe((res) => {
      console.log(res);
      this.getData(this.id)
    }, (err) => {
      console.log(err);
    });
    this.addComment.reset();
  }

  onLike(postId) {
    this._service.getPostsById(postId).subscribe((res) => {
      var postData: any;
      postData = res;
      for (let i = 0; i < postData.Likes.length; i++) {
        if (postData.Likes[i] == this.id) {
          return false;
        }
      }
      postData['Likes'].push(this.id);
      delete postData["Comments"];
      this._service.updatePostById(postId, postData).subscribe(response => {
        this.getData(this.id);
      })
    })
  }

  onclickBack() {
    this._location.back();
  }

  instaProfile(PostedBy) {
    var fun = 'Users';
    this._service.getUser(fun, PostedBy).subscribe((res) => {
      window.open(`https://www.instagram.com/${res['userName']}`);
    }, (err) => {
      console.log(err);
    })
  }

}
