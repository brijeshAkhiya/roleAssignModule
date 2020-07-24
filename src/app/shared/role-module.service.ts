import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from './../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class RoleModuleService {
  // public permissionSubject: BehaviorSubject<any> = new BehaviorSubject([]);
  constructor(private http: HttpClient) { }
  public getPermissions() {
    return this.http.get(`${environment.backendApiUrl}getpermissions`);
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

  public addPermissions(data) {
    return this.http.put(`${environment.backendApiUrl}addpermissions`, data).toPromise();
  }
}
