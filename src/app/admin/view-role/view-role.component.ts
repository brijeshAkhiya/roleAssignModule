import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-role',
  styleUrls: ['./view-role.component.css'],
  templateUrl: './view-role.component.html',
})
export class ViewRoleComponent implements OnInit {

  constructor() { }
  // data = ['Add Card', 'Edit Card', 'Update Card', 'Remove Card'];
  public options: any[] = [];
  // selectedData: string[] = ['Add Card', 'Edit Card', 'Update Card', 'Delete Card'];
  public roles: string[] = [];
  public ngOnInit() {
    // this.options.forEach(d => {
    //   this.selectedData.forEach(s => {
    //     if (d.name === s) {
    //       d.value = true;
    //     }
    //   });
    // });
  }
  public isChecked(value) {
  }
  }
