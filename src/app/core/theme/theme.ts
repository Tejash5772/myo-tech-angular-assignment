import { effect, Service, signal } from '@angular/core';

export type Theme_Type = 'light' | 'dark';

@Service()
export class Theme {
  private readonly THEME_KEY = 'app_theme';
  
  // State managed by Signal[cite: 1]
  theme = signal<Theme_Type>(this.getStoredTheme());

  constructor() {
    // Effect to update DOM and localStorage whenever the signal changes[cite: 1]
    effect(() => {
      const currentTheme = this.theme();
      localStorage.setItem(this.THEME_KEY, currentTheme);
      
      // Update DOM to trigger CSS custom properties (variables)[cite: 1]
      if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
    });
  }

  toggleTheme() {
    this.theme.update(t => t === 'light' ? 'dark' : 'light');
  }

  private getStoredTheme(): Theme_Type {
    const stored = localStorage.getItem(this.THEME_KEY) as Theme_Type;
    return stored === 'dark' || stored === 'light' ? stored : 'light';
  }
}