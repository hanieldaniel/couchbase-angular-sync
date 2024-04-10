import { Component, OnInit, inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { PouchDBService } from "../../services/pouch-db.service";
import { CommonModule } from "@angular/common";
import { Subscription } from "rxjs/internal/Subscription";
import { IOrder } from "../../models/base";

@Component({
  selector: "app-doc",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./doc.component.html",
  styleUrl: "./doc.component.scss",
})
export class DocComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  pouchService = inject(PouchDBService);
  router = inject(Router);

  document: IOrder | null = null;
  docId = this.activatedRoute.snapshot.params["docid"];
  documentSubscription!: Subscription;

  ngOnInit(): void {
    this.loadDocument();
    this.listenForUpdates();
  }

  loadDocument() {
    this.pouchService
      .getDocument(this.docId)
      .then((document) => {
        this.document = document;
      })
      .catch((error) => {
        console.error("Error fetching document:", error);
      });
  }

  listenForUpdates() {
    this.documentSubscription = this.pouchService
      .watchDocumentUpdates(this.docId)
      .subscribe((change) => {
        this.loadDocument(); // Reload the document whenever it's updated
      });
  }

  editDoc(id: string) {
    this.router.navigate(["doc", id, "edit"]);
  }

  ngOnDestroy(): void {
    this.documentSubscription.unsubscribe();
  }
}
