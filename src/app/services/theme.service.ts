import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkMode = new BehaviorSubject<boolean>(false);
  public darkMode$ = this.darkMode.asObservable();
  private isBrowser: boolean;
  private userPreference: 'dark' | 'light' | 'system' = 'system';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | 'system' | null;

      this.userPreference = savedTheme || 'system';

      this.setThemeBasedOnPreference();

      // Escucha cambios en la preferencia del sistema si está en modo 'system'
      if (this.userPreference === 'system') {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
          this.setThemeBasedOnPreference();
        });
      }
    }
  }

  toggleTheme() {
    if (this.userPreference === 'system') {
      // Si estaba en "system", asumimos que el usuario quiere forzar el opuesto al actual
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.userPreference = prefersDark ? 'light' : 'dark';
    } else {
      // Alterna entre dark/light
      this.userPreference = this.userPreference === 'dark' ? 'light' : 'dark';
    }

    localStorage.setItem('theme', this.userPreference);
    this.setThemeBasedOnPreference();
  }

  private setThemeBasedOnPreference() {
    if (!this.isBrowser) return;

    let useDark: boolean;

    if (this.userPreference === 'system') {
      useDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    } else {
      useDark = this.userPreference === 'dark';
    }

    this.darkMode.next(useDark);

    if (useDark) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark-theme');
    }
  }
}