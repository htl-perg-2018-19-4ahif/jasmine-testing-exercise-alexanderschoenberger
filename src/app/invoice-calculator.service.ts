import { Injectable } from '@angular/core';
import { VatCategory, VatCategoriesService } from './vat-categories.service';

export interface InvoiceLine {
  product: string;
  vatCategory: VatCategory;
  priceInclusiveVat: number;
}

export interface InvoiceLineComplete extends InvoiceLine {
  priceExclusiveVat: number;
}

export interface Invoice {
  invoiceLines: InvoiceLineComplete[];
  totalPriceInclusiveVat: number;
  totalPriceExclusiveVat: number;
  totalVat: number;
}

@Injectable({
  providedIn: 'root'
})
export class InvoiceCalculatorService {

  constructor(private vatCategoriesService: VatCategoriesService) { }

  public CalculatePriceExclusiveVat(priceInclusiveVat: number, vatPercentage: number): number {
    return priceInclusiveVat / (1 + vatPercentage / 100);
  }

  public CalculateInvoice(invoiceLines: InvoiceLine[]): Invoice {
    let ret: Invoice = {
      invoiceLines: [], totalPriceInclusiveVat: 0,
      totalPriceExclusiveVat: 0,
      totalVat: 0
    };
    invoiceLines.forEach((element: InvoiceLine) => {
      const vat = this.vatCategoriesService.getVat(element.vatCategory);
      const exVat = this.CalculatePriceExclusiveVat(element.priceInclusiveVat, vat);
      ret.totalPriceInclusiveVat += element.priceInclusiveVat;
      ret.totalPriceExclusiveVat += exVat;
      ret.totalVat += element.priceInclusiveVat * vat / 100;
      const invoiceLinesComplete: InvoiceLineComplete = {
        product: element.product,
        vatCategory: element.vatCategory,
        priceInclusiveVat: element.priceInclusiveVat, priceExclusiveVat: exVat
      };
      ret.invoiceLines.push(invoiceLinesComplete);
    });
    return ret;
  }
}
