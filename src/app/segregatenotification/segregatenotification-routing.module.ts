import { NgModule } from "@angular/core";
import { Routes, RouterModule, Router } from "@angular/router";

import { SegregatenotificationPage } from "./segregatenotification.page";

let userlist = JSON.parse(localStorage.getItem("userlist"));
let oillossnotificationflag = userlist.oilloss_notification_flag;

let newRoutes: any;
let router: Router;

const routes_general: Routes = [
  {
    path: "",
    component: SegregatenotificationPage,
  },
];

const routes_maintenance: Routes = [
  {
    path: "",
    component: SegregatenotificationPage,
    children: [
      {
        path: "tabmillstatus",
        children: [
          {
            path: "",
            loadChildren: () =>
              import(
                "../segregatenotificatepages/segregatenotificationmillstatus/segregatenotificationmillstatus.module"
              ).then((m) => m.SegregatenotificationmillstatusPageModule),
          },
        ],
      },
      {
        path: "tabmaintenancenotification",
        children: [
          {
            path: "",
            loadChildren: () =>
              import(
                "../segregatenotificatepages/segregatenotificationmaintenancenotification/segregatenotificationmaintenancenotification.module"
              ).then(
                (m) => m.SegregatenotificationmaintenancenotificationPageModule
              ),
          },
        ],
      },
      {
        path: "tabalerts",
        children: [
          {
            path: "",
            loadChildren: () =>
              import(
                "../segregatenotificatepages/segregatenotificationalerts/segregatenotificationalerts.module"
              ).then((m) => m.SegregatenotificationalertsPageModule),
          },
        ],
      },
      {
        path: "",
        redirectTo: "/segregatenotification/tabmillstatus",
        pathMatch: "full",
      },
    ],
  },
];

const routes_maintenanceengineer: Routes = [
  {
    path: "",
    component: SegregatenotificationPage,
    children: [
      {
        path: "tabalerts",
        children: [
          {
            path: "",
            loadChildren: () =>
              import(
                "../segregatenotificatepages/segregatenotificationalerts/segregatenotificationalerts.module"
              ).then((m) => m.SegregatenotificationalertsPageModule),
          },
        ],
      },
      {
        path: "tabmaintenancenotification",
        children: [
          {
            path: "",
            loadChildren: () =>
              import(
                "../segregatenotificatepages/segregatenotificationmaintenancenotification/segregatenotificationmaintenancenotification.module"
              ).then(
                (m) => m.SegregatenotificationmaintenancenotificationPageModule
              ),
          },
        ],
      },
      {
        path: "",
        redirectTo: "/segregatenotification/tabalerts",
        pathMatch: "full",
      },
    ],
  },
];

if (userlist) {
  if (userlist.dept_id) {
    if (userlist.dept_id == 7) {
      if (userlist.desigId == 2) {
        newRoutes = routes_maintenanceengineer;
      } else if (userlist.desigId == 4 || userlist.desigId == 6) {
        newRoutes = routes_maintenance;
      } else {
        newRoutes = routes_general;
      }
    } else if (userlist.dept_id == 4) {
      if (userlist.desigId == 2) {
        newRoutes = routes_maintenance;
      } else if (userlist.desigId == 3) {
        newRoutes = routes_general;
      } else {
        newRoutes = routes_general;
      }
    } else {
      newRoutes = routes_general;
    }
  }
}

@NgModule({
  imports: [RouterModule.forChild(newRoutes)],
  exports: [RouterModule],
})
export class SegregatenotificationPageRoutingModule {}
