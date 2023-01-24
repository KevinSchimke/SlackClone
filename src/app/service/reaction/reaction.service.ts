import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EmojiEvent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { DialogReactionComponent } from 'src/app/components/main/dashboard/dialog-reaction/dialog-reaction.component';
import { Thread } from 'src/app/models/thread.class';
import { User } from 'src/app/models/user.class';
import { FirestoreService } from '../firebase/firestore.service';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class ReactionService {

  currentUser = new User();

  constructor(private fireService: FirestoreService, private user: UserService, private dialog: MatDialog) {
    this.currentUser = user.get();
  }


  evaluateThread($event: EmojiEvent, thread: Thread, t: number, channelId: string) {
    let userEmojiCount = thread.reactions.filter((reaction) => (reaction.users.includes(this.currentUser.id))).length;
    let emojiIndex = thread.reactions.findIndex((reaction) => (reaction.id === $event.emoji.native));
    let emojiAlreadyByMe = thread.reactions.findIndex((reaction) => (reaction.id === $event.emoji.native && reaction.users.includes(this.currentUser.id))) != -1;
    let obj = this.evaluateThreadCases($event, thread, t, userEmojiCount, emojiIndex, emojiAlreadyByMe);
    let updatedThread = new Thread(thread);
    this.fireService.save(updatedThread, 'channels/' + channelId + '/ThreadCollection', thread.id);
    return obj;
  }

  evaluateThreadCases($event: EmojiEvent, thread: Thread, t: number, userEmojiCount: number, emojiIndex: number, emojiAlreadyByMe: boolean) {
    // if (emojiAlreadyByMe)
    //   this.removeReaction(thread, t, emojiIndex)
    // else if (userEmojiCount > 2)
    //   this.openDialog();
    // else if (emojiIndex != -1)
    //   this.threads[t].reactions[emojiIndex].users.push(this.currentUser.id);
    // else if (emojiIndex == -1)
    //   this.addNewReaction($event, t);
  }

  // openDialog(): void {
  //   const dialogRef = this.dialog.open(DialogReactionComponent);
  //   dialogRef.afterClosed().subscribe();
  // }

  // removeReaction(thread: Thread, t: number, emojiIndex: number) {
  //   this.threads[t].reactions[emojiIndex].users.splice(thread.reactions[emojiIndex].users.indexOf(this.currentUser.id), 1);
  //   if (this.threads[t].reactions[emojiIndex].users.length == 0) {
  //     this.threads[t].reactions.splice(emojiIndex, 1);
  //   }
  // }

  // addNewReaction($event: EmojiEvent, t: number) {
  //   this.threads[t].reactions.push({
  //     id: $event.emoji.native,
  //     users: [this.currentUser.id]
  //   });
  // }
}
