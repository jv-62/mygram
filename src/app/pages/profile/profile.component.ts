import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  UserData: any;
  followText: string;
  loggedInUser: any;
  self: boolean | false;
  id: any;

  constructor(private route: ActivatedRoute, private _service: PostService) { }

  ngOnInit(): void {
    this.followText = 'Follow';

    this.route.queryParamMap.subscribe(p => {
      this.id = p.get('id');
      // this.id = this._service.decrypt(id);
      // console.log("id", this.id)
    });
    this.loggedInUser = JSON.parse(sessionStorage.getItem('Users'));
    if (this.loggedInUser.id == this.id) {
      this.self = true;
    }
    this.getData(this.id);
  }

  getData(id) {
    var fun = 'Users';
    this._service.getUser(fun, id).subscribe((res) => {
      this.UserData = res;
      for (let i = 0; i < this.UserData.Followers.length; i++) {
        if (this.UserData.Followers[i] == this.loggedInUser.id) {
          this.followText = "Unfollow";
        } else {
          this.followText = "Follow";
        }
      }
      delete res['Password'];
      var funName = 'Posts';
      this._service.getPostsByUserId(funName, id).subscribe((Response) => {
        var resd = [];
        resd['data'] = Response
        this.UserData.Posts = resd['data'].length;
        this.UserData.UsersPosts = resd['data'];
      }, (error) => {
        console.log(error);
      })
    }, (err) => {
      console.log(err);
    })
  }

  followUser() {

    let loggedInUserId = this.loggedInUser.id;
    let UserId = this.UserData.id;

    if (this.followText == 'Unfollow') {
      // Code for unfollow
      // Code for unfollowing
      this._service.getUser("Users", this.loggedInUser.id).subscribe((res) => {
        let loggedInUser = res;
        loggedInUser['Following'].pop(UserId);
        this._service.follow(this.loggedInUser.id, loggedInUser).subscribe((Response) => {
          this.followText = 'Follow';
          this.ngOnInit();
        });
      })
      // Code for unfollowing end

      // Code for unfollowers
      this._service.getUser("Users", UserId).subscribe((res) => {
        let UserData = res;
        UserData['Followers'].pop(loggedInUserId);
        this._service.follow(UserId, UserData).subscribe((Response) => {
          this.ngOnInit();
          this.followText = 'Follow';
        });
      })
      // Code for unfollowers end

      // var array = ["a", "b", "c"];
      // array.pop(), 'c';
      // console.log(array);

      // Code for unfollow end
    } else {
      // Code for following
      this._service.getUser("Users", this.loggedInUser.id).subscribe((res) => {
        let loggedInUser = res;
        loggedInUser['Following'].push(UserId);
        this._service.follow(this.loggedInUser.id, loggedInUser).subscribe((Response) => {
          this.followText = 'Unfollow';
          this.ngOnInit();
        });
      })
      // Code for following end

      // Code for followers
      this._service.getUser("Users", UserId).subscribe((res) => {
        let UserData = res;
        UserData['Followers'].push(loggedInUserId);
        this._service.follow(UserId, UserData).subscribe((Response) => {
          this.ngOnInit();
          this.followText = 'Unfollow';
        });
      })
      // Code for followers end
    }
  }

}
