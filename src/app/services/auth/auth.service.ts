import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment';
import {map, tap} from 'rxjs/operators';
import {UserModel} from 'src/app/models/user/user.model';
import {Store} from "@ngrx/store";
import * as acciones from '../../store/actions';
import * as utils from '../../utils/functions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  data: any;

  constructor(private http: HttpClient, private store: Store) {
  }

  login(datos: any): Observable<any> {
    this.data = {username: btoa(datos.Username), password: btoa(datos.Password)};
    return this.http
      .post(`${environment.apiTestUrl}security/gettoken`, this.data)
    /*.pipe(map((userData) => userData), tap((data:any) => {
      if(data.Token != '-1'){
        localStorage.setItem('token',data.Token);
        this.store.dispatch(acciones.cargarUsuarios({ token: data.Token }));
      }
      else{
        utils.showAlert('Credenciales Incorrectas!','error');
      }
    }));*/
  }

  getBasicInformation(token: string): Observable<any> {
    return this.http
      .get(`${environment.apiTestUrl}users/GetUserBasicInformation?token=${token}`)
    // .pipe(map((userPermission) => userPermission));
  }

  getUserPermissions(token: string): Observable<any> {
    return this.http
      .get(`${environment.apiTestUrl}security/GetUserPermisions?token=${token}&AppId=3`)
      .pipe(map((userPermission) => userPermission));
  }

  public saveStorage(token: string, document: string, user: UserModel, ResumedPermissions: any): any {
    localStorage.setItem('token', btoa(token));//atob()
    localStorage.setItem('userStorage', JSON.stringify(user));
    localStorage.setItem('ResumedPermissions', JSON.stringify(ResumedPermissions));
    //this.token = token;
  }

  public getDept(token: any, username: any) {
    return this.http.get(`${environment.apiTestUrl}users/getusers?token=${token}&username=${username}`);
  }

  public isLogin() {
    let token = atob(localStorage.getItem('token')!);
    return this.http.get(`${environment.apiTestUrl}security/CheckToken?token=${token}`);
    // return token ? true : false;
  }

  public logout(token: string) {
    this.data = {token: token};
    return this.http
      .post(`${environment.apiTestUrl}security/CancelTokens`, this.data);
  }

  public userError() {
    console.log('error');
  }

  getEntidades(user:string){
    return this.http.get(`${environment.apiTestUrl}contratos/getEntidadesEstatales?username=${user}`);
  }
}
