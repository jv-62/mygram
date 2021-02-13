import { ConfirmationDialogService } from './confirmation-dialog/confirmation-dialog.service';
import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/services/post.service';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  Posts: any;
  Users: any;
  addComment: FormGroup;
  User: any;

  constructor(
    private _fb: FormBuilder,
    private _service: PostService,
    private confirmationDialogService: ConfirmationDialogService
  ) {
    this.addComment = this._fb.group({
      Comment: [''],
    });
  }

  ngOnInit(): void {
    this.User = JSON.parse(sessionStorage.getItem('Users'));
    this.getData();
  }

  getData() {
    this._service.getPosts('posts').subscribe((res) => {
      this.Posts = res;
      for (let i = 0; i < this.Posts.length; i++) {
        const funName = 'Users';
        for (let j = 0; j < this.Posts[i].Comments.length; j++) {
          this._service.getUser(funName, this.Posts[i].Comments[j].UserId).subscribe((response) => {
            res[i].Comments[j].UserName = response['Name'];
          }, (err) => {
            console.log(err);
          })
        }
        for (let j = 0; j < this.Posts[i].Likes.length; j++) {
          if (this.Posts[i].Likes[j] == this.User.id) {
            res[i].likeColor = 'warn';
          }
        }
        res[i].likeIcon = 'thumb_up';
        this._service.getUser(funName, this.Posts[i].PostedBy).subscribe((response) => {
          res[i].UserImage = response['Image'];
          res[i].PostedByName = response['Name'];
        }, (err) => {
          console.log(err);
        })
      }
    }, (err) => {
      console.log(err);
    })
    this._service.getAllUser().subscribe((res) => {
      this.Users = res;
    })
  }

  onComment(id) {
    const funName = 'Comments';
    // this.addComment;
    this.addComment.value.UserId = this.User.id;
    this.addComment.value.PostId = id;

    this._service.addComment(funName, this.addComment.value).subscribe((res) => {
      this.getData();
    }, (err) => {
      console.log(err);
    });
    this.addComment.reset();
  }

  onLike(postId) {
    this._service.getPostsById(postId).subscribe((res) => {
      let postData: any = res;
      for (let i = 0; i < postData.Likes.length; i++) {
        if (postData.Likes[i] == this.User.id) {
          return false;
        }
      }
      postData['Likes'].push(this.User.id);
      delete postData["Comments"];
      this._service.updatePostById(postId, postData).subscribe(response => {
        this.getData();
      })
    })
  }

  onDelete(id) {
    this.confirmationDialogService.confirm('Please confirm..! ', 'Do you really want to delete this post?')
    .then((confirmed) => { 
      console.log('User confirmed:', confirmed)
      if(confirmed){
        this._service.deleteUser(id).subscribe(response => {
          this.getData();
        })
      }
    })
    .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  instaProfile(PostedBy) {
    let fun = 'Users';
    this._service.getUser(fun, PostedBy).subscribe((res) => {
      window.open(`https://www.instagram.com/${res['userName']}`);
    }, (err) => {
      console.log(err);
    })
  }

}
