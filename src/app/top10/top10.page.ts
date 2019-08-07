import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireDatabase, AngularFireObject, AngularFireList } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth'
import { Observable, Subject } from 'rxjs';


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

  constructor(public router: Router,
    public afAuth: AngularFireAuth,
    public db:
    AngularFireDatabase) {

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
        const ok = db.list(`users/${Top10Page.prototype.username}/top10`, ref => ref.limitToFirst(100).orderByKey())
        ok.valueChanges().subscribe(data => (Top10Page.prototype.top10 = data))

        const ok2 = db.list(`users/${Top10Page.prototype.username}/top10`, ref => ref.limitToFirst(100).orderByKey())
        ok2.snapshotChanges().subscribe(data => (Top10Page.prototype.top10Options = data))
        
      })
      
     }

  ngOnInit() {
  }


  options(ev:any, anime:any, pos:any){
    if(ev.detail.value === "remove"){      
      console.log(anime)
      this.db.list(`users/${this.username}/top10/${this.top10Options[pos].key}`).remove()
    }
  }

  goBack(){
    this.router.navigate(['/tabs/profile'])
  }
  

  
}
