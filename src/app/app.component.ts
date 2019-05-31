import { Component } from '@angular/core';
import { InvoiceLine, InvoiceCalculatorService, Invoice } from './invoice-calculator.service';
import { VatCategory, VatCategoriesService } from './vat-categories.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  invoiceLines: InvoiceLine[] = [];
  invoice: Invoice;

  product = '';
  priceInclusiveVat = 0;
  vatCategoryString = 'Food';
  vatCategories = VatCategory;

  constructor(private invoiceCalculator: InvoiceCalculatorService, private vatCategoriesService: VatCategoriesService) { }

  addInvoice() {
    let category;
    switch (this.vatCategoryString) {
      case 'Food': category = VatCategory.Food; break;
      case 'Drinks': category = VatCategory.Drinks;
    }
    const product: InvoiceLine = {
      priceInclusiveVat: this.priceInclusiveVat,
      product: this.product, vatCategory: category
    };
    this.invoiceLines.push(product);
    this.invoice = this.invoiceCalculator.CalculateInvoice(this.invoiceLines);
  }
}
