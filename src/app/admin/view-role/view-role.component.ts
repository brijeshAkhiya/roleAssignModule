import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
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
  public roles: any[];
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

  public clearData(toggle) {
    this.roleAssignform.reset();
    this.selectedParent = '';
    this.toggleDrawer(toggle);
  }

  public editRole(id, roleName, parentValue, toggle) {
    this.toggleDrawer(toggle);
    this.roleAssignform.controls.sRoleName.setValue(roleName);
    if (parentValue !== 'undefined') {
      this.selectedParent = parentValue;
      this.getSelectedOptions(roleName);
    } else {
      this.selectedParent = '';
      this.getSelectedOptions(roleName);
    }
  }

  public deleteRole(id) {
    console.log(id);
  }

  public getSelectedOptions(parentValue) {
    this.options$?.saContent.forEach((ele, values) => {
      this.options.controls[parseInt(values, 10) + this.options$.saAdmin.length].reset();
      ele.value = '';
    });
    this.options$?.saAdmin.forEach((ele, values) => {
      ele.value = '';
      this.options.controls[values].reset();
    });
    this.roles.forEach((element, i) => {
      if (element.sRoleName === parentValue) {
        // tslint:disable-next-line: forin
        for (const values in element.sPermissions) {
          this.options$.saContent.forEach((ele, index) => {
            if (ele.name === element.sPermissions[values]) {
              this.options.controls[index + this.options$.saAdmin.length]?.setValue(true);
              ele.value = true;
            }
          });
          this.options$.saAdmin.forEach((ele, index) => {
            if (ele.name === element.sPermissions[values]) {
              this.options.controls[index]?.setValue(true);
              ele.value = true;
            }
          });
        }
      }
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
          this.selectedParent = '';
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
          this.selectedParent = '';
        }
      }).catch((err) => console.log(err));
    } else {
      setTimeout(() => {
        this.roleAssignform.reset();
        this.submit = 0;
      }, 1000);
    }
  }
}
