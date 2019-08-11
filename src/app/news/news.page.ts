import { Component, OnInit } from '@angular/core';
import * as $ from "jquery";

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
})
export class NewsPage implements OnInit {

  // sets the default to the upcoming option
  viewMode =  'Upcoming'
  search: string = ""
  data: any
  // sets the default to the upcoming option
  changeUrl = 'https://api.jikan.moe/v3/top/anime/1/upcoming'
  
  constructor() { }

  /**
   * On init the user sees the upcoming anime data and this is updated once they have selected 
   * a new option using the ion select option feature.
   */
  ngOnInit() {
      var self = this
      fetch(self.changeUrl)
      .then(function(response) {
        return response.json();
      })
      .then(function(myJson) {
        self.data = myJson.top
        console.log(myJson.top)
      });
    
  }

  /**
   * Gets the event value from the html side ion select option.
   * Uses the value to determine which type of data to fetch from anime api.
   * This data is then updated html side and allows changing between different subcategories
   * of the top/most relevant anime at the moment.
   * @param ev 
   */
  changer(ev:any){
    var self = this
    if(ev.detail.value === "Upcoming"){
      self.changeUrl = 'https://api.jikan.moe/v3/top/anime/1/upcoming'
      fetch(self.changeUrl)
      .then(function(response) {
        return response.json();
      })
      .then(function(myJson) {
        self.data = myJson.top
        console.log(myJson.top)
      });
    }

    if(ev.detail.value === "Airing"){
      self.changeUrl = 'https://api.jikan.moe/v3/top/anime/1/airing'
      fetch(self.changeUrl)
      .then(function(response) {
        return response.json();
      })
      .then(function(myJson) {
        self.data = myJson.top
        console.log(myJson.top)
      });
    }

    if(ev.detail.value === "Most Popular"){
      self.changeUrl = 'https://api.jikan.moe/v3/top/anime/1/bypopularity'
      fetch(self.changeUrl)
      .then(function(response) {
        return response.json();
      })
      .then(function(myJson) {
        self.data = myJson.top
        console.log(myJson.top)
      });
    }
  }


}
