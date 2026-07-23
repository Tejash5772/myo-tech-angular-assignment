import { Service } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs';

@Service()
export class AutoDraft {
  private storageKey = 'form_draft';

  initDraftSync(form: FormGroup) {
    form.valueChanges.pipe(debounceTime(500)).subscribe(val => {
      localStorage.setItem(this.storageKey, JSON.stringify(val));
    });
  }

  checkAndRestoreDraft(form: FormGroup, openModalCallback: () => Promise<boolean>) {
    const draft = localStorage.getItem(this.storageKey);
    if (draft) {
      // Trigger custom Bootstrap modal prompt instead of native alert
      openModalCallback().then(shouldRestore => {
        if (shouldRestore) {
          form.patchValue(JSON.parse(draft));
        } else {
          this.clearDraft();
        }
      });
    }
  }

  clearDraft() {
    localStorage.removeItem(this.storageKey);
  }
}