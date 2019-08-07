import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth'
import { auth } from 'firebase/app'
import { NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { LoginPage } from '../login/login.page';
import { AngularFireDatabase, AngularFireObject, AngularFireList } from '@angular/fire/database';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  providers: [AngularFireDatabase]
})
export class RegisterPage implements OnInit {

  itemRef: AngularFireObject<any>;
  item: Observable<any>;
  userId: any
  watching: AngularFireList<any>;
  completed: AngularFireList<any>;

  username: string = ""
  password: string = ""
  cpassword: string = ""
  favAnime: string = ""
  picURL: string = ""
  constructor(public afAuth: AngularFireAuth,
     public alert: AlertController,
     public router: Router,
     public db: AngularFireDatabase
     ) {
      this.itemRef = db.object('users');
      this.item = this.itemRef.valueChanges();
      }

  ngOnInit() {
  }


  async doRegister(){
    const{username, password, cpassword, favAnime, picURL} = this
    if(password !== cpassword){
      this.doAlert("Passwords do not match!")
      return console.error("Password does not match")
    }
    try{
      const result = await this.afAuth.auth.createUserWithEmailAndPassword(username + '@niran.com', password)
      console.log(result)
      this.doAlert("Account registration successful")

      this.db.object(`users/${username}`)
      .set({
        userID: username, 
        uid: result.user.uid,
        favouriteAnime: favAnime,
        pictureURL: picURL
      });
      
      this.watching = this.db.list(`users/${username}/watching`)


      this.router.navigate(['/login']) 
      //navigate to login page here
      
      
      
    }catch(error){
      console.dir(error)
      this.doAlert("Error message: " + error.message)
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
