import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BusyService {

  loading = false;
  busyRequstCount=0;

  busy(){
    this.busyRequstCount++;
    this.loading = true;
  }

  
  idle(){
    this.busyRequstCount--;
    if(this.busyRequstCount <=0){
      this.busyRequstCount = 0;
      this.loading= false;
    }
  }
}
