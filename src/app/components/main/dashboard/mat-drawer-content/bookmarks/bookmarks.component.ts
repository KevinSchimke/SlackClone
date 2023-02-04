import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { addDoc, collection, getFirestore } from '@firebase/firestore';

@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.component.html',
  styleUrls: ['./bookmarks.component.scss']
})
export class BookmarksComponent {

  db = getFirestore();
  link: string = '';
  linkName: string = '';
  currentChatroomID: string = '';

  constructor(public dialogRef: MatDialogRef<BookmarksComponent>) { }

  async addBookmark(){
    await addDoc(collection(this.db, "channels", this.currentChatroomID, 'bookmarks' ), {
      name: this.linkName,
      link: this.link,
    });
    this.dialogRef.close();
  }
}