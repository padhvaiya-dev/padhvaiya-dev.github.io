import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private toastr: ToastrService) { }

  success(message: string) {
    this.toastr.success(message, '', {
      toastClass: "alert alert-success alert-with-icon"
    });
  }

  error(message: string) {
    this.toastr.error(message, '', {
      toastClass: "alert alert-danger alert-with-icon"
    });
  }

  info(message: string) {
    this.toastr.info(message, '', {
      toastClass: "alert alert-info alert-with-icon"
    });
  }

  warning(message: string) {
    this.toastr.warning(message, '', {
      toastClass: "alert alert-warning alert-with-icon"
    });
  }

}
