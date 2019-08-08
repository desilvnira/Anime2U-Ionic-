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
  top10Limit: any

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

    // Sets watching field to the list of anime the user is watching
    const ok = this.db.list(`users/${this.username}/watching`, ref => ref.limitToFirst(100).orderByKey())
    ok.valueChanges().subscribe(data => (this.watching = data))

    // Sets watchingOptions field to the list of anime the user is watching but with key outer layer
    const ok2 = this.db.list(`users/${this.username}/watching`, ref => ref.limitToFirst(100).orderByKey())
    ok2.snapshotChanges().subscribe(data => (this.watchingOptions = data))

  }

 async options(ev:any, anime:any, pos:any){

    // Removes anime from database based on key 

    if(ev.detail.value === "remove"){      
      this.db.list(`users/${this.username}/watching/${this.watchingOptions[pos].key}`).remove()
    }

    // Pushes the anime selected to the completed page whilst deleting from current

    if(ev.detail.value === "completed"){
      this.db.list(`users/${this.username}/completed`).push({
        anime: anime.anime
      })      
      this.db.list(`users/${this.username}/watching/${this.watchingOptions[pos].key}`).remove()
    }

    // Pushes the anime selected to the yetToWatch page whilst deleting from current

    if(ev.detail.value === "yetToWatch"){      
      this.db.list(`users/${this.username}/yetToWatch`).push({
        anime: anime.anime
      })      
      this.db.list(`users/${this.username}/watching/${this.watchingOptions[pos].key}`).remove()
    }

    // Pushes the anime selected to the top 10 page without deleting from current

    if(ev.detail.value === "top10"){
      const ok = this.db.list(`users/${WatchingPage.prototype.username}/top10`, ref => ref.limitToFirst(100).orderByKey())
      ok.valueChanges().subscribe(data => (WatchingPage.prototype.top10Limit = data.length))
      // Makes sure that you cannot add over 10 animes to the top 10
      if(this.top10Limit === 10){
        var message: string
        message = "Top 10 limit reached: Please remove from Top 10 to continue"
        const al = await this.alert.create({
          message,
          buttons: ["Ok"]
        })     
        await al.present()
        return; 
      }     
      this.db.list(`users/${this.username}/top10`).push({
        anime: anime.anime
      })      
    }

  }

  /**
   * Handles the extraction of data from database in order to update the current ep
   * and next episode card details.
   * @param ev 
   * @param pos 
   * @param anime 
   */

  async getEp(ev: any, pos: any, anime: any){

    console.log(anime.anime.episodes)
    console.log(ev.target.value)
    // alerts for invalid user inputs
    if(ev.target.value > anime.anime.episodes || ev.target.value <= 0){
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
    // small function to deal with animes with over 100 episodes where further pages are required
    // to be accessed in order to display high episode numbers
    if(Math.floor(ev.target.value / 100) === 0){
      epLimitCheck = 1
      epNum = ev.target.value
    }else{
      epLimitCheck = Math.floor(ev.target.value / 100) + 1
      epNum = ev.target.value - ((Math.floor(ev.target.value / 100))*100) 
    }

      fetch('https://api.jikan.moe/v3/anime/'+anime.anime.mal_id+'/episodes/' + epLimitCheck)
      .then(function(response) {
        return response.json();
      })
      .then(function(myJson) {
        console.log(myJson)
        // updates the current episode and next episode fields in database
        // uses the position passed through thr function to access the correct key
        // in the dataase as keys are unordered
        self.db.object(`users/${self.username}/watching/${self.watchingOptions[pos].key}`).
      update({
        currentEpisode: ev.target.value,
        nextEpisode: myJson.episodes[parseInt(epNum)]
      });
        });
  }

  /**
   * Navigates back to the profile page
   */

  goBack(){
    this.router.navigate(['/tabs/profile'])
  }
  

  
}
