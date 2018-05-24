import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'vnnumber'
})
export class VnNumber implements PipeTransform {

    transform(value: number | string, locale?: string): string {
        return new Intl.NumberFormat(locale, {
            minimumFractionDigits: 2 | 0
        }).format(Number(value));
    }
}