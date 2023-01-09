import { Component } from '@angular/core';
import { User } from 'src/app/models/user.class';
import { Comment } from 'src/app/models/comment.class';
import { EmojiEvent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { collection, doc, Firestore, setDoc } from '@angular/fire/firestore';
import { AngularEditorConfig } from '@kolkov/angular-editor';


const CUSTOM_EMOJIS = [
  {
    name: 'Party Parrot',
    shortNames: ['parrot'],
    keywords: ['party'],
    imageUrl: './assets/images/parrot.gif',
  },
  {
    name: 'Octocat',
    shortNames: ['octocat'],
    keywords: ['github'],
    imageUrl: 'https://github.githubassets.com/images/icons/emoji/octocat.png',
  },
  {
    name: 'Squirrel',
    shortNames: ['shipit', 'squirrel'],
    keywords: ['github'],
    imageUrl: 'https://github.githubassets.com/images/icons/emoji/shipit.png',
  },
];

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

  constructor(private firestore: Firestore) { }



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
      placeholder: 'Enter text here...',
      defaultParagraphSeparator: '',
      defaultFontName: '',
      defaultFontSize: '',
      fonts: [
        {class: 'arial', name: 'Arial'},
        {class: 'times-new-roman', name: 'Times New Roman'},
        {class: 'calibri', name: 'Calibri'},
        {class: 'comic-sans-ms', name: 'Comic Sans MS'}
      ],
      customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    // upload: (file: File) => { ... }
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
     toolbarHiddenButtons: [
      ['customClasses', 'strikeThrough', 'subscript',
      'superscript',],
      ['fontSize',    'indent',
      'outdent', 'heading', 'insertVideo',
      'insertHorizontalRule',
      'removeFormat', 'link',
      'unlink', 'backgroundColor', 'fontName']
    ]
};
 

  async saveThread(thread: Comment){
    let coll = collection(this.firestore, 'channels','Angular','ThreadCollection');
    await setDoc(doc(coll), thread.toJSON());
    console.log('created Channel');
  }

  getMessage() {
    let comment: Comment = new Comment();

    this.user.id = 'testuser';
    comment.userid = this.user.id + this.comments.length;
    comment.message = this.message;
    comment.timestamp = new Date();
    this.comments.push(this.message);
    this.chat.push(this.message);
    this.message = '';
    console.log(this.comments);
    this.saveThread(comment);
  }

  themes = [
    'native',
    'apple',
    'google',
    'twitter',
    'facebook',
  ];

  darkMode: undefined | boolean = !!(
    typeof matchMedia === 'function' &&
    matchMedia('(prefers-color-scheme: dark)').matches
  );

  darkestMode: undefined | boolean = undefined;
  set = 'native';
  native = true;
  CUSTOM_EMOJIS = CUSTOM_EMOJIS;

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
  handleClick($event: EmojiEvent) {
    // console.log($event.emoji);
    // $event.stopPropagation();
    // $event.preventDefault();
    this.message += $event.emoji.native;
  }
  emojiFilter(e: string): boolean {
    // Can use this to test [emojisToShowFilter]
    if (e && e.indexOf && e.indexOf('1F4') >= 0) {
      return true;
    }
    return false;
  }
}
