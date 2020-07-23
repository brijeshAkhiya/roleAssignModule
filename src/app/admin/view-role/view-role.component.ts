import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { RoleModuleService } from './../../shared/role-module.service';

@Component({
  selector: 'app-view-role',
  styleUrls: ['./view-role.component.css'],
  templateUrl: './view-role.component.html',
})
export class ViewRoleComponent implements OnInit {
  constructor(private rolesService: RoleModuleService, private snackBar: MatSnackBar, private fb: FormBuilder) { }
  public fd: FormData = new FormData();
  public submit = 0;
  public selectedParent;
  public selectedOption;
  public position = 'bottom-right';
  public permissions = [];
  public options$: any = [];
  public temp;
  public roles: Observable<any>;
  public name = '';
  public toggler;
  public display = false;
  public sPermissions: any[] = [];
  public values;
  public roleAssignform = this.fb.group({
    sDefaultRole: [''],
    sPermissions: this.fb.array([]),
    sRoleName: ['', Validators.required],
  });
  get options() {
    return this.roleAssignform.get('sPermissions') as FormArray;
  }
  public getData() {
    this.rolesService.getPermissionSubject().subscribe((res) => {
      this.options$ = res;
    });
    this.rolesService.viewRoles().subscribe((res: any) => {
      this.roles = res.data;
    });
  }
  public ngOnInit() {
    this.rolesService.getPermissionSubject().subscribe((res) => {
      this.options$ = res;
      if (res.length !== 0 || res !== undefined) {
        // tslint:disable-next-line: forin
        for (const values in res.saAdmin) {
          this.options.push(this.fb.control(''));
        }
        // tslint:disable-next-line: forin
        for (const values in res.saContent) {
          this.options.push(this.fb.control(''));
        }
      }
    });
    this.rolesService.viewRoles().subscribe((res: any) => {
      this.roles = res.data;
    });
  }

  public toggleDrawer(value) {
    this.toggler = value;
    this.toggler.toggle();
  }

  public createRole() {
    this.submit = 1;
    if (this.roleAssignform.valid) {
      this.submit = 0;
      this.permissions = this.options$.saAdmin.concat(this.options$.saContent);
      this.selectedOption = this.permissions.filter((element, index) => !!this.roleAssignform.value.sPermissions[index]);
      this.selectedOption.forEach((element) => {
        this.sPermissions.push(element.name);
      });
      const formData = new FormData();
      formData.append('sRoleName', this.roleAssignform.controls.sRoleName.value);
      formData.append('sParent', this.selectedParent);
      formData.append('sPermissions', JSON.stringify(this.sPermissions));
      const obj = {};
      formData.forEach((value, key) => {
        obj[key] = value;
      });
      this.rolesService.createRole(obj).then((res: any) => {
        if (res.responseCode === 10001) {
          this.toggler.toggle();
          this.snackBar.open(res.message, 'Okay', {
            duration: 2000,
          });
          this.roleAssignform.reset();
          this.getData();
        }
        if (res.responseCode === 10003) {
          this.snackBar.open(res.message, 'Okay', {
            duration: 2000,
          });
        }
        if (res.responseCode === 10005) {
          this.toggler.toggle();
          this.snackBar.open(res.message, 'Okay', {
            duration: 2000,
          });
          this.roleAssignform.reset();
        }
      }).catch((err) => console.log(err));
    } else {
      setTimeout(() => {
        this.roleAssignform.reset();
        this.submit = 0;
      }, 1000);
      console.log((this.roleAssignform.controls.sRoleName.errors?.required && this.roleAssignform.controls.sRoleName.dirty) || this.submit);
    }
  }
}
