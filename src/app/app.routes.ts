import { Routes } from "@angular/router";
import { DocComponent } from "./pages/doc/doc.component";
import { EditComponent } from "./pages/doc/edit/edit.component";

export const routes: Routes = [
  {
    path: "",
    component: DocComponent,
  },
  {
    path: "doc/:docid",
    component: DocComponent,
  },
  {
    path: "doc/:docid/edit",
    component: EditComponent,
  },
];
