import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Geolocation, Geoposition, GeolocationOptions } from '@ionic-native/geolocation/ngx';
import {  GoogleMaps, GoogleMap, CameraPosition, LatLng } from '@ionic-native/google-maps/ngx';
import { Platform } from '@ionic/angular';
declare var google;

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit, AfterViewInit {
  @ViewChild('mapElement') mapElement: ElementRef;
  map: GoogleMap;

  options: GeolocationOptions;
  currentPos: Geoposition;
  constructor(public plt: Platform, private geolocation: Geolocation, private googleMaps : GoogleMaps) { }
 
  loadMap(){
 
    let latLng = new google.maps.LatLng(-34.9290, 138.6010);
 
    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      timeout: 5000, enableHighAccuracy: true
    }
 
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
 
  }

  async ngAfterViewInit(){
    this.plt.ready().then(() => {
      this.loadMap();
      this.getUserPosition()
    });
    }

  getUserPosition() {
    this.options = {
      enableHighAccuracy: true
    };

    this.geolocation.getCurrentPosition(this.options).then((resp) => {
      console.log('location', resp);
      let latLng = new LatLng(resp.coords.latitude
        ,resp.coords.longitude);
      let Camposition: CameraPosition<LatLng> = {
        target: latLng,
        zoom: 22,
        tilt: 30
     };
     this.map.moveCamera(Camposition)
      // resp.coords.latitude
      // resp.coords.longitude
    }).catch((error) => {
      console.log('Error getting location', error);
    });

    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      // data can be a set of coordinates, or an error (if an error occurred).
      // data.coords.latitude
      // data.coords.longitude
    });

  }

  ngOnInit() {
    // add back when alpha.4 is out
    // navigate(item) {
    //   this.router.navigate(['/list', JSON.stringify(item)]);
    // }
  }
}
