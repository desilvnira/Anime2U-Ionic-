import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth'
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

  /**
   * Sets up angular firebase authentication to login the user.
   * @param afAuth 
   * @param router 
   * @param alert 
   * @param db 
   * @param events 
   */
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

  /**
   * Logs the user in using username and password
   * User is logged in if the username and password is a contained pair in firebase auth
   * Once successfully logged in the user is navigated into tabs which allows them to use the app
   */
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
      if(err.code === "auth/wrong-password"){
        this.doAlert("Error: Password is incorrect")
      }
    }
  }

  /**
   * An alert is presented using the string passed in from login function.
   * Used for cases where username and password do not match or when the user is not contained within 
   * the database.
   * @param message 
   */
  async doAlert(message: string){
    const alert = await this.alert.create({
      message,
      buttons: ["Ok"]
    })

    await alert.present()
  }

  /**
   * Clicking the logo navigates the user back to the home screen
   */
  goHome(){
    this.router.navigate(['/home'])
  }
}
