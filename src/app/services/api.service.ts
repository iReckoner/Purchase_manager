import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://192.168.0.128:5000/api';
    // private apiUrl = 'https://cloud.ireckoner.in:5000/api';
  // private apiUrl = 'https://c0320e7d265d.ngrok-free.app/api';


  constructor(private http: HttpClient) {}
  token: any;
  headers: any;
  userName: any;
  apptype: any;

  getApiUrl(): string {
    return this.apiUrl;
  }

  login(data: { identifier: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, data);
  }


  sendOtp(identifier: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/sendOtp`, { identifier });
  }

  verifyOtp(identifier: string, otp: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/verifyOtp`, { identifier, otp });
  }
  verifyOtp1(identifier: string, otp: string, VisitorId: any,hardLogin:any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/verifyOtp1`, { 'LoginId': identifier,  'VisitorId': VisitorId,hardLogin: hardLogin,'otp':otp});
  }


  getDashboardData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard`);
  }
  getdata(ContactId:string,QueryId:string): Observable<any > {
    // const contactId = sessionStorage.getItem('contactId');
    const payload = {
      contactId: ContactId,
    };
    return this.http.post(`${this.apiUrl}/config/getPrequeryData2?QueryId=${QueryId}`, payload);
  }
  executePmtdata(ContactId:string): Observable<any > {
    // const contactId = sessionStorage.getItem('contactId');
    const payload = {
      ContactId: ContactId,
    };
    return this.http.post(`${this.apiUrl}/config/executePmt`, payload);
  }
  geteventsdata(QueryId:string): Observable<any > {
    // const contactId = sessionStorage.getItem('contactId');
    const payload = {

    };
    return this.http.post(`${this.apiUrl}/config/getPrequeryData2?QueryId=${QueryId}`, payload);
  }

  getImage(): Observable<any> {
    return this.http.get(`${this.apiUrl}/images`);
  }
  getItemname(ItemId:String): Observable<any > {
    // const contactId = sessionStorage.getItem('contactId');
    const payload = {
      ItemId: ItemId,
    };
    return this.http.post(`${this.apiUrl}/config/getItemName`, payload);
  }
  getgreydata(ContactId:string,QueryId:string,param:number): Observable<any > {
    const payload = {
      contactId: ContactId,
      param:param
    };
    return this.http.post(`${this.apiUrl}/config/getPrequeryData2?QueryId=${QueryId}`, payload);
  }
  getrestrauntdata(ContactId:string): Observable<any > {
    const payload = {
      ContactId: ContactId,
    };
    return this.http.post(`${this.apiUrl}/config/getPartyData`, payload);
  }
  UpdateMaster(payload:any,ContactId:string): Observable<any > {
    return this.http.put(`${this.apiUrl}/master/savemaster/${ContactId}`, payload);
  }
  RedemptionRequest(payload:any): Observable<any > {
    return this.http.post(`${this.apiUrl}/master/savemaster/`, payload);
  }
  getgrowthpercent(ContactId:string): Observable<any > {
    const payload = {
      ContactId: ContactId,
    };
    // const token = localStorage.getItem('accessToken'); // or from login response

    // const headers = new HttpHeaders({
    //   Authorization: `Bearer ${token}`
    // });
    debugger;
        //  const headers = this.createAuthorizationHeader();
    return this.http.post(`${this.apiUrl}/config/growthpercent`, payload);
  }

  uploadImage(formData: any, entityType: string, fileName: string) {
    debugger;
    const url = `${this.apiUrl}/images/uploadImage?&EntityType=${entityType}&FileName=${fileName}`;

    return this.http.post(url, formData, {
      reportProgress: true,
      observe: 'events',
      headers: {
        'Accept': 'application/json'
      }
    });
  }
  gettextfile(): Observable<any > {
    return this.http.get(`${this.apiUrl}/images/getTextfile`, { responseType: 'blob' });
  }
  uploadpdf(formData: any, entityType: string, fileName: string) {
    debugger;
    const url = `${this.apiUrl}/images/uploadresumepdf?&EntityType=${entityType}&FileName=${fileName}`;

    return this.http.post(url, formData, {
      reportProgress: true,
      observe: 'events',
      headers: {
        'Accept': 'application/json'
      }
    });
  }
  getresumepdf(fileName:string): Observable<any > {
    return this.http.get(`${this.apiUrl}/images/getresumepdf/${fileName}`, { responseType: 'blob' });
  }
  deletepdf(fileName:string): Observable<any > {

    const url = `${this.apiUrl}/images/deletepdf/${fileName}`;

    return this.http.post(url,  {
      reportProgress: true,
      observe: 'events',
      headers: {
        'Accept': 'application/json'
      }
    });
  }


}
