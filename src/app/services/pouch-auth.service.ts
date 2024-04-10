import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { of } from "rxjs/internal/observable/of";
import { map } from "rxjs/internal/operators/map";

interface ISessionResponse {
  session_id: string;
  expires: Date;
  cookie_name: string;
}

@Injectable({
  providedIn: "root",
})
export class PouchAuthService {
  private readonly SESSION_ID_KEY = "sessionId";
  private readonly SESSION_EXPIRATION_KEY = "sessionExpiration";

  constructor(private http: HttpClient) {}

  getSessionId(): Observable<string> {
    const sessionId = localStorage.getItem(this.SESSION_ID_KEY);
    const sessionExpiration = localStorage.getItem(this.SESSION_EXPIRATION_KEY);

    if (sessionId && sessionExpiration) {
      const expirationTime = parseInt(sessionExpiration, 10);
      if (expirationTime > Date.now()) {
        return of(sessionId);
      }
    }
    return this.fetchSessionIdFromAPI();
  }

  private fetchSessionIdFromAPI(): Observable<string> {
    // Make an HTTP request to fetch session ID from API
    return this.http
      .post<ISessionResponse>("http://localhost:4000/api/session", {
        name: "demo@example.com",
        ttl: 1800,
      })
      .pipe(
        map((x) => {
          this.setSessionId(x.session_id, x.expires);
          return x.session_id;
        }),
      );
  }

  setSessionId(sessionId: string, expiresIn: Date): void {
    const expirationTime = new Date(expiresIn).getTime(); // Convert expiresIn to milliseconds
    localStorage.setItem(this.SESSION_ID_KEY, sessionId);
    localStorage.setItem(
      this.SESSION_EXPIRATION_KEY,
      expirationTime.toString(),
    );

    // Check for expiration periodically
    setTimeout(() => {
      this.removeSessionIdIfExpired();
    }, expirationTime / 100);
  }

  private removeSessionIdIfExpired(): void {
    const sessionExpiration = localStorage.getItem(this.SESSION_EXPIRATION_KEY);
    if (sessionExpiration && parseInt(sessionExpiration, 10) <= Date.now()) {
      localStorage.removeItem(this.SESSION_ID_KEY);
      localStorage.removeItem(this.SESSION_EXPIRATION_KEY);
    }
  }
}
