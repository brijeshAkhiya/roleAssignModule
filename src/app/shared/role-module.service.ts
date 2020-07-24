import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from './../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class RoleModuleService {
  public permissionSubject: BehaviorSubject<any> = new BehaviorSubject([]);
  public ApiUrl: string;
  public tempObj: any = {};
  public tempArr = [];
  public saAdmin = [];
  public saContent = [];
  constructor(private http: HttpClient) { }
  public getPermissions() {
    this.http.get(`${environment.backendApiUrl}getpermissions`).subscribe((res: any) => {
      this.permissionSubject.next(res.data);
    });
  }

  public getPermissionSubject() {
    return this.permissionSubject.asObservable();
  }

  public viewRoles() {
    return this.http.get(`${environment.backendApiUrl}viewrole`);
  }

  public createRole(data) {
    return this.http.post(`${environment.backendApiUrl}createrole`, data).toPromise();
  }

  public updateRole(data) {
    return this.http.put(`${environment.backendApiUrl}editRole`, data).toPromise();
  }

  public deleteRole(data) {
    return this.http.delete(`${environment.backendApiUrl}deleterole/${data}`).toPromise();
  }
}
