import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  currency = '$';
  form = this.fb.group({
    order: ['', Validators.required],
    name: ['', Validators.required],
    phone: ['', Validators.required]
  })

  productsData:any;

  constructor(private fb: FormBuilder, private appService: AppService) {

  }
  ngOnInit() {
    this.appService.getData().subscribe(data => this.productsData = data)
  }
  scrollTo(target: HTMLElement, burger?: any) {
    target.scrollIntoView({behavior: "smooth"})
    if (burger) {
      this.form.patchValue({order: burger.title + ' (' + burger.price + ' ' + this.currency + ')'});
    }
  }
  confirmOrder() {
    if(this.form.valid) {
      this.appService.sendOrder(this.form.value)
      .subscribe(
       {
        next: (response: any) => {
          alert(response.message);
          this.form.reset()
        },
        error: (response) => {
          alert(response.error.message)
        }
       }
      )

    }
  }
  changeCurrency() {
    let prices = document.querySelectorAll('.burger__column__footer__price');
    let newCurrency = '$';
    let coefficient = 1;
    if (this.currency === '$') {
      newCurrency = 'P';
      coefficient = 80;
    } else if (this.currency === 'P') {
      newCurrency = 'BYN';
      coefficient = 3;
    } else if (this.currency === 'BYN') {
      newCurrency = '€';
      coefficient = 0.9;
    } else if (this.currency === '€') {
      newCurrency = '¥';
      coefficient = 6.9;
    }
    this.currency = newCurrency;

    this.productsData.forEach((product:any) => {
      product.price = +(product.basePrice * coefficient).toFixed(1)
    })
  }
}

