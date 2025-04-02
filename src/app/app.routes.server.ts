import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'coursedeatils/:id/:fav/:vote',
    renderMode: RenderMode.Client
  },
  {
    path: 'enterpin/:email/:expireAt',
    renderMode: RenderMode.Client
  },
  {
    path: 'forgetpassword/:email',
    renderMode: RenderMode.Client
  },
  {
    path: 'admin/editcourse/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'admin/editinstructor/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'admin/addlesson/:courseid',
    renderMode: RenderMode.Client
  },
  {
    path: 'admin/editlesson/:id/:courseId',
    renderMode: RenderMode.Client
  },
  {
    path: 'showlesson/:id/:courseId',
    renderMode: RenderMode.Client
  },
  {
    path: 'admin/lessons/:courseid',
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
