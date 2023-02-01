import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EmojiEvent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { DialogReactionComponent } from 'src/app/components/main/dialogs/dialog-reaction/dialog-reaction.component';
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


  // evaluateThread(emoji: string, thread: Thread, t: number) {
  //   let userEmojiCount = this.getEmojiCount(thread);
  //   let emojiIndex = this.getEmojiIndex(emoji, thread);
  //   let emojiAlreadyByMe = this.isEmojiAlreadyByMe(emoji, thread);
  //   this.evaluateThreadCases(emoji, thread, t, userEmojiCount, emojiIndex, emojiAlreadyByMe);
  //   this.saveReaction(thread, t);
  // }

  // getEmojiCount(thread: Thread) {
  //   return thread.reactions.filter((reaction) => (reaction.users.includes(this.currentUser.id))).length;
  // }

  // getEmojiIndex(emoji: string, thread: Thread) {
  //   return thread.reactions.findIndex((reaction) => (reaction.id === emoji));
  // }

  // isEmojiAlreadyByMe(emoji: string, thread: Thread) {
  //   return thread.reactions.findIndex((reaction) => (reaction.id === emoji && reaction.users.includes(this.currentUser.id))) != -1;
  // }

  // evaluateThreadCases(emoji: string, thread: Thread, t: number, userEmojiCount: number, emojiIndex: number, emojiAlreadyByMe: boolean) {
  //   if (emojiAlreadyByMe)
  //     this.removeReaction(thread, t, emojiIndex);
  //   else if (userEmojiCount > 2)
  //     this.openDialog();
  //   else if (emojiIndex != -1)
  //     this.addToReaction(emojiIndex, t);
  //   else if (emojiIndex == -1)
  //     this.addNewReaction(emoji, t);
  // }


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

  // addNewReaction(emoji: string, t: number) {
  //   this.threads[t].reactions.push({
  //     id: emoji,
  //     users: [this.currentUser.id]
  //   });
  // }

  // addToReaction(emojiIndex: number, t: number) {
  //   this.threads[t].reactions[emojiIndex].users.push(this.currentUser.id);
  // }

  // saveReaction(thread: Thread, t: number) {
  //   let updatedThread = new Thread(this.threads[t]);
  //   this.fireService.save(updatedThread, 'channels/' + this.channelId + '/ThreadCollection', thread.id);
  // }
}
