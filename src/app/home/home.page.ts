import { ChangeDetectionStrategy, Component, OnInit, AfterViewInit } from '@angular/core';

import { Chart } from 'chart.js';
import { CompactType, DisplayGrid, GridsterConfig, GridsterItem, GridType } from 'angular-gridster2';
import { AlertController } from '@ionic/angular';
import { WebsocketService } from '../websocket.service';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  user: any;
  topic: string;
  doughnutChart: any;
  lineChart: any;
  value = 'all';
  
  drag_resize = true;
  options: GridsterConfig;
  dashboardItems: any;
  refreshInterval: any;

  acceleration: GridsterItem = { cols: 6, rows: 4, y: 0, x: 0 };
  accelerationItem = { name: 'acceleration', item: this.acceleration }
  accelerationChart: any;

  ecg: GridsterItem = { cols: 4, rows: 3, y: 4, x: 0 };
  ecgItem = { name: 'ecg', item: this.ecg }
  ecgChart: any;

  heartRate: GridsterItem = { cols: 2, rows: 3, y: 4, x: 4 };
  heartRateItem = { name: 'heartRate', item: this.heartRate };
  heartRateChart: any;

  respiration: GridsterItem = { cols: 6, rows: 3, y: 7, x: 0 };
  respirationItem = { name: 'respiration', item: this.respiration };
  respirationChart: any;

  history: GridsterItem = { cols: 6, rows: 6, y: 10, x: 0, minItemCols: 6, maxItemCols: 6 };
  historyItem = { name: 'history', item: this.history };
  historyChart: any;

  customActionSheetOptions: any = {
    header: 'Sensors',
    subHeader: 'Select a Sensor to visualize'
  };

  customActionSheetOptions2: any = {
    header: 'Drag & resize',
    subHeader: 'Enable or disable drag and resize'
  };

  

  public accelerationData:Array<any> = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Acc_x'},
    {data: [28, 48, 40, 19, 86, 27, 90], label: 'Acc_y'},
    {data: [18, 48, 77, 9, 100, 27, 40], label: 'Acc_z'}
  ];
  public accelerationLabels:Array<any> = new Array(7);
  public accelerationOptions:any = {
    responsive: true
  };
  
  public accelerationLegend:boolean = true;
  public accelerationType:string = 'line';

  public ecgData:Array<any> = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'ECG'}
  ];
  public ecgLabels:Array<any> = new Array(7);
  public ecgOptions:any = {
    responsive: true
  };
  
  public ecgLegend:boolean = true;
  public ecgType:string = 'line';

  public respirationData:Array<any> = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Respiration signal (abdominal)'},
    {data: [28, 48, 40, 19, 86, 27, 90], label: 'Respiration signal (thorasic)'}
  ];
  public respirationLabels:Array<any> = new Array(7);
  public respirationOptions:any = {
    responsive: true
  };
  
  public respirationLegend:boolean = true;
  public respirationType:string = 'line';

  constructor(public alertController: AlertController, public ws: WebsocketService, public auth: AuthService) {
    // Providing some options.
  }

  ngOnInit() {
    
    // Subscribing to the websocket 

    this.ws.onNewMessage().subscribe(msg => {
      console.log('got a msg: ' + msg);
    });

    this.user = JSON.parse(localStorage.getItem('user'));
    if (this.user.sensors.ecgID) {
      this.topic = this.user.sensors.ecgID;
      console.log(this.topic);
    } else this.presentAlert();

    // init Dashboard options
    this.options = {
      gridType: GridType.ScrollVertical,
      compactType: CompactType.None,
      margin: 5,
      outerMargin: true,
      outerMarginTop: null,
      outerMarginRight: null,
      outerMarginBottom: null,
      outerMarginLeft: null,
      useTransformPositioning: true,
      mobileBreakpoint: 300,
      minCols: 1,
      maxCols: 100,
      minRows: 1,
      maxRows: 100,
      maxItemCols: 100,
      minItemCols: 1,
      maxItemRows: 100,
      minItemRows: 1,
      maxItemArea: 2500,
      minItemArea: 1,
      defaultItemCols: 1,
      defaultItemRows: 1,
      fixedColWidth: 105,
      fixedRowHeight: 105,
      keepFixedHeightInMobile: false,
      keepFixedWidthInMobile: false,
      scrollSensitivity: 10,
      scrollSpeed: 20,
      enableEmptyCellClick: false,
      enableEmptyCellContextMenu: false,
      enableEmptyCellDrop: false,
      enableEmptyCellDrag: false,
      emptyCellDragMaxCols: 50,
      emptyCellDragMaxRows: 50,
      ignoreMarginInRow: false,
      draggable: {
        enabled: this.drag_resize
      },
      resizable: {
        enabled: this.drag_resize,
        handles: {
          s: false,
          e: false,
          n: false,
          w: false,
          se: true,
          ne: true,
          sw: true,
          nw: true
        }
      },
      swap: false,
      pushItems: true,
      disablePushOnDrag: false,
      disablePushOnResize: false,
      pushDirections: { north: true, east: true, south: true, west: true },
      pushResizeItems: false,
      displayGrid: DisplayGrid.None,
      disableWindowResize: true,
      disableWarnings: false,
      scrollToNewItems: false
    };

    // Dashboard content
    this.dashboardItems = [
      this.accelerationItem,
      this.ecgItem,
      this.heartRateItem,
      this.respirationItem,
      this.historyItem
    ];
  }

  segmentChanged($event){
    console.log($event.target.value);
    switch ($event.target.value) {
      case 'start':
        this.startRealTime();
        break;
    
      default:
      this.stopRealTime();
        break;
    }
    
  }

  startRealTime() {
    this.refreshInterval = setInterval(() => {
      this.ws.sendMessage(this.topic); console.log('requesting ...');
    }, 2500);
  }
  stopRealTime(){
    clearInterval(this.refreshInterval);
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Topic',
      subHeader: 'Enter topic name',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Ex: my_topic_name'
        }],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            if (data.name) {
              this.topic = data.name;
              //window.location.reload();
              this.user.sensors.ecgID = data.name;
              this.auth.update(this.user);
              localStorage.setItem('user', JSON.stringify(this.user));
              console.log('Confirm Ok', JSON.stringify(data), this.topic);
            }
          }
        }
      ]
    });
    await alert.present();
  }

  show(item) {
    console.log(item);
    switch (item) {
      case 'acceleration':
        this.dashboardItems = [
          this.accelerationItem,
        ];
        break;

      case 'ecg':
        this.dashboardItems = [
        { name: 'ecg', item: { cols: 4, rows: 3, y: 0, x: 0 } },
        { name: 'heartRate', item: { cols: 4, rows: 3, y: 0, x: 0 } },
        ];
        break;

      case 'respiration':
        this.dashboardItems = [
          { name: 'respiration', item: { cols: 6, rows: 6, y: 0, x: 0 } }
        ];
        break;

      case 'history':
        this.dashboardItems = [
          { name: 'history', item: { cols: 6, rows: 6, y: 0, x: 0, minItemCols: 6, maxItemCols: 6 } }
        ];
        break;

      default:
        this.dashboardItems = [
          this.accelerationItem,
          this.ecgItem,
          this.heartRateItem,
          this.respirationItem,
          this.historyItem
        ];
        break;
    }
  }

  drag(option) {
    switch (option) {
      case 'disabled':
        this.drag_resize = false;
        break;

      default:
        break;
    }
  }
  changedOptions() {
    if (this.options.api && this.options.api.optionsChanged) {
      this.options.api.optionsChanged();
    }
  }

  removeItem($event, item) {
    $event.preventDefault();
    $event.stopPropagation();
    this.dashboardItems.splice(this.dashboardItems.indexOf(item), 1);
  }

  addItem() {
    this.dashboardItems.push({ name: 'ecg', item: { x: 0, y: 0, cols: 2, rows: 2 } });
  }



}
