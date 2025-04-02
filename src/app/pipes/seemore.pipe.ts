import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'seemore'
})
export class SeemorePipe implements PipeTransform {

  transform(description:string ): string  {
    return description.split(' ').slice(0, 15).join(' ');
  }

}
