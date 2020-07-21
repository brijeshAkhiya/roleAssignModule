import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-role',
  templateUrl: './view-role.component.html',
  styleUrls: ['./view-role.component.css']
})
export class ViewRoleComponent implements OnInit {

  constructor() { }
  data = ['Add Card', 'Edit Card', 'Update Card', 'Remove Card'];
  options = [];
  selectedData: string[] = ['Add Card', 'Edit Card', 'Update Card'];
  roles: string[] = ['Admin', 'Consumer', 'Editor', 'Tech Support', 'Guest Contributor', 'Publisher'];
  ngOnInit() {
    // this.options.forEach(d => {
    //   this.selectedData.forEach(s => {
    //     if (d.name === s) {
    //       d.value = true;
    //     }
    //   });
    // });
  }
  isChecked(value) {
  }
  }

