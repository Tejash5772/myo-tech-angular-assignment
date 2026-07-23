import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProgressBar } from './core/services/progress-bar';
import { Theme } from './core/theme/theme';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('myo-tech-angular-assignment');
  
  // Injecting global services required by the assignment
  themeService = inject(Theme);
  progressBarService = inject(ProgressBar);

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
