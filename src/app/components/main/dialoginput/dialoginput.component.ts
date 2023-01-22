import { Component, Input, OnInit, ViewChild, HostListener, Output, EventEmitter } from '@angular/core';
import { User } from 'src/app/models/user.class';
import { Comment } from 'src/app/models/comment.class';
import { EmojiEvent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { collection, doc, Firestore, getFirestore, setDoc } from '@angular/fire/firestore';
import { AngularEditorConfig, UploadResponse } from '@kolkov/angular-editor';
import { finalize, Observable } from 'rxjs';
import { FirestoreService } from 'src/app/service/firebase/firestore.service';
import { ActivatedRoute } from '@angular/router';
import { Storage, ref, uploadBytesResumable, getDownloadURL, uploadBytes, UploadTask, StorageReference, deleteObject  } from '@angular/fire/storage';
import { CurrentDataService } from 'src/app/service/current-data/current-data.service';


@Component({
  selector: 'app-dialoginput',
  templateUrl: './dialoginput.component.html',
  styleUrls: ['./dialoginput.component.scss'],
})

export class DialoginputComponent {
  @Input() collectionPath = '';
  @Input() thread: boolean = false;

  
  constructor(private firestore: Firestore, public fireservice: FirestoreService, private route: ActivatedRoute, private fireStorage: Storage, private currentData: CurrentDataService ) { }

  user: User = Object();
  message: string = '';
  channelId: string ='';
  file:any = {};
  imageURL = '';
  downloadURL2!: Observable<string>;
  storageRef! : StorageReference;
  path = '';
  currentUser = new User();

  ngOnInit() {
    this.currentUser = this.currentData.getUser();
    this.route.params.subscribe((param: any) => this.getIdFromUrl(param));
    if(!this.thread) {
      this.editorConfig.toolbarHiddenButtons?.push(this.small);
    }
    // if(this.thread) console.log("coll", this.collectionPath);
  }

  // ngOnChanges(){
  //   console.log(this.collectionPath);
  // }

  getIdFromUrl(param: { id: string }) {
      this.channelId = param.id;
    // console.log(this.channelId);
  }
 
  upload = ($event: any) => {
    this.file = $event.target.files[0];
    const randomId = Math.random().toString(36).substring(2);
    this.path = `images/${randomId}`;
    this.storageRef = ref(this.fireStorage, this.path);
    const uploadTask = uploadBytesResumable(this.storageRef, this.file);
    uploadTask.on('state_changed', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('upload is ' + progress + " % done");
      switch (snapshot.state) {
        case 'paused':
          console.log('Upload is paused');
          break;
        case 'running':
          console.log('Upload is running');
          break;
      }
    },
    (error) =>{
      console.log(error.message);
    }
    ,
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        console.log('download is ' + downloadURL);
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

  async saveThread(thread: Comment) {
    let coll = collection(
      this.firestore,
      'channels',
      this.channelId,
      'ThreadCollection'
    );
    await setDoc(doc(coll), thread.toJson());
    // console.log('created Channel');
  }

  getMessage() {
    let comment: Comment = new Comment();
    comment.userId = this.currentUser.id;
    comment.userName =  this.currentUser.name;
    comment.userSrc = this.currentUser.src ? this.currentUser.src : 'assets/img/user4.jpg';
    comment.message = this.message;
    comment.creationDate = new Date();
    comment.img = this.imageURL;
    this.message = '';
    console.log(this.collectionPath);
    this.fireservice.save(comment, this.collectionPath);
    this.imageURL = '';
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


