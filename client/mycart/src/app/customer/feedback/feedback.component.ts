import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FeedbackService } from 'src/app/services/feedback.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent {

  model: FeedbackCreateDto =
    {
      message: ''
    };

  constructor(
    private service: FeedbackService,
    private router: Router,
    private toaster: ToastrService
  ) { }

  onSubmit() {
    this.service.Create(this.model).subscribe({
      next: (response: any) => {
        this.toaster.success("Feedback Submitted");
        this.router.navigate(['customer/home']);
      }
    });
  }
}

