/**
 * Defines all application routes. The new routes for reports and report detail pages
 * have been added.
 */
import * as React from 'react';
import type { RouteObject } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

import { Page as HomePage } from '@/pages/marketing/home';
import { Page as NotFoundPage } from '@/pages/not-found';
import { Page as NewReportPage } from '@/pages/new-report';
import { ReportsPage } from '@/pages/reports';
import { ReportDetailPage } from '@/pages/report-detail';

export const routes: RouteObject[] = [
  {
    element: <Outlet />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'reports', element: <ReportsPage /> },
      { path: 'NewReport', element: <NewReportPage /> },
      { path: 'report/:id', element: <ReportDetailPage /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
];