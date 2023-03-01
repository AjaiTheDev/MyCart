import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-add-categories',
  templateUrl: './add-categories.component.html',
  styleUrls: ['./add-categories.component.css']
})

export class AddCategoriesComponent {

  constructor(
    private categoryService: CategoryService,
    private toaster: ToastrService
  ) {
  }

  model = {
    name: '',
    description: ''
  };

  onSubmit(form: any) {
    this.categoryService.create(this.model).subscribe({
      next: (response: any) => {

        if (response.isValid) {
          this.toaster.success("Created Successfully");
          form.reset();
        }

      },
      error: (errors: any) => {
        
        if (errors != null) {
          this.toaster.error("Request Failed");
        }

      }
    });
  }
}
