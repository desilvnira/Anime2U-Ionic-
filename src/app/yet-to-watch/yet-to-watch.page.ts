import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth'
import { Observable } from 'rxjs';
import { AlertController } from '@ionic/angular';


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
  top10Limit: any

  itemRef: AngularFireObject<any>;
  item: Observable<any>;

  /**
   * Uses af auth in order to get currently authenticated user
   * Uses this user in order to extract data regarding the watching category from database
   * Have to use a promise due to delay taken to authenticate
   * @param router 
   * @param afAuth 
   * @param db 
   * @param alert 
   */
  constructor(public router: Router,
    public afAuth: AngularFireAuth,
    public db: AngularFireDatabase,
    public alert: AlertController
    ) {

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
        // Sets watching field to the list of anime the user is watching
        const ok = db.list(`users/${YetToWatchPage.prototype.username}/yetToWatch`, ref => ref.limitToFirst(100).orderByKey())
        ok.valueChanges().subscribe(data => (YetToWatchPage.prototype.yetToWatch = data))
        // Sets watchingOptions field to the list of anime the user is watching but with key outer layer
        const ok2 = db.list(`users/${YetToWatchPage.prototype.username}/yetToWatch`, ref => ref.limitToFirst(100).orderByKey())
        ok2.snapshotChanges().subscribe(data => (YetToWatchPage.prototype.yetToWatchOptions = data))
        
      })
      
     }

  ngOnInit() {
  }

  /**
   * Handles all the options each anime has
   * Lets each anime be moved to other pages as well as removed from the current page
   * This is with the exception of the top 10 page where it is only moved and not removed
   * @param ev 
   * @param anime 
   * @param pos 
   */
  async options(ev:any, anime:any, pos:any){
    // Remove anime from the database and from the current page
    if(ev.detail.value === "remove"){      
      this.db.list(`users/${this.username}/yetToWatch/${this.yetToWatchOptions[pos].key}`).remove()
    }

    //Pushes the anime to the completed page whilst removing it from current page
    if(ev.detail.value === "completed"){
      this.db.list(`users/${this.username}/completed`).push({
        anime: anime.anime
      })      
      this.db.list(`users/${this.username}/yetToWatch/${this.yetToWatchOptions[pos].key}`).remove()
    }

    //Pushes the anime to the watching page whilst removing it from current page
    if(ev.detail.value === "watching"){      
      this.db.list(`users/${this.username}/watching`).push({
        anime: anime.anime
      })      
      this.db.list(`users/${this.username}/yetToWatch/${this.yetToWatchOptions[pos].key}`).remove()
    }

    //Pushes the anime to the top 10 page without removing it from current page
    if(ev.detail.value === "top10"){
      const ok = this.db.list(`users/${YetToWatchPage.prototype.username}/top10`, ref => ref.limitToFirst(100).orderByKey())
      ok.valueChanges().subscribe(data => (YetToWatchPage.prototype.top10Limit = data.length))
      // Makes sure that you cannot add over 10 animes to the top 10
      if(this.top10Limit >= 10){
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
 * Navigates back to the profile page
 */
goBack(){
  this.router.navigate(['/tabs/profile'])
}
  

  
}
