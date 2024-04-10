import { Component, OnInit, inject } from "@angular/core";
import { Router, RouterOutlet } from "@angular/router";
import { PouchDBService } from "./services/pouch-db.service";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent implements OnInit {
  title = "couch-db-sync-test";

  pouchService = inject(PouchDBService);
  router = inject(Router);
  inputval = "8b37f8e2-f8f7-4fe0-bb6d-58bbfde62841";

  ngOnInit(): void {
    console.log("initialize DB");
    this.pouchService.init();
  }

  search() {
    this.router.navigate([`/doc/${this.inputval}`]);
  }
}
