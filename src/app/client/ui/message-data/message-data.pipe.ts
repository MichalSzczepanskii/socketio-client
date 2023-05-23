import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'messageData',
  standalone: true,
})
export class MessageDataPipe implements PipeTransform {
  transform(value: string | object): string {
    return typeof value === 'string' ? value : JSON.stringify(value);
  }
}
