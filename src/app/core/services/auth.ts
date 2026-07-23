import { Service, signal } from '@angular/core';

@Service()
export class Auth {
  // Signal holding the current user's role
  // Default is set to 'guest', but could be initialized from localStorage or an API token
  userRole = signal<string>('guest'); 

  constructor() {}

  /**
   * Simulates a login action that updates the user's role.
   * Updating this signal will automatically trigger the *appPermission directive to re-evaluate.
   * 
   * @param role The role assigned to the user (e.g., 'admin', 'editor', 'viewer')
   */
  login(role: string): void {
    this.userRole.set(role);
  }

  /**
   * Simulates a logout action that resets the user's role.
   */
  logout(): void {
    this.userRole.set('guest');
  }
}
