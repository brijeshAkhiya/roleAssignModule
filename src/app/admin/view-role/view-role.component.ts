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
  public options$: any = []; // All roles with their permissions are stored
  public roles: any[]; // This is to get all permissions to select
  public toggler; // This is to toggle side-nav-bar
  public Permissions: any[] = []; // to get the only the name of the selected checkbox.

  public roleAssignform = this.fb.group({
    sDefaultRole: [''],
    sPermissions: this.fb.array([]),
    sRoleName: ['', Validators.required],
  });

  // to get all sPermissions as an array to push controls in it.
  get options() {
    return this.roleAssignform.get('sPermissions') as FormArray;
  }
  // To get permissions after adding permissions.
  public getPermissions() {
    this.rolesService.getPermissions().subscribe((res: any) => {
      if (res.data.length !== 0) {
        this.options$.saAdmin = [...res?.data.saAdmin];
        this.options$.saContent = [...res?.data.saContent];
        [...this.options$?.saAdmin, ...this.options$?.saContent].forEach((element) => {
          this.options.push(this.fb.control(''));
        });
      }
    });
  }
  // To get data roles creating or updating.
  public getRoles() {
    this.rolesService.viewRoles().subscribe((res: any) => {
      this.roles = [...res.data];
    });
  }

  public ngOnInit() {
    this.getRoles();
    this.getPermissions();
  }

  public valueChange() {
    this.selectedParent = '';
  }
  // To clear selected values and form values after closing the side-nav-bar.
  public clearData(toggle) {
    this.task = 'Create';
    this.roleAssignform.reset();
    this.selectedParent = '';
    this.toggleDrawer(toggle);
  }

  public addcPermissions() {
    const value = prompt('Add permission (note): No Spaces allowed use \'_\' instead');
    if (value !== '') {
      if ([...value].indexOf(' ') === -1) {
        this.rolesService.addPermissions({ saContent: value })
          .then((response: any) => {
            if (response.status) {
              this.snackBar.open(response.message, 'Okay', {
                duration: 2000,
              });
              this.roleAssignform.reset();
              this.selectedParent = '';
              this.getRoles();
              this.getPermissions();
              this.task = 'Create';
            } else if (response.error) {
              this.snackBar.open(response.error, 'Okay', {
                duration: 2000,
              });
            } else {
              this.snackBar.open(response.message, 'Okay', {
                duration: 2000,
              });
            }
          })
          .catch();
      } else {
        alert('There should be no space');
        this.addcPermissions();
      }
    } else {
      alert('Please enter value');
      this.addcPermissions();
    }
  }

  public addaPermissions() {
    const value = prompt('Add permission (note): No Spaces allowed use \'_\' instead');
    if (value !== '') {
      if ([...value].indexOf(' ') === -1) {
        this.rolesService.addPermissions({ saAdmin: value })
          .then((response: any) => {
            if (response.status) {
              this.snackBar.open(response.message, 'Okay', {
                duration: 2000,
              });
              this.roleAssignform.reset();
              this.selectedParent = '';
              this.getPermissions();
              this.getRoles();
              this.task = 'Create';
            } else if (response.error) {
              this.snackBar.open(response.error, 'Okay', {
                duration: 2000,
              });
            } else {
              this.snackBar.open(response.message, 'Okay', {
                duration: 2000,
              });
            }
          })
          .catch(() => {
            alert('Something Went Wrong!!, please try again later');
            this.addaPermissions();
          });
      } else {
        alert('There should be no space');
        this.addaPermissions();
      }
    } else {
      alert('Please enter value');
      this.addaPermissions();
    }
  }

  public editRole(id, roleName, parentValue, toggle) {
    this.id = id;
    this.toggleDrawer(toggle);
    this.task = 'Update';
    this.roleAssignform.controls.sRoleName.setValue(roleName);
    if (parentValue) {
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
          this.getRoles();
          this.task = 'Create';
        } else {
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
    if (parentValue) {
      const select = this.roles.find((element) => element?.sRoleName === parentValue);
      select.sPermissions.forEach((element, values) => {
        this.options.controls[this.options$?.saContent.findIndex((ele) => ele === element) + this.options$.saAdmin.length]?.setValue(true);
        this.options.controls[this.options$?.saAdmin.findIndex((ele) => ele === element)]?.setValue(true);
      });
    }
  }

  public toggleDrawer(value) {
    this.toggler = value;
    this.toggler.toggle();
  }

  public createRole() {
    this.submit = 1;
    this.Permissions = [];
    if (this.roleAssignform.valid) {
      this.submit = 0;
      [...this.options$.saAdmin, ...this.options$.saContent]
        .filter((element, index) => !!this.roleAssignform.value.sPermissions[index])
        .forEach((element) => {
          this.Permissions.push(element);
        });
      const formData = new FormData();
      formData.append('sRoleName', this.roleAssignform.controls.sRoleName.value);
      formData.append('sParent', this.selectedParent);
      formData.append('sPermissions', JSON.stringify(this.Permissions));
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
            this.getRoles();
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
          if (res.error) {
            this.snackBar.open(res.error, 'Okay', {
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
              this.getRoles();
              this.task = 'Create';
            } else if (result.error) {
              this.snackBar.open(result.message, 'Okay', {
                duration: 2000,
              });
              this.roleAssignform.reset();
              this.selectedParent = '';
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
