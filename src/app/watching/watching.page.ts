import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireDatabase, AngularFireObject, AngularFireList } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth'
import { Observable, Subject } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { sanitizeHtml } from '@angular/core/src/sanitization/sanitization';


@Component({
  selector: 'app-watching',
  templateUrl: './watching.page.html',
  styleUrls: ['./watching.page.scss'],
  providers: [AngularFireDatabase]
})
export class WatchingPage implements OnInit {

  chooser: string = "listView";
  watching: any
  watchingOptions: any
  username: any
  eps: string = ""
  nextEp: string = ""

  itemRef: AngularFireObject<any>;
  item: Observable<any>;

  constructor(public router: Router,
    public afAuth: AngularFireAuth,
    public db: AngularFireDatabase,
    public alert: AlertController,
    ) {

      this.itemRef = db.object('users');
      this.item = this.itemRef.valueChanges();
      
      var promise1 = new Promise(function (resolve, reject,) {afAuth.auth.onAuthStateChanged(function(user) {
        
        if (user) {
          WatchingPage.prototype.username = user.email.split("@niran.com")[0]
          
        } else {
          console.log("not logged")
        }
        resolve(user.email.split("@niran.com")[0])
        
      })})
      promise1.then(function (value){
        const ok = db.list(`users/${WatchingPage.prototype.username}/watching`, ref => ref.limitToFirst(100).orderByKey())
        ok.valueChanges().subscribe(data => (WatchingPage.prototype.watching = data))

        const ok2 = db.list(`users/${WatchingPage.prototype.username}/watching`, ref => ref.limitToFirst(100).orderByKey())
        ok2.snapshotChanges().subscribe(data => (WatchingPage.prototype.watchingOptions = data))
        
      })
      
     }

  ngOnInit() {
  }

  getWatching(){

    const ok = this.db.list(`users/${this.username}/watching`, ref => ref.limitToFirst(100).orderByKey())
    ok.valueChanges().subscribe(data => (this.watching = data))

    const ok2 = this.db.list(`users/${this.username}/watching`, ref => ref.limitToFirst(100).orderByKey())
    ok2.snapshotChanges().subscribe(data => (this.watchingOptions = data))

  }

  options(ev:any, anime:any, pos:any){

    if(ev.detail.value === "remove"){      
      this.db.list(`users/${this.username}/watching/${this.watchingOptions[pos].key}`).remove()
    }

    if(ev.detail.value === "completed"){
      this.db.list(`users/${this.username}/completed`).push({
        anime: anime.anime
      })      
      this.db.list(`users/${this.username}/watching/${this.watchingOptions[pos].key}`).remove()
    }

    if(ev.detail.value === "yetToWatch"){      
      this.db.list(`users/${this.username}/yetToWatch`).push({
        anime: anime.anime
      })      
      this.db.list(`users/${this.username}/watching/${this.watchingOptions[pos].key}`).remove()
    }

    if(ev.detail.value === "top10"){      
      this.db.list(`users/${this.username}/top10`).push({
        anime: anime.anime
      })      
    }

  }

  async getEp(ev: any, pos: any, anime: any){

    console.log(anime.anime.episodes)
    console.log(ev.target.value)
    if(ev.target.value > anime.anime.episodes){
      var message: string
      message = "Episode number out of bounds"
      const al = await this.alert.create({
        message,
        buttons: ["Ok"]
      })     
      await al.present()
      return;
    }
    if(isNaN(ev.target.value)){
      var message: string
      message = "Episode number is not valid"
      const al = await this.alert.create({
        message,
        buttons: ["Ok"]
      })     
      await al.present()
      return;
    }

    var self = this
    var epNum: any
    var epLimitCheck: any
    if(Math.floor(ev.target.value / 100) === 0){
      epLimitCheck = 1
      epNum = ev.target.value
    }else{
      epLimitCheck = Math.floor(ev.target.value / 100) + 1
      epNum = ev.target.value - ((Math.floor(ev.target.value / 100))*100) 
      if(ev.target.value.includes("99")){
        console.log("here")
      }
    }
    console.log(epLimitCheck)

      fetch('https://api.jikan.moe/v3/anime/'+anime.anime.mal_id+'/episodes/' + epLimitCheck)
      .then(function(response) {
        return response.json();
      })
      .then(function(myJson) {
        console.log(myJson)
        self.db.object(`users/${self.username}/watching/${self.watchingOptions[pos].key}`).
      update({
        currentEpisode: ev.target.value,
        nextEpisode: myJson.episodes[parseInt(epNum)].title
      });
        });
  }

  goBack(){
    this.router.navigate(['/tabs/profile'])
  }
  

  
}
