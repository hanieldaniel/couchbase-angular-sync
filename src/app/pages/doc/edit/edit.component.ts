import { Component, OnInit, inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { PouchDBService } from "../../../services/pouch-db.service";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { IOrder } from "../../../models/base";

@Component({
  selector: "app-edit",
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: "./edit.component.html",
  styleUrl: "./edit.component.scss",
})
export class EditComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  pouchService = inject(PouchDBService);
  router = inject(Router);

  editForm = new FormGroup({
    description: new FormControl(""),
    name: new FormControl(""),
  });

  document: IOrder | null = null;
  docId = this.activatedRoute.snapshot.params["docid"];

  ngOnInit(): void {
    this.loadDocument();
  }

  loadDocument() {
    this.pouchService
      .getDocument(this.docId)
      .then((document: IOrder) => {
        this.document = document;
        console.log(document);
        this.editForm.patchValue({
          description: document.description,
          name: document.name,
        });
      })
      .catch((error) => {
        console.error("Error fetching document:", error);
      });
  }

  submit() {
    const response = this.editForm.getRawValue();
    this.pouchService
      .updateDocument(this.document?.projectId ?? "", response)
      .then(() => {
        console.log("Document updated successfully");
        this.router.navigate(["doc", this.document?.projectId]);
      })
      .catch((error) => {
        console.error("Error updating document:", error);
      });
  }
}
