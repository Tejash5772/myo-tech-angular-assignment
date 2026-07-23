import { Directive, effect, inject, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { Auth } from '../../core/services/auth';

@Directive({
  selector: '[appPermission]',
  standalone: true
})
export class Permission {
  private templateRef = inject(TemplateRef);
  private viewContainer = inject(ViewContainerRef);
  private authService = inject(Auth); // Contains userRole signal
  
  @Input() set appPermission(requiredRole: string) {
    effect(() => {
      const currentRole = this.authService.userRole();
      if (currentRole === requiredRole) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainer.clear();
      }
    });
  }
}