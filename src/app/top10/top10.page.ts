import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth'
import { Observable } from 'rxjs';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-top10',
  templateUrl: './top10.page.html',
  styleUrls: ['./top10.page.scss'],
  providers: [AngularFireDatabase]
})
export class Top10Page implements OnInit {

  chooser: string = "listView";
  top10: any
  top10Options: any
  username: any

  itemRef: AngularFireObject<any>;
  item: Observable<any>;

  /**
   * Uses af auth in order to get currently authenticated user
   * Uses this user in order to extract data regarding the watching category from database
   * Have to use a promise due to delay taken to authenticate
   * @param router 
   * @param afAuth 
   * @param db 
   */
  constructor(public router: Router,
    public afAuth: AngularFireAuth,
    public db: AngularFireDatabase,
    public toastCtrl: ToastController
    ) {

      this.itemRef = db.object('users');
      this.item = this.itemRef.valueChanges();
      

      var promise1 = new Promise(function (resolve, reject,) {afAuth.auth.onAuthStateChanged(function(user) {
        
        if (user) {
          Top10Page.prototype.username = user.email.split("@niran.com")[0]
        } else {
          console.log("not logged")
        }
        resolve(user.email.split("@niran.com")[0])
      })})
      promise1.then(function (value){
        // Sets watching field to the list of anime the user is watching
        const ok = db.list(`users/${Top10Page.prototype.username}/top10`, ref => ref.limitToFirst(100).orderByKey())
        ok.valueChanges().subscribe(data => (Top10Page.prototype.top10 = data))
        // Sets watchingOptions field to the list of anime the user is watching but with key outer layer
        const ok2 = db.list(`users/${Top10Page.prototype.username}/top10`, ref => ref.limitToFirst(100).orderByKey())
        ok2.snapshotChanges().subscribe(data => (Top10Page.prototype.top10Options = data))
        
      })
      
     }

  ngOnInit() {
  }

  /**
   * Only handles the option of removal from top10 category
   * @param ev 
   * @param anime 
   * @param pos 
   */
  options(ev:any, anime:any, pos:any){
    if(ev.detail.value === "remove"){      
      this.presentToast(anime.anime.title + ' has been removed from Top 10') 
      this.db.list(`users/${this.username}/top10/${this.top10Options[pos].key}`).remove()
    }
  }

  goBack(){
    this.router.navigate(['/tabs/profile'])
  }
  
  /**
   * Gives notification about recent change to page through message param
   * @param message 
   */
  async presentToast(message: any) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: "top"
    });
    await toast.present();
  }
  
}
