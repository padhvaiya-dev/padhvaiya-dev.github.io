import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { DataService } from '../services/data.service';
import { AlertService } from '../services/alert.service'


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  searchBox: FormGroup;
  questionList: Array<object>;
  constructor(
    private _fb: FormBuilder,
    private _dataService: DataService,
    private _notify: AlertService
  ) { }

  ngOnInit() {
    this.searchBox = this._fb.group({
      search: ['']
    })
    this._dataService.fetchQuestions()
      .subscribe(questionList => {
        this.questionList = questionList;
      },
        err => {
          this._notify.error(err);
        })
  }

}
