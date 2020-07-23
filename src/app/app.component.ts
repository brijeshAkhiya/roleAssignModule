import { Component, OnInit } from '@angular/core';
import { RoleModuleService } from './shared/role-module.service';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.css'],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  constructor(private roleService: RoleModuleService) { }
  public title = 'roleassign';
  ngOnInit() {
    this.roleService.getPermissions();
  }
}
