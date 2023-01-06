import { Component } from '@angular/core';
import { User } from 'src/app/models/user.class';
import { Comment } from 'src/app/models/comment.class';

@Component({
  selector: 'app-dialoginput',
  templateUrl: './dialoginput.component.html',
  styleUrls: ['./dialoginput.component.scss'],
})
export class DialoginputComponent {
  user: User = Object();

  message: string = '';
  chat: string[] = [];
  comments: any[] = [];

  getMessage() {
    let comment: Comment = Object();

    this.user.id = 'testuser';
    comment.userid = this.user.id + this.comments.length;
    comment.message = this.message;
    this.comments.push(comment);
    this.chat.push(this.message);
    this.message = '';
    console.log(this.comments);
  }
}
