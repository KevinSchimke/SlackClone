import { Component, Input } from '@angular/core';
import { User } from 'src/app/models/user.class';
import { EmojiEvent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { collection, doc, Firestore, setDoc } from '@angular/fire/firestore';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Observable } from 'rxjs';
import { FirestoreService } from 'src/app/service/firebase/firestore.service';
import { ActivatedRoute } from '@angular/router';
import { Storage, ref, uploadBytesResumable, getDownloadURL, StorageReference, deleteObject } from '@angular/fire/storage';
import { UserService } from 'src/app/service/user/user.service';
import { Thread } from 'src/app/models/thread.class';
import { PushupMessageService } from 'src/app/service/pushup-message/pushup-message.service';
import { CurrentDataService } from 'src/app/service/current-data/current-data.service';
import { Channel } from 'src/app/models/channel.class';


@Component({
  selector: 'app-dialoginput',
  templateUrl: './dialoginput.component.html',
  styleUrls: ['./dialoginput.component.scss'],
})

export class DialoginputComponent {
  @Input() collectionPath = '';
  @Input() thread: boolean = false;


  constructor(private firestore: Firestore, private pushupMessage: PushupMessageService, private currentDataService: CurrentDataService, public fireservice: FirestoreService, private route: ActivatedRoute, private fireStorage: Storage, private userService: UserService) { }

  user: User = Object();
  message: string = '';
  channelId: string = '';
  file: any = {};
  imageURL = '';
  downloadURL2!: Observable<string>;
  storageRef!: StorageReference;
  path = '';
  currentUser = new User();

  ngOnInit() {
    this.currentUser = this.userService.get();
    this.route.params.subscribe((param: any) => this.getIdFromUrl(param));
    if (!this.thread) {
      this.editorConfig.toolbarHiddenButtons?.push(this.small);
    }
  }

  getIdFromUrl(param: { id: string }) {
    this.channelId = param.id;
  }

  upload = ($event: any) => {
    this.file = $event.target.files[0];
    const randomId = Math.random().toString(36).substring(2);
    this.path = `images/${randomId}`;
    this.storageRef = ref(this.fireStorage, this.path);
    const uploadTask = uploadBytesResumable(this.storageRef, this.file);
    uploadTask.on('state_changed', (snapshot) => {
      switch (snapshot.state) {
        case 'canceled':
          this.pushupMessage.openPushupMessage('error', 'Upload is canceled');
          break;
      }
    },
      (error) => {
        console.log(error.message);
      }
      ,
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          this.pushupMessage.openPushupMessage('success', 'Upload is success');
          this.imageURL = downloadURL;
        });
      });
  }

  discardUpload() {
    this.imageURL = '';
    const desertRef = ref(this.fireStorage, this.path);
    deleteObject(desertRef).then(() => {
      // File deleted successfully
    }).catch((error) => {
      // Uh-oh, an error occurred!
    });
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
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }

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
        'insertImage',
        'unlink',
        'backgroundColor',
        'textColor',
      ],
    ],
  };

  small: string[] = this.thread ? [] : ['undo', 'redo', 'justifyLeft',
    'justifyCenter',
    'justifyRight',
    'justifyFull',];


   async getMessage() {
    let comment: Thread = new Thread();
    comment.userId = this.currentUser.id;
    comment.message = this.message;
    comment.creationDate = new Date();
    comment.img = this.imageURL;
    this.message = '';
    console.log(this.collectionPath);
    if(this.collectionPath){
      this.fireservice.save(comment, this.collectionPath);
      if (this.collectionPath.includes('commentCollection')) {
        this.fireservice.addCommentToThread(this.collectionPath.replace("/commentCollection",""));
      }
    }else{
      let channelId = await this.createNewChannel();
      this.fireservice.save(comment, 'channels/' + channelId + '/ThreadCollection');
    }
    this.imageURL = '';
  }

  async createNewChannel() {
    let channel: Channel = new Channel();
    channel.channelName =  '';
    channel.description =  '';
    channel.locked = true;
    channel.category = 'private';
    this.currentDataService.getChatUsers().forEach(user => channel.users.push(user.id));
    channel.users.push(this.currentUser.id);
     return await this.fireservice.add(channel);

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
    console.log($event.emoji);
    this.message += $event.emoji.native;
    // console.log(this.channelId);
  }

  emojiFilter(e: string): boolean {
    // Can use this to test [emojisToShowFilter]
    if (e && e.indexOf && e.indexOf('1F4') >= 0) {
      return true;
    }
    return false;
  }
}


