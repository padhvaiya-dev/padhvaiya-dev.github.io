import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private toastr: ToastrService) { }

  success(title: string, message: string) {
    this.toastr.success(message, title, {
      toastClass: "alert alert-success alert-with-icon"
    });
  }

  error(title: string, message: string) {
    this.toastr.error(message, title, {
      toastClass: "alert alert-danger alert-with-icon"
    });
  }

  info(title: string, message: string) {
    this.toastr.info(message, title, {
      toastClass: "alert alert-info alert-with-icon"
    });
  }

  warning(title: string, message: string) {
    this.toastr.warning(message, title, {
      toastClass: "alert alert-warning alert-with-icon"
    });
  }

}
