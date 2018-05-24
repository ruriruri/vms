import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
    name: 'vndate'
})
export class VnDate implements PipeTransform {
    transform(value: string, ...args: any[]) {
        if (!value) return null;
        if (value.length === 8)
            return value.substr(6, 2) + '/' + value.substr(4, 2) + '/' + value.substr(0, 4);
        if (value.length === 12)
            return value.substr(6, 2) + '/' + value.substr(4, 2) + '/' + value.substr(0, 4) + ' ' + value.substr(8, 2) + ':' + value.substr(10, 2);

    }
}