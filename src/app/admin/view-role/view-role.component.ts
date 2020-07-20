import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-role',
  templateUrl: './view-role.component.html',
  styleUrls: ['./view-role.component.css']
})
export class ViewRoleComponent implements OnInit {

  constructor() { }
  roles: string[] = ['Admin', 'Consumer', 'Editor', 'Tech Support', 'Guest Contributor', 'Publisher'];
  ngOnInit(): void {
  }

}