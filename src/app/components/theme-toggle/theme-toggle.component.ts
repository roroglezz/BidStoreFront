import { Component } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button (click)="toggleTheme()" class="theme-toggle-btn" aria-label="Toggle theme">
      <div class="icon-container">
        <div class="icon sun" [class.active]="!isDarkMode">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
          </svg>
        </div>
        <div class="icon moon" [class.active]="isDarkMode">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path fill-rule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clip-rule="evenodd" />
          </svg>
        </div>
      </div>
    </button>
  `,
  styles: [`
    .theme-toggle-btn {
      position: relative;
      width: 54px;
      height: 28px;
      border-radius: 14px;
      background: var(--toggle-bg, linear-gradient(45deg, #f6f0fd, #e3e3e3));
      border: 2px solid var(--toggle-border, #e0e0e0);
      padding: 2px;
      cursor: pointer;
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    .dark-theme .theme-toggle-btn {
      --toggle-bg: linear-gradient(45deg, #2b2a33, #0d1117);
      --toggle-border: #333;
    }

    .icon-container {
      position: relative;
      width: 100%;
      height: 100%;
    }

    .icon {
      position: absolute;
      width: 20px;
      height: 20px;
      top: 2px;
      color: #6b7280;
      opacity: 0;
      transform: scale(0.5);
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .icon.active {
      opacity: 1;
      transform: scale(1);
    }

    .sun {
      left: 2px;
      color: #f59e0b;
    }

    .moon {
      right: 2px;
      color: #6366f1;
    }

    .dark-theme .icon {
      color: #e5e7eb;
    }

    .dark-theme .sun.active {
      color: #fbbf24;
    }

    .dark-theme .moon.active {
      color: #818cf8;
    }
  `]
})
export class ThemeToggleComponent {
  isDarkMode = false;

  constructor(private themeService: ThemeService) {
    this.themeService.darkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}