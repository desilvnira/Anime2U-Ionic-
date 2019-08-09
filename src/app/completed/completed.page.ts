import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireDatabase, AngularFireObject, AngularFireList } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth'
import { Observable, Subject } from 'rxjs';
import { AlertController, ToastController } from '@ionic/angular';



@Component({
  selector: 'app-completed',
  templateUrl: './completed.page.html',
  styleUrls: ['./completed.page.scss'],
  providers: [AngularFireDatabase]
})
export class CompletedPage implements OnInit {

  chooser: string = "listView";
  completed: any
  completedOptions: any
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
    public alert: AlertController,
    public toastCtrl: ToastController
    ){

      this.itemRef = db.object('users');
      this.item = this.itemRef.valueChanges();
      

      var promise1 = new Promise(function (resolve, reject,) {afAuth.auth.onAuthStateChanged(function(user) {
        
        if (user) {
          CompletedPage.prototype.username = user.email.split("@niran.com")[0]
        } else {
          console.log("not logged")
        }
        resolve(user.email.split("@niran.com")[0])
        
      })})
      promise1.then(function (value){
        // Sets watching field to the list of anime the user is watching
        const ok = db.list(`users/${CompletedPage.prototype.username}/completed`, ref => ref.limitToFirst(100).orderByKey())
        ok.valueChanges().subscribe(data => (CompletedPage.prototype.completed = data))
        // Sets watchingOptions field to the list of anime the user is watching but with key outer layer
        const ok2 = db.list(`users/${CompletedPage.prototype.username}/completed`, ref => ref.limitToFirst(100).orderByKey())
        ok2.snapshotChanges().subscribe(data => (CompletedPage.prototype.completedOptions = data))
        
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

    // Removes the anime from the database and page
    if(ev.detail.value === "remove"){
      this.presentToast(anime.anime.title + ' has been removed from completed')      
      this.db.list(`users/${this.username}/completed/${this.completedOptions[pos].key}`).remove()
    }

    //Pushes the anime to the watching page whilst removing it from current page
    if(ev.detail.value === "watching"){
      this.db.list(`users/${this.username}/watching`).push({
        anime: anime.anime
      })      
      this.db.list(`users/${this.username}/completed/${this.completedOptions[pos].key}`).remove()
    }

    //Pushes the anime to the yetToWatch page whilst removing it from current page
    if(ev.detail.value === "yetToWatch"){      
      this.db.list(`users/${this.username}/yetToWatch`).push({
        anime: anime.anime
      })      
      this.db.list(`users/${this.username}/completed/${this.completedOptions[pos].key}`).remove()
    }

    //Pushes the anime to the top 10 page without removing it from current page
    if(ev.detail.value === "top10"){ 
      const ok = this.db.list(`users/${CompletedPage.prototype.username}/top10`, ref => ref.limitToFirst(100).orderByKey())
      ok.valueChanges().subscribe(data => (CompletedPage.prototype.top10Limit = data.length))
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
      // Pushes the anime to the top 10 page      
      this.db.list(`users/${this.username}/top10`).push({
        anime: anime.anime
      })      
    }

  }
  /**
   * Navigates the user back to the profile page
   */
  goBack(){
    this.router.navigate(['/tabs/profile'])
  }

  async presentToast(message: any) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: "top"
    });
    await toast.present();
  }
  

  
}
