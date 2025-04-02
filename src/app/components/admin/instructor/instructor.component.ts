import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { InstructorService } from '../../../services/instructor.service';
import { SearchService } from '../../../services/search.service';
import { MessageService } from '../../../services/message.service';
import { SearchPipe } from '../../../pipes/search.pipe';

@Component({
  selector: 'app-instructor',
  imports: [CommonModule, RouterLink, SearchPipe],
  templateUrl: './instructor.component.html',
  styleUrl: './instructor.component.css'
})

export class InstructorComponent implements OnInit {

  constructor(private _insService: InstructorService, private searchService: SearchService,
    private messageService: MessageService, private _router: Router
  ) {}

  Instructors: any[] = [];
  searchTerm: string = '';
  message: string | null = null;

  ngOnInit(): void {
    this.searchService.searchTerm$.subscribe(term => {
      this.searchTerm = term;
    });

    this.messageService.currentMessage.subscribe(message => {
      this.message = message;
      if (this.message) {
        setTimeout(() => {
          this.messageService.clearMessage();
        }, 5000);
      }
    });

    this.loadInstructors();
  }

  loadInstructors() {
    this._insService.getInstructors().subscribe({
      next: (data: any[]) => {
        this.Instructors = data
      },
      error: (err) => {
        console.error('Error fetching Instructors:', err);
      }
    });
  }

  deleteInstructor(InsId: number) {
    if (!confirm('Are you sure you want to delete this Instructor?')) return;

    this._insService.deleteInstructor(InsId).subscribe({
      next: () => {
        this.messageService.changeMessage('Instructor deleted successfully.');
        this.loadInstructors();
      },
      error: (error) => {
        console.error('Error deleting Instructor:', error);
      }
    });
  }
}
