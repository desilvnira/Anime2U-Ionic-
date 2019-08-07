import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireDatabase, AngularFireObject, AngularFireList } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth'
import { Observable, Subject } from 'rxjs';


@Component({
  selector: 'app-yet-to-watch',
  templateUrl: './yet-to-watch.page.html',
  styleUrls: ['./yet-to-watch.page.scss'],
  providers: [AngularFireDatabase]
})
export class YetToWatchPage implements OnInit {

  chooser: string = "listView";
  yetToWatch: any
  yetToWatchOptions: any
  username: any

  itemRef: AngularFireObject<any>;
  item: Observable<any>;

  constructor(public router: Router,
    public afAuth: AngularFireAuth,
    public db:
    AngularFireDatabase) {

      this.itemRef = db.object('users');
      this.item = this.itemRef.valueChanges();
      

      var promise1 = new Promise(function (resolve, reject,) {afAuth.auth.onAuthStateChanged(function(user) {
        
        if (user) {
          YetToWatchPage.prototype.username = user.email.split("@niran.com")[0]
        } else {
          console.log("not logged")
        }
        resolve(user.email.split("@niran.com")[0])
        
      })})
      promise1.then(function (value){
        const ok = db.list(`users/${YetToWatchPage.prototype.username}/yetToWatch`, ref => ref.limitToFirst(100).orderByKey())
        ok.valueChanges().subscribe(data => (YetToWatchPage.prototype.yetToWatch = data))
        const ok2 = db.list(`users/${YetToWatchPage.prototype.username}/yetToWatch`, ref => ref.limitToFirst(100).orderByKey())
        ok2.snapshotChanges().subscribe(data => (YetToWatchPage.prototype.yetToWatchOptions = data))
        
      })
      
     }

  ngOnInit() {
  }

  getyetToWatch(){
    const ok = this.db.list(`users/${this.username}/yetToWatch`, ref => ref.limitToFirst(100).orderByKey())
    ok.valueChanges().subscribe(data => (this.yetToWatch = data))
    const ok2 = this.db.list(`users/${YetToWatchPage.prototype.username}/yetToWatch`, ref => ref.limitToFirst(100).orderByKey())
    ok2.snapshotChanges().subscribe(data => (YetToWatchPage.prototype.yetToWatchOptions = data))  
  }

  options(ev:any, anime:any, pos:any){
    if(ev.detail.value === "remove"){      
      this.db.list(`users/${this.username}/yetToWatch/${this.yetToWatchOptions[pos].key}`).remove()
    }

    if(ev.detail.value === "completed"){
      this.db.list(`users/${this.username}/completed`).push({
        anime: anime.anime
      })      
      this.db.list(`users/${this.username}/yetToWatch/${this.yetToWatchOptions[pos].key}`).remove()
    }

    if(ev.detail.value === "watching"){      
      this.db.list(`users/${this.username}/watching`).push({
        anime: anime.anime
      })      
      this.db.list(`users/${this.username}/yetToWatch/${this.yetToWatchOptions[pos].key}`).remove()
    }

    if(ev.detail.value === "top10"){      
      this.db.list(`users/${this.username}/top10`).push({
        anime: anime.anime
      })      
  }
}

goBack(){
  this.router.navigate(['/tabs/profile'])
}
  

  
}
