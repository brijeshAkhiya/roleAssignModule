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
  public submit = 0; // This is for user to click the submit button once.
  public selectedParent; // This is for the dropdown selected value.
  public id = ''; // This is to get the id of the card while editing.
  public task = 'Create'; // This is for which task is going on (Create || Update).
  public selectedOption; // Which checkboxes are selected
  public permissions = []; // all the permissions are merged with thier selected value
  public options$: any = []; // All roles with their permissions are stored
  public roles: any[]; // This is to get all permissions to select
  public toggler; // This is to toggle side-nav-bar
  public sPermissions: any[] = []; // to get the only the name of the selected checkbox.

  public roleAssignform = this.fb.group({
    sDefaultRole: [''],
    sPermissions: this.fb.array([]),
    sRoleName: ['', Validators.required],
  });

  // to get all sPermissions as an array to push controls in it.
  get options() {
    return this.roleAssignform.get('sPermissions') as FormArray;
  }

  // To get data after creating or updating.
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

  // To clear selected values and form values after closing the side-nav-bar.
  public clearData(toggle) {
    this.task = 'Create';
    this.roleAssignform.reset();
    this.selectedParent = '';
    this.toggleDrawer(toggle);
  }

  public updateRole() {
    this.sPermissions = [];
    this.permissions = this.options$.saAdmin.concat(this.options$.saContent);
    this.selectedOption = this.permissions.filter((element, index) => !!this.roleAssignform.value.sPermissions[index]);
    this.selectedOption.forEach((element) => {
      this.sPermissions.push(element.name);
    });
  }

  public editRole(id, roleName, parentValue, toggle) {
    this.id = id;
    this.toggleDrawer(toggle);
    this.task = 'Update';
    this.roleAssignform.controls.sRoleName.setValue(roleName);
    if (parentValue !== 'undefined' || parentValue === '') {
      this.selectedParent = parentValue;
      this.getSelectedOptions(roleName);
    } else {
      this.selectedParent = '';
      this.getSelectedOptions(roleName);
    }
  }

  public deleteRole(id) {
    this.rolesService.deleteRole(id)
      .then((result: any) => {
        if (result.status) {
          this.snackBar.open(result.message, 'Okay', {
            duration: 2000,
          });
          this.roleAssignform.reset();
          this.selectedParent = '';
          this.getData();
          this.task = 'Create';
        } else {
          console.log(result);
          this.snackBar.open(result.message, 'Okay', {
            duration: 2000,
          });
        }
      })
      .catch((err) => {
        alert('Something Went Wrong!!, please try again later');
        this.roleAssignform.reset();
        this.selectedParent = '';
        console.log(err);
      });
  }

  // To get selected option
  public getSelectedOptions(parentValue) {
    this.options.reset();
    this.roles.forEach((element, i) => {
      if (element.sRoleName === parentValue) {
        // tslint:disable-next-line: forin
        for (const values in element.sPermissions) {
          this.options$.saContent.forEach((ele, index) => {
            if (ele.name === element.sPermissions[values]) {
              this.options.controls[index + this.options$.saAdmin.length]?.setValue(true);
            }
          });
          this.options$.saAdmin.forEach((ele, index) => {
            if (ele.name === element.sPermissions[values]) {
              this.options.controls[index]?.setValue(true);
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
    this.sPermissions = [];
    if (this.roleAssignform.valid) {
      console.log(this.roleAssignform.value);
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
      if (this.task === 'Create') {
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
        }).catch((err) => {
          alert('Something Went Wrong!!, please try again later');
          console.log(err);
        });
      } else {
        Object.assign(obj, { id: this.id });
        this.rolesService.updateRole(obj)
          .then((result: any) => {
            if (result.status) {
              this.toggler.toggle();
              this.snackBar.open(result.message, 'Okay', {
                duration: 2000,
              });
              this.roleAssignform.reset();
              this.selectedParent = '';
              this.getData();
              this.task = 'Create';
            } else {
              this.snackBar.open(result.message, 'Okay', {
                duration: 2000,
              });
            }
          })
          .catch((err) => {
            alert('Something Went Wrong!!, please try again later');
            this.toggler.toggle();
            this.roleAssignform.reset();
            this.selectedParent = '';
            console.log(err);
          });
      }
    } else {
      setTimeout(() => {
        this.roleAssignform.reset();
        this.submit = 0;
      }, 1000);
    }
  }
}
