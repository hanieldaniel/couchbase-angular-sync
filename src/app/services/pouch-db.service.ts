import { Injectable } from "@angular/core";
import PouchDB from "pouchdb";
import pouchdbHttp from "pouchdb-adapter-http";
import { PouchAuthService } from "./pouch-auth.service";
import { Observable } from "rxjs/internal/Observable";
import { fromEventPattern } from "rxjs/internal/observable/fromEventPattern";

@Injectable({
  providedIn: "root",
})
export class PouchDBService {
  private db: PouchDB.Database;
  private sgURL = "http://localhost:4984/projects";

  constructor(private auth: PouchAuthService) {
    PouchDB.plugin(pouchdbHttp);
    this.db = new PouchDB("test-pouch");
  }

  init() {
    this.setupSync();
  }

  async setupSync() {
    const sessionId = await this.auth.getSessionId().toPromise();

    if (!sessionId) {
      throw new Error("Failed to obtain session ID");
    }

    const options = {
      live: true,
      retry: true,
      ajax: {
        headers: {
          Authorization: "Session " + sessionId,
        },
      },
    };

    await this.db
      .sync(this.sgURL, options)
      .on("change", function (info) {
        console.log("Sync change:", info);
      })
      .on("paused", function () {
        console.log("Sync paused");
      })
      .on("active", function () {
        console.log("Sync resumed");
      })
      .on("error", function (err) {
        console.error("Sync error:", err);
      });
  }

  getDocument(id: string): Promise<any> {
    console.log(this.db.get(id));
    return this.db.get(id);
  }

  watchDocumentUpdates(id: string): Observable<any> {
    return new Observable((observer) => {
      const changes = this.db
        .changes({
          since: "now",
          live: true,
          include_docs: true,
          doc_ids: [id],
        })
        .on("change", (change) => observer.next(change.doc));

      return () => changes.cancel();
    });
  }

  updateDocument(documentId: string, updatedDocument: any): Promise<any> {
    return this.db
      .get(documentId)
      .then((doc) => {
        const updatedDoc = { ...doc, ...updatedDocument };
        return this.db.put(updatedDoc);
      })
      .catch((error) => {
        console.error("Error updating document:", error);
        throw error;
      });
  }
}
