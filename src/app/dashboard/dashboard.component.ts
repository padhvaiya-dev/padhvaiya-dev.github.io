import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DataService } from '../services/data.service';
import { AlertService } from '../services/alert.service'


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  search: FormControl = new FormControl('');
  questionList: Array<object>;
  searchTerm: string = ' ';
  constructor(
    private _dataService: DataService,
    private _notify: AlertService
  ) { 
    this._dataService.fetchQuestions()
    .subscribe(questionList => {
      this.questionList = questionList;
    },
      err => {
        this._notify.error(err);
      })
  }

  ngOnInit() {
   
  }

}
