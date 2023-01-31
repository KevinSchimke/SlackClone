



import { Component, Input } from '@angular/core';
import { User } from 'src/app/models/user.class';
import { EmojiEvent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { Firestore } from '@angular/fire/firestore';
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
  selector: 'app-message-editor',
  templateUrl: './message-editor.component.html',
  styleUrls: ['./message-editor.component.scss']
})
export class MessageEditorComponent {
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
  chatChannels: any[] = [];
  isAlready: boolean = false;
  privateId: string = '';

  async ngOnInit() {
    this.currentUser = this.userService.get();
    this.route.params.subscribe((param: any) => this.getIdFromUrl(param));
    if (!this.thread) {
      this.editorConfig.toolbarHiddenButtons?.push(this.small);
    }
  }

  async isChatAlreadyExists() {
    let target = false;
    const q = this.currentDataService.getPrivates();
    q.forEach((doc) => {
      let _currentChatUser = this.currentDataService.getChatUsersId();
      _currentChatUser.push(this.userService.getUid())
      if (JSON.stringify(doc['users'].sort()) === JSON.stringify(_currentChatUser.sort())) {
        target = true;
        this.privateId = doc.id;
        console.log('privateId', this.privateId);
      }
    });
    return target;
  }

  getIdFromUrl(param: { id: string }) {
    this.channelId = param.id;
  }

  upload = ($event: any) => {
    this.file = $event.target.files[0];
    if (this.file.size > 3000000) {
      this.pushupMessage.openPushupMessage('error', 'Your upload is too large, select a file smaller than 3 MB!');
      return
    }
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
    fonts: [],
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
      ['customClasses', 'subscript', 'superscript'],
      [
        'fontSize',
        'indent',
        'outdent',
        'heading',
        'insertVideo',
        'insertHorizontalRule',
        'removeFormat',
        'insertImage',
        'unlink',
        'backgroundColor',
        'textColor',
        'justifyLeft',
        'justifyCenter',
        'justifyRight',
        'justifyFull',
        'fontName'
      ],
    ],
  };

  small: string[] = this.thread ? [] : ['undo', 'redo',];


  async getMessage() {
    let comment: Thread = this.setComment();
    if (this.collectionPath) {
      this.fireservice.save(comment, this.collectionPath);
      this.setThreadData();
    } else {
      if (await this.isChatAlreadyExists()) {
        this.fireservice.save(comment, 'channels/' + this.privateId + '/ThreadCollection');
      } else {
        let channelId = await this.createNewChannel();
        this.fireservice.save(comment, 'channels/' + channelId + '/ThreadCollection');
      }
    }
    this.imageURL = '';
  }

  setComment() {
    let comment: Thread = new Thread();
    comment.userId = this.currentUser.id;
    comment.message = this.message;
    comment.creationDate = new Date();
    comment.img = this.imageURL;
    this.message = '';
    return comment;
  }

  setThreadData() {
    if (this.collectionPath.includes('commentCollection')) {
      let users_arr: string[] = this.currentDataService.currentThread.users;
      if (this.isNotCommentedByCurrentUser()) {
        users_arr.push(this.currentUser.id);
      }
      this.fireservice.updateThread(users_arr, this.collectionPath.replace("/commentCollection", ""));
    }
  }

  isNotCommentedByCurrentUser() {
    return this.currentDataService.currentThread.users && !this.currentDataService.currentThread.users.includes(this.currentUser.id);
  }

  async createNewChannel() {
    let channel: Channel = new Channel();
    channel.channelName = '';
    channel.description = '';
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

