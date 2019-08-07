import { Component, OnInit } from '@angular/core';
import * as $ from "jquery";

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
})
export class NewsPage implements OnInit {

  viewMode =  'Upcoming'
  search: string = ""
  data: any
  changeUrl = 'https://api.jikan.moe/v3/top/anime/1/upcoming'
  
  constructor() { }

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
