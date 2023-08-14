import { NgModule } from "@angular/core";
import { Routes, RouterModule, Router } from "@angular/router";

import { TabsPage } from "./tabs.page";
import { AuthGuardService } from "../services/authguard/auth-guard.service";
let userlist = JSON.parse(localStorage.getItem("userlist"));
let newRoutes: any;
let router: Router;

const routes_owner: Routes = [
  {
    path: "",
    component: TabsPage,
    canActivate: [AuthGuardService],
    children: [
      {
        path: "tabdashboard",
        children: [
          {
            path: "",
            loadChildren: () =>
              import(
                "../owner-module/owner-dashboard/owner-dashboard.module"
              ).then((m) => m.OwnerDashboardPageModule),
          },
        ],
      },
      {
        path: "taboilloss",
        children: [
          {
            path: "",
            loadChildren: () =>
              import("../owner-module/owner-oilloss/owner-oilloss.module").then(
                (m) => m.OwnerOillossPageModule
              ),
          },
        ],
      },
      {
        path: "tabproduction",
        children: [
          {
            path: "",
            loadChildren: () =>
              import(
                "../owner-module/owner-production/owner-production.module"
              ).then((m) => m.OwnerProductionPageModule),
          },
        ],
      },
      {
        path: "tabmaintenance",
        children: [
          {
            path: "",
            loadChildren: () =>
              import(
                "../owner-module/owner-maintenance/owner-maintenance.module"
              ).then((m) => m.OwnerMaintenancePageModule),
          },
        ],
      },
      {
        path: "tabreports",
        children: [
          {
            path: "",
            loadChildren: () =>
              import("../owner-module/owner-reports/owner-reports.module").then(
                (m) => m.OwnerReportsPageModule
              ),
          },
        ],
      },
      /*{
        path: "tabprofile",
        children: [
          {
            path: "",
            loadChildren: () =>
              import("../more/more.module").then((m) => m.MorePageModule),
          },
        ],
      },*/
      {
        path: "",
        redirectTo: "/tabs/tabdashboard",
        pathMatch: "full",
      },
    ],
  },
];

/*const routes_manager: Routes = [
  {
    path: "",
    component: TabsPage,
    canActivate: [AuthGuardService],
    children: [
      {
        path: "tabmaintenancedashboard",
        children: [
          {
            path: "",
            loadChildren: () =>
              import(
                "../maintenance-module/maintenance-notification-dashboard/maintenance-notification-dashboard.module"
              ).then((m) => m.MaintenanceNotificationDashboardPageModule),
          },
        ],
      },
      {
        path: "tabmaintenancehome",
        children: [
          {
            path: "",
            loadChildren: () =>
              import(
                "../maintenance-module/maintenance-home/maintenance-home.module"
              ).then((m) => m.MaintenanceHomePageModule),
          },
        ],
      },
      {
        path: "tabqrcodescanner",
        children: [
          {
            path: "",
            loadChildren: () =>
              import(
                "../scanner-module/qrcodescanner/qrcodescanner.module"
              ).then((m) => m.QrcodescannerPageModule),
          },
        ],
      },
      {
        path: "tab3",
        children: [
          {
            path: "",
            loadChildren: () =>
              import("../more/more.module").then((m) => m.MorePageModule),
          },
        ],
      },
      {
        path: "",
        redirectTo: "/tabs/tabmaintenancedashboard",
        pathMatch: "full",
      },
    ],
  },
];*/

const routes_engineering: Routes = [
  {
    path: "",
    component: TabsPage,
    canActivate: [AuthGuardService],
    children: [
      {
        path: "tabmaintenancedashboard",
        children: [
          {
            path: "",
            loadChildren: () =>
              import(
                "../maintenance-module/maintenance-dashboard/maintenance-dashboard.module"
              ).then((m) => m.MaintenanceDashboardPageModule),
          },
        ],
      },
      {
        path: "tabcorrectivemaintenance",
        children: [
          {
            path: "",
            loadChildren: () =>
              import(
                "../maintenance-module/tab-correctivemaintenance/tab-correctivemaintenance.module"
              ).then((m) => m.TabCorrectivemaintenancePageModule),
          },
        ],
      },
      {
        path: "tabpreventivemaintenance",
        children: [
          {
            path: "",
            loadChildren: () =>
              import(
                "../maintenance-module/tab-preventivemaintenance-new/tab-preventivemaintenance-new.module"
              ).then((m) => m.TabPreventivemaintenanceNewPageModule),
          },
        ],
      },
      {
        path: "tabsupervisorhome",
        children: [
          {
            path: "",
            loadChildren: () =>
              import(
                "../supervisor-module/production-home/production-home.module"
              ).then((m) => m.ProductionHomePageModule),
          },
        ],
      },
      {
        path: "tabcalendar",
        children: [
          {
            path: "",
            loadChildren: () =>
              import("../maintenance-module/schedule/schedule.module").then(
                (m) => m.SchedulePageModule
              ),
          },
        ],
      },
      {
        path: "tab3",
        children: [
          {
            path: "",
            loadChildren: () =>
              import("../more/more.module").then((m) => m.MorePageModule),
          },
        ],
      },
      {
        path: "",
        redirectTo: "/tabs/tabmaintenancedashboard",
        pathMatch: "full",
      },
    ],
  },
];

const routes_foreman: Routes = [
  {
    path: "",
    component: TabsPage,
    canActivate: [AuthGuardService],
    children: [
      {
        path: "tabmaintenancedashboard",
        children: [
          {
            path: "",
            loadChildren: () =>
              import(
                "../maintenance-module/maintenance-dashboard/maintenance-dashboard.module"
              ).then((m) => m.MaintenanceDashboardPageModule),
          },
        ],
      },
      {
        path: "tabcorrectivemaintenance",
        children: [
          {
            path: "",
            loadChildren: () =>
              import(
                "../maintenance-module/tab-correctivemaintenance/tab-correctivemaintenance.module"
              ).then((m) => m.TabCorrectivemaintenancePageModule),
          },
        ],
      },
      /*{
        path: "tabpreventivemaintenance",
        children: [
          {
            path: "",
            loadChildren: () =>
              import(
                "../maintenance-module/tab-preventivemaintenance/tab-preventivemaintenance.module"
              ).then((m) => m.TabPreventivemaintenancePageModule),
          },
        ],
      },*/
      {
        path: "tabpreventivemaintenance",
        children: [
          {
            path: "",
            loadChildren: () =>
              import(
                "../maintenance-module/tab-preventivemaintenance-new/tab-preventivemaintenance-new.module"
              ).then((m) => m.TabPreventivemaintenanceNewPageModule),
          },
        ],
      },
      {
        path: "tabcalendar",
        children: [
          {
            path: "",
            loadChildren: () =>
              import("../maintenance-module/schedule/schedule.module").then(
                (m) => m.SchedulePageModule
              ),
          },
        ],
      },
      {
        path: "tab3",
        children: [
          {
            path: "",
            loadChildren: () =>
              import("../more/more.module").then((m) => m.MorePageModule),
          },
        ],
      },
      {
        path: "",
        redirectTo: "/tabs/tabmaintenancedashboard",
        pathMatch: "full",
      },
    ],
  },
];

const routes_chargeman: Routes = [
  {
    path: "",
    component: TabsPage,
    canActivate: [AuthGuardService],
    children: [
      {
        path: "tabmaintenancedashboard",
        children: [
          {
            path: "",
            loadChildren: () =>
              import(
                "../maintenance-module/maintenance-dashboard/maintenance-dashboard.module"
              ).then((m) => m.MaintenanceDashboardPageModule),
          },
        ],
      },
      {
        path: "tabcorrectivemaintenance",
        children: [
          {
            path: "",
            loadChildren: () =>
              import(
                "../maintenance-module/tab-correctivemaintenance/tab-correctivemaintenance.module"
              ).then((m) => m.TabCorrectivemaintenancePageModule),
          },
        ],
      },
      /*{
        path: "tabpreventivemaintenance",
        children: [
          {
            path: "",
            loadChildren: () =>
              import(
                "../maintenance-module/tab-preventivemaintenance/tab-preventivemaintenance.module"
              ).then((m) => m.TabPreventivemaintenancePageModule),
          },
        ],
      },*/
      {
        path: "tabpreventivemaintenance",
        children: [
          {
            path: "",
            loadChildren: () =>
              import(
                "../maintenance-module/tab-preventivemaintenance-new/tab-preventivemaintenance-new.module"
              ).then((m) => m.TabPreventivemaintenanceNewPageModule),
          },
        ],
      },
      {
        path: "tabcalendar",
        children: [
          {
            path: "",
            loadChildren: () =>
              import("../maintenance-module/schedule/schedule.module").then(
                (m) => m.SchedulePageModule
              ),
          },
        ],
      },
      {
        path: "tab3",
        children: [
          {
            path: "",
            loadChildren: () =>
              import("../more/more.module").then((m) => m.MorePageModule),
          },
        ],
      },
      {
        path: "",
        redirectTo: "/tabs/tabmaintenancedashboard",
        pathMatch: "full",
      },
    ],
  },
];

const routes_fitter: Routes = [
  {
    path: "",
    component: TabsPage,
    canActivate: [AuthGuardService],
    children: [
      {
        path: "tabjob",
        children: [
          {
            path: "",
            loadChildren: () =>
              import(
                "../maintenance-module/maintenance-home/maintenance-home.module"
              ).then((m) => m.MaintenanceHomePageModule),
          },
        ],
      },
      {
        path: "tabcalendar",
        children: [
          {
            path: "",
            loadChildren: () =>
              import("../maintenance-module/schedule/schedule.module").then(
                (m) => m.SchedulePageModule
              ),
          },
        ],
      },
      {
        path: "tab3",
        children: [
          {
            path: "",
            loadChildren: () =>
              import("../more/more.module").then((m) => m.MorePageModule),
          },
        ],
      },
      {
        path: "",
        redirectTo: "/tabs/tabjob",
        pathMatch: "full",
      },
    ],
  },
];

const routes_wireman: Routes = [
  {
    path: "",
    component: TabsPage,
    canActivate: [AuthGuardService],
    children: [
      {
        path: "tabjob",
        children: [
          {
            path: "",
            loadChildren: () =>
              import(
                "../maintenance-module/maintenance-home/maintenance-home.module"
              ).then((m) => m.MaintenanceHomePageModule),
          },
        ],
      },
      {
        path: "tabcalendar",
        children: [
          {
            path: "",
            loadChildren: () =>
              import("../maintenance-module/schedule/schedule.module").then(
                (m) => m.SchedulePageModule
              ),
          },
        ],
      },
      {
        path: "tab3",
        children: [
          {
            path: "",
            loadChildren: () =>
              import("../more/more.module").then((m) => m.MorePageModule),
          },
        ],
      },
      {
        path: "",
        redirectTo: "/tabs/tabjob",
        pathMatch: "full",
      },
    ],
  },
];

const routes_lab: Routes = [
  {
    path: "",
    component: TabsPage,
    canActivate: [AuthGuardService],
    children: [
      {
        path: "tabmaintenancehome",
        children: [
          {
            path: "",
            loadChildren: () =>
              import(
                "../maintenance-module/lab-oillosses-dashboard/lab-oillosses-dashboard.module"
              ).then((m) => m.LabOillossesDashboardPageModule),
          },
        ],
      },
      {
        path: "taboilloss",
        children: [
          {
            path: "",
            loadChildren: () =>
              import("../owner-module/owner-oilloss/owner-oilloss.module").then(
                (m) => m.OwnerOillossPageModule
              ),
          },
        ],
      },
      {
        path: "tabreports",
        children: [
          {
            path: "",
            loadChildren: () =>
              import(
                "../maintenance-module/tab-laboilloss-report/tab-laboilloss-report.module"
              ).then((m) => m.TabLaboillossReportPageModule),
          },
        ],
      },
      {
        path: "tab3",
        children: [
          {
            path: "",
            loadChildren: () =>
              import("../more/more.module").then((m) => m.MorePageModule),
          },
        ],
      },
      {
        path: "",
        redirectTo: "/tabs/tabmaintenancehome",
        pathMatch: "full",
      },
    ],
  },
];

const routes_production: Routes = [
  {
    path: "",
    component: TabsPage,
    canActivate: [AuthGuardService],
    children: [
      {
        path: "tabsupervisordashboard",
        children: [
          {
            path: "",
            loadChildren: () =>
              import(
                "../supervisor-module/production-dashboard-dynamic/production-dashboard-dynamic.module"
              ).then((m) => m.ProductionDashboardDynamicPageModule),
          },
        ],
      },
      {
        path: "tabalert",
        children: [
          {
            path: "",
            loadChildren: () =>
              import(
                "../segregatenotificatepages/tabalertacknowledge/tabalertacknowledge.module"
              ).then((m) => m.TabalertacknowledgePageModule),
          },
        ],
      },
      {
        path: "taboilloss",
        children: [
          {
            path: "",
            loadChildren: () =>
              import("../owner-module/owner-oilloss/owner-oilloss.module").then(
                (m) => m.OwnerOillossPageModule
              ),
          },
        ],
      },
      {
        path: "tabsupervisorhome",
        children: [
          {
            path: "",
            loadChildren: () =>
              import(
                "../supervisor-module/production-home/production-home.module"
              ).then((m) => m.ProductionHomePageModule),
          },
        ],
      },
      {
        path: "tabqrcodescanner",
        children: [
          {
            path: "",
            loadChildren: () =>
              import(
                "../scanner-module/qrcodescanner/qrcodescanner.module"
              ).then((m) => m.QrcodescannerPageModule),
          },
        ],
      },
      {
        path: "tab3",
        children: [
          {
            path: "",
            loadChildren: () =>
              import("../more/more.module").then((m) => m.MorePageModule),
            //loadChildren: () => import("../phonecall/call/call.module").then((m) => m.CallPageModule),
          },
        ],
      },
      {
        path: "",
        redirectTo: "/tabs/tabsupervisordashboard",
        pathMatch: "full",
      },
    ],
  },
];

const routes_press: Routes = [
  {
    path: "",
    component: TabsPage,
    canActivate: [AuthGuardService],
    children: [
      {
        path: "tabsupervisordashboard",
        children: [
          {
            path: "",
            loadChildren: () =>
              import(
                "../supervisor-module/production-sterilizerpress-dashboard/production-sterilizerpress-dashboard.module"
              ).then((m) => m.ProductionSterilizerpressDashboardPageModule),
          },
        ],
      },
      {
        path: "tabalert",
        children: [
          {
            path: "",
            loadChildren: () =>
              import(
                "../segregatenotificatepages/tabalertacknowledge/tabalertacknowledge.module"
              ).then((m) => m.TabalertacknowledgePageModule),
          },
        ],
      },
      {
        path: "tabsupervisorhome",
        children: [
          {
            path: "",
            loadChildren: () =>
              import(
                "../supervisor-module/tab-pressstation-report/tab-pressstation-report.module"
              ).then((m) => m.TabPressstationReportPageModule),
          },
        ],
      },
      {
        path: "tab3",
        children: [
          {
            path: "",
            loadChildren: () =>
              import("../more/more.module").then((m) => m.MorePageModule),
          },
        ],
      },
      {
        path: "",
        redirectTo: "/tabs/tabsupervisordashboard",
        pathMatch: "full",
      },
    ],
  },
];

const routes_sterilizer: Routes = [
  {
    path: "",
    component: TabsPage,
    canActivate: [AuthGuardService],
    children: [
      {
        path: "tabsupervisordashboard",
        children: [
          {
            path: "",
            loadChildren: () =>
              import(
                "../supervisor-module/production-sterilizerpress-dashboard/production-sterilizerpress-dashboard.module"
              ).then((m) => m.ProductionSterilizerpressDashboardPageModule),
          },
        ],
      },
      {
        path: "tabalert",
        children: [
          {
            path: "",
            loadChildren: () =>
              import(
                "../segregatenotificatepages/tabalertacknowledge/tabalertacknowledge.module"
              ).then((m) => m.TabalertacknowledgePageModule),
          },
        ],
      },

      {
        path: "tabsupervisorhome",
        children: [
          {
            path: "",
            loadChildren: () =>
              import(
                "../supervisor-module/tab-sterilizerstation-report/tab-sterilizerstation-report.module"
              ).then((m) => m.TabSterilizerstationReportPageModule),
          },
        ],
      },
      {
        path: "tab3",
        children: [
          {
            path: "",
            loadChildren: () =>
              import("../more/more.module").then((m) => m.MorePageModule),
          },
        ],
      },
      {
        path: "",
        redirectTo: "/tabs/tabsupervisordashboard",
        pathMatch: "full",
      },
    ],
  },
];

const routes_grading: Routes = [
  {
    path: "",
    component: TabsPage,
    canActivate: [AuthGuardService],
    children: [
      {
        path: "tabgradinghome",
        children: [
          {
            path: "",
            loadChildren: () =>
              import("../grading-module/grading-home/grading-home.module").then(
                (m) => m.GradingHomePageModule
              ),
          },
        ],
      },
      {
        path: "tabgradingreports",
        children: [
          {
            path: "",
            loadChildren: () =>
              import(
                "../grading-module/grading-report/grading-report.module"
              ).then((m) => m.GradingReportPageModule),
          },
        ],
      },
      {
        path: "tabprofile",
        children: [
          {
            path: "",
            loadChildren: () =>
              import("../more/more.module").then((m) => m.MorePageModule),
          },
        ],
      },
      {
        path: "",
        redirectTo: "/tabs/tabgradinghome",
        pathMatch: "full",
      },
    ],
  },
];

//console.log(userlist);

if (userlist) {
  if (userlist.dept_id) {
    if (userlist.dept_id == 2) {
      newRoutes = routes_lab;
    } else if (userlist.dept_id == 4) {
      if (userlist.desigId == 2) {
        newRoutes = routes_engineering;
      } else if (userlist.desigId == 7) {
        newRoutes = routes_press;
      } else if (userlist.desigId == 8) {
        newRoutes = routes_sterilizer;
      } else {
        newRoutes = routes_production;
      }
    } else if (userlist.dept_id == 7) {
      if (userlist.desigId == 2) {
        newRoutes = routes_engineering;
      } else if (userlist.desigId == 4) {
        newRoutes = routes_foreman;
      } else if (userlist.desigId == 5) {
        newRoutes = routes_fitter;
      } else if (userlist.desigId == 6) {
        newRoutes = routes_chargeman;
      } else if (userlist.desigId == 11) {
        newRoutes = routes_wireman;
      } else {
        newRoutes = routes_engineering;
      }
    } else if (userlist.dept_id == 10) {
      newRoutes = routes_grading;
    } else if (userlist.dept_id == 25) {
      /*if (userlist.desigId == 1) {
        newRoutes = routes_manager;
      } else {
        newRoutes = routes_owner;
      }*/
      newRoutes = routes_owner;
    } else {
      localStorage.clear();
      router.navigateByUrl("/login");
    }
  } else {
    localStorage.clear();
    router.navigateByUrl("/login");
  }
} else {
  newRoutes = routes_engineering;
}

@NgModule({
  imports: [RouterModule.forChild(newRoutes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
