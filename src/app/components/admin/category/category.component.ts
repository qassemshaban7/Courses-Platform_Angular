import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../../services/category.service';
import { CommonModule } from '@angular/common';
import { SearchService } from '../../../services/search.service';
import { SearchPipe } from '../../../pipes/search.pipe';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  imports:[CommonModule, SearchPipe],
  styleUrls: ['./category.component.css']
})

export class CategoryComponent implements OnInit {
  CategoriesData: any[] = [];
  message: string = '';
  messageType: 'success' | 'error' = 'success';
  searchTerm: string = '';

  constructor(private _CateService: CategoryService, private searchService: SearchService) {}

  ngOnInit() {
    this.searchService.searchTerm$.subscribe(term => {
      this.searchTerm = term;
    });

    this.loadCategories();
  }

  loadCategories() {
    this._CateService.getCategories().subscribe({
      next: (data) => {
        this.CategoriesData = data;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  addCategory(inputElement: HTMLInputElement) {
    const categoryName = inputElement.value.trim();
    if (!categoryName) {
      this.showMessage('Category name is required!', 'error');
      return;
    }

    const category = { name: categoryName };

    this._CateService.addCategory(category).subscribe({
      next: (response: any) => {
        this.showMessage(response, 'success');
        this.loadCategories();
        inputElement.value = '';
      },
      error: (error) => {
          this.showMessage(`${error.error}`, 'error');
      }
    });
  }

  editCategory(category: any) {
    const newName = prompt("Enter category name:", category.name);
    if (!newName || newName.trim() === "") {
      return;
    }
    const updatedCategory = { name: newName };

    this._CateService.editCategory(category.id, updatedCategory).subscribe({
      next: (response) => {
        this.showMessage(response, 'success');
        this.loadCategories();
      },
      error: (error) => {
        this.showMessage(`${error.error}`, 'error');
      }
    });
  }

  deleteCategory(categoryId: number) {
    if (!confirm('Are you sure you want to delete this category?')) return;
    this._CateService.deleteCategory(categoryId).subscribe(response => {
      alert(response);
      this.loadCategories();
    });
  }

  showMessage(msg: string, type: 'success' | 'error') {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
    }, 5000);
  }

}
