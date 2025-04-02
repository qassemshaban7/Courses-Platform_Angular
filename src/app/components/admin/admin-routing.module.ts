import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from '../../guards/admin.guard';
import { CategoryComponent } from './category/category.component';
import { CourseComponent } from './course/course.component';
import { AddCourseComponent } from './add-course/add-course.component';
import { EditCourseComponent } from './edit-course/edit-course.component';
import { InstructorComponent } from './instructor/instructor.component';
import { AddInstructorComponent } from './add-instructor/add-instructor.component';
import { EditInstructorComponent } from './edit-instructor/edit-instructor.component';
import { AddLessonComponent } from './add-lesson/add-lesson.component';
import { LessonComponent } from './lesson/lesson.component';
import { EditLessonComponent } from './edit-lesson/edit-lesson.component';
import { ShowLessonComponent } from '../shared/show-lesson/show-lesson.component';

const routes: Routes = [

    //* Component whith admin guard
    {path:'category', canActivate:[AdminGuard],component:CategoryComponent, title:'Category Page'},
    {path:'courses', canActivate:[AdminGuard],component:CourseComponent, title:'Courses Page'},
    {path:'addcourse', canActivate:[AdminGuard],component:AddCourseComponent, title:'Add Course Page'},
    {path:'editcourse/:id', canActivate:[AdminGuard],component:EditCourseComponent, title:'Edit Course Page'},
    {path:'instructors', canActivate:[AdminGuard],component:InstructorComponent, title:'Instructors Page'},
    {path:'addinstructor', canActivate:[AdminGuard],component:AddInstructorComponent, title:'Add Instructor Page'},
    {path:'editinstructor/:id', canActivate:[AdminGuard],component:EditInstructorComponent, title:'Edit Instructor Page'},
    {path:'lessons/:courseid', canActivate:[AdminGuard],component:LessonComponent, title:'Lessons Page'},
    {path:'addlesson/:courseid', canActivate:[AdminGuard],component:AddLessonComponent, title:'Add Lesson Page'},
    {path:'editlesson/:id/:courseId', canActivate:[AdminGuard],component:EditLessonComponent, title:'Edit Lesson Page'},
    {path:'showlesson/:id/:courseId', canActivate:[AdminGuard],component:ShowLessonComponent, title:'Show Lesson Page'},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
