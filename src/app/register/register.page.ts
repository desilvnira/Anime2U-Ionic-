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

  /**
   * Registers the user using thr params given
   * Adds the user to firebase once successful in user creation
   * Once user is successfully created they are then navigated to the login page to login
   * @param afAuth 
   * @param alert 
   * @param router 
   * @param db 
   */
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


  /**
   * Registers the user with the app using firebase authentication
   * Successful creation stores this user and their private profile data within the firebase database
   * Any issues regarding creation are caught and returned with respective error messages
   */
  async doRegister(){
    const{username, password, cpassword, favAnime, picURL} = this
    // Checks whether passwords match
    if(password !== cpassword){
      this.doAlert("Passwords do not match!")
      return console.error("Password does not match")
    }
    //Checks whether there is uppercase characters in username
    var i = 0
    while(i < username.length){
      if(username.charAt(i) == username.charAt(i).toUpperCase()){
        this.doAlert("Only lowercase characters allowed for username")
        return 
      }
      i++;
    }
    try{
      const result = await this.afAuth.auth.createUserWithEmailAndPassword(username + '@niran.com', password)
      console.log(result)
      this.doAlert("Account registration successful")
      // Firebase object of username is create under the user object which contains 
      // the user personal data as well as future anime list data
      this.db.object(`users/${username}`)
      .set({
        userID: username, 
        uid: result.user.uid,
        favouriteAnime: favAnime,
        pictureURL: picURL
      });     
      //navigate to login page here
      this.router.navigate(['/login'])      
    }catch(error){
      console.dir(error)
      this.doAlert("Error message: " + error.message)
    }
  }

  /**
   * An alert is presented using the string passed in from register function.
   * Used for cases where usernames is not correct length or contains unwanted characters  
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
