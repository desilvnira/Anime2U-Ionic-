import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth'
import { auth } from 'firebase/app'
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AngularFireDatabase, AngularFireObject, AngularFireList } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { Events } from '@ionic/angular';



@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  providers: [AngularFireDatabase]
})
export class LoginPage implements OnInit {

  itemRef: AngularFireObject<any>;
  item: Observable<any>;
  userId: any
  watching: AngularFireList<any>;
  completed: AngularFireList<any>;
  
  username: string = ""
  password: string = ""
  constructor(public afAuth:
     AngularFireAuth,
     public router: Router, 
     public alert: AlertController,
     public db:
     AngularFireDatabase,
     public events: Events
     ) {

      this.itemRef = db.object('users');
    this.item = this.itemRef.valueChanges();

   }

  ngOnInit() {
  }

  async login(){
    const {username, password} = this
    try{
      
      
      const result = await this.afAuth.auth.signInWithEmailAndPassword(username + '@niran.com', password)
            
      this.userId = result.user.uid
      console.log("UserID: " + this.userId)

      this.router.navigate(['/tabs'])
    }catch(err){
      console.dir(err)
      if(err.code === "auth/user-not-found"){
        this.doAlert("Error: User not found")
      }
    }
  }

  async doAlert(message: string){
    const alert = await this.alert.create({
      message,
      buttons: ["Ok"]
    })

    await alert.present()
  }
}
