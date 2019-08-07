import { Component, OnInit, NgZone,ChangeDetectionStrategy } from '@angular/core';
import * as $ from "jquery";
import { database } from 'firebase';
import { from, Observable } from 'rxjs';
import { AngularFireDatabase, AngularFireObject, AngularFireList } from '@angular/fire/database';
import { Router } from '@angular/router';
import { Events } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth'
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AngularFireDatabase]
})
export class SearchPage implements OnInit {
  
  watching: AngularFireList<any>;
  completed: AngularFireList<any>;
  yetToWatch: AngularFireList<any>;
  top10: AngularFireList<any>;
  top10Limit: any
  
  username: any

  itemRef: AngularFireObject<any>;
  item: Observable<any>;
  

  data: any;
  searchQuery: string = '';
  constructor(public router: Router,
    public afAuth: AngularFireAuth,
    public events: Events,
    public db:
    AngularFireDatabase,
    public alert: AlertController,
    ) {


      this.itemRef = db.object('users');
      this.item = this.itemRef.valueChanges();
      

      this.afAuth.auth.onAuthStateChanged(function(user) {
        
        if (user) {
          console.log("Username here is: " + user.email.split("@niran.com")[0])
          SearchPage.prototype.username = user.email.split("@niran.com")[0]
          return "lol"
        } else {
          console.log("not logged")
        }
      })

      
   }

  ngOnInit() {
  }


  getItems(ev: any) {
    // Reset items back to all of the items
    
    
    // set val to the value of the searchbar
    const val = ev.target.value;
    
      
    var self = this

      fetch('https://api.jikan.moe/v3/search/anime/?q=' + val)
      .then(function(response) {
        return response.json();
      })
      .then(function(myJson) {
        self.data = myJson.results
        console.log(myJson.results)
      });

    //if the value is an empty string don't filter the items
    
  }

  /**
   * Handles the ion select options for where the user is able to 
   * select the option of which category they want to add to.
   * The anime they want to add is then added under the chosen category
   * in the database.
   * 
   */

  async addToList(ev:any, anime:any){

  /**
   * Function pushes anime to the watching object in firebase 
   * for the user authenticated. 
   */
    
  if(ev.detail.value === "watching"){ 
    this.watching = this.db.list(`users/${this.username}/watching`)
    this.watching.push({
      anime: anime,
      currentEpisode: 0
    })
  }

  /**
   * Function pushes anime to the completed object in firebase 
   * for the user authenticated.
   */

  if(ev.detail.value === "completed"){
    this.watching = this.db.list(`users/${this.username}/completed`)
    this.watching.push({
      anime: anime
    })
  }

  /**
   * Function pushes anime to the yetToWatch object in firebase 
   * for the user authenticated.
   */

  if(ev.detail.value === "yetToWatch"){
    this.watching = this.db.list(`users/${this.username}/yetToWatch`)
    this.watching.push({anime: anime})
  }

  /**
   * Function pushes anime to the top10 object in firebase 
   * for the user authenticated.
   */

  if(ev.detail.value === "top10"){
    const ok = this.db.list(`users/${SearchPage.prototype.username}/top10`, ref => ref.limitToFirst(100).orderByKey())
    ok.valueChanges().subscribe(data => (SearchPage.prototype.top10Limit = data.length))
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
    // Pushes anime to the dblist of watching
    this.watching = this.db.list(`users/${this.username}/top10`)
    this.watching.push({anime: anime})
  }
  if(ev.detail.value === "testing"){
    this.db.list(`users/${this.username}/watching`)
    .valueChanges()
    .subscribe(res => {
        console.log(res[0])//should give you the array of percentage. 
    })
    

  }


  }



}