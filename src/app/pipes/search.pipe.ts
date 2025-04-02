import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(courses:any[], trem: string): any[] {

    if (!courses || !trem) {
      return courses;
    }
    return courses.filter(item =>
      item.name.toLowerCase().includes(trem.toLowerCase())
    );
  }

}
