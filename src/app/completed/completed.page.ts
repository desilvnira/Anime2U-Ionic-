import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireDatabase, AngularFireObject, AngularFireList } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth'
import { Observable, Subject } from 'rxjs';
import { AlertController } from '@ionic/angular';



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

  constructor(public router: Router,
    public afAuth: AngularFireAuth,
    public db: AngularFireDatabase,
    public alert: AlertController
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
        const ok = db.list(`users/${CompletedPage.prototype.username}/completed`, ref => ref.limitToFirst(100).orderByKey())
        ok.valueChanges().subscribe(data => (CompletedPage.prototype.completed = data))

        const ok2 = db.list(`users/${CompletedPage.prototype.username}/completed`, ref => ref.limitToFirst(100).orderByKey())
        ok2.snapshotChanges().subscribe(data => (CompletedPage.prototype.completedOptions = data))
        
      })
      
     }

  ngOnInit() {
  }

  getCompleted(){
    const ok = this.db.list(`users/${this.username}/completed`, ref => ref.limitToFirst(100).orderByKey())
    ok.valueChanges().subscribe(data => (this.completed = data))

    const ok2 = this.db.list(`users/${this.username}/completed`, ref => ref.limitToFirst(100).orderByKey())
    ok2.snapshotChanges().subscribe(data => (this.completedOptions = data))
  }

  async options(ev:any, anime:any, pos:any){

    if(ev.detail.value === "remove"){      
      this.db.list(`users/${this.username}/completed/${this.completedOptions[pos].key}`).remove()
    }

    if(ev.detail.value === "watching"){
      this.db.list(`users/${this.username}/watching`).push({
        anime: anime.anime
      })      
      this.db.list(`users/${this.username}/completed/${this.completedOptions[pos].key}`).remove()
    }

    if(ev.detail.value === "yetToWatch"){      
      this.db.list(`users/${this.username}/yetToWatch`).push({
        anime: anime.anime
      })      
      this.db.list(`users/${this.username}/completed/${this.completedOptions[pos].key}`).remove()
    }

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
      this.db.list(`users/${this.username}/top10`).push({
        anime: anime.anime
      })      
    }

  }

  goBack(){
    this.router.navigate(['/tabs/profile'])
  }
  

  
}
