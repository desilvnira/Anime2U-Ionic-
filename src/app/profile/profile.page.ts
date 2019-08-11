import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  providers: [AngularFireDatabase]

})
export class ProfilePage implements OnInit {
  itemRef: AngularFireObject<any>;
  item: Observable<any>;
  watching: any
  username: any
  favAnime: any
  picURL: any
  noWatching: any
  noCompleted: any
  noStillToWatch: any

  /**
   * Init the page.
   * Finds the user currently logged in.
   * Fetches data about user from database and assigns them 
   * to global fields in order to display in html component.
   */
  constructor(public router: Router,
    public db: AngularFireDatabase,
    public afAuth: AngularFireAuth,
    public alert: AlertController
    ) {
      this.itemRef = db.object('item');
      this.item = this.itemRef.valueChanges();
      var promise1 = new Promise(function (resolve, reject,) {afAuth.auth.onAuthStateChanged(function(user) {       
      //Grabs the user of the current page and sends it to username field
      if (user) {
        ProfilePage.prototype.username = user.email.split("@niran.com")[0]
        
      } else {
        console.log("not logged")
      }
      resolve(user.email.split("@niran.com")[0])
     
    })})
    // Once username has been resolved relevant user data is retrieved in order to be displayed
    // on thr html side from the subsrbed data types below
    promise1.then(function (value){
      const record1 = db.object(`users/${ProfilePage.prototype.username}/favouriteAnime`)
      record1.valueChanges().subscribe(data => ProfilePage.prototype.favAnime = data)
      const record2 = db.object(`users/${ProfilePage.prototype.username}/pictureURL`)
      record2.valueChanges().subscribe(data => ProfilePage.prototype.picURL = data)
      const record3 = db.list(`users/${ProfilePage.prototype.username}/watching`, ref => ref.limitToFirst(100).orderByKey())
      record3.valueChanges().subscribe(data => (ProfilePage.prototype.noWatching = data.length))
      const record4 = db.list(`users/${ProfilePage.prototype.username}/completed`, ref => ref.limitToFirst(100).orderByKey())
      record4.valueChanges().subscribe(data => (ProfilePage.prototype.noCompleted = data.length))
      const record5 = db.list(`users/${ProfilePage.prototype.username}/yetToWatch`, ref => ref.limitToFirst(100).orderByKey())
      record5.valueChanges().subscribe(data => (ProfilePage.prototype.noStillToWatch = data.length))
    })


    
     }

  ngOnInit() {
  }

  /**
   * navigates from profile page to watching page
   */

  getWatching(){
    
    this.router.navigate(['/watching'])
  }

  /**
   * navigates from profile page to completed page
   */

  completed(){
    this.router.navigate(['/completed'])
  }

  /**
   * navigates from profile page to yetToWatch page
   */

  yetToWatch(){
    this.router.navigate(['/yet-to-watch'])
  }

  /**
   * navigates from profile page to top10 page
   */

  top10(){
    this.router.navigate(['/top10'])
  }

  /**
   * Signs the user of the app and reloads the local storage for next user
   */
  async logout() {
    
    var message = "Are you sure you want to logout?"
    const al = await this.alert.create({
      message,
      buttons: [
        {
          text: 'Yes',
          handler: async() => {
            await this.afAuth.auth.signOut();
            location.replace(window.location.href.replace("tabs/profile","home"))
          }
        },
        {
          text: 'No',
          handler: () => {
            // do nothing
          }
        }
      ]
    })     
    await al.present()   
  }
}
