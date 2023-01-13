import { Component, Input } from '@angular/core';
import { User } from 'src/app/models/user.class';
import { Comment } from 'src/app/models/comment.class';
import { EmojiEvent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { collection, doc, Firestore, setDoc } from '@angular/fire/firestore';
import { AngularEditorConfig, UploadResponse } from '@kolkov/angular-editor';
import { Observable } from 'rxjs';
import { HttpEvent } from '@angular/common/http';
import { FirestoreService } from 'src/app/service/firebase/firestore.service';
import { ActivatedRoute } from '@angular/router';

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
  channelId: string ='';
  constructor(private firestore: Firestore, public fireservice: FirestoreService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe((param: any) => this.getIdFromUrl(param));
  }

  getIdFromUrl(param: { id: string }) {
    if (param.id && param.id.length > 2) {
      this.channelId = param.id;
    };
    console.log(this.channelId);
  }

  darkMode: undefined | boolean = !!(
    typeof matchMedia === 'function' &&
    matchMedia('(prefers-color-scheme: dark)').matches
  );

  darkestMode: undefined | boolean = undefined;
  set = 'native';
  native = true;

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Leave a message...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },

    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText',
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    // upload: (file: File) => { Observable<HttpEvent<UploadResponse>>; },
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    outline: false,
    toolbarHiddenButtons: [
      ['customClasses', 'strikeThrough', 'subscript', 'superscript'],
      [
        'fontSize',
        'indent',
        'outdent',
        'heading',
        'insertVideo',
        'insertHorizontalRule',
        'removeFormat',
        'link',
        'unlink',
        'backgroundColor',
        'textColor',
      ],
    ],
  };

  async saveThread(thread: Comment) {
    let coll = collection(
      this.firestore,
      'channels',
      this.channelId,
      'ThreadCollection'
    );
    await setDoc(doc(coll), thread.toJson());
    console.log('created Channel');
  }

  getMessage() {
    console.log(this.channelId);
    let comment: Comment = new Comment();

    this.user.id = 'testuser';
    comment.userid = this.user.id + this.comments.length;
    comment.message = this.message;
    comment.creationDate = new Date();
    this.comments.push(this.message);
    this.chat.push(this.message);
    this.message = '';
    console.log(this.comments);
    this.saveThread(comment);
  }





  setTheme(set: string) {
    this.native = set === 'native';
    this.set = set;
  }
  setDarkmode(mode: boolean | undefined) {
    if (mode === undefined) {
      this.darkestMode = mode;
      this.darkMode = !!(
        typeof matchMedia === 'function' &&
        matchMedia('(prefers-color-scheme: dark)').matches
      );
    } else {
      this.darkMode = mode;
      this.darkestMode = mode;
    }
  }

  handleKeyUp($event: any) {
    //      if($event.keyCode === 13 && !$event.shiftKey){
    //       $event.preventDefault();
    //        this.getMessage();
    //      }
  }

  handleClick($event: EmojiEvent) {
    // console.log($event.emoji);
    this.message += $event.emoji.native;
    console.log(this.channelId);
  }


  emojiFilter(e: string): boolean {
    // Can use this to test [emojisToShowFilter]
    if (e && e.indexOf && e.indexOf('1F4') >= 0) {
      return true;
    }
    return false;
  }
}