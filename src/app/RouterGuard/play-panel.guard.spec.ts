import { TestBed, async, inject } from '@angular/core/testing';

import { PlayPanelGuard } from './play-panel.guard';

describe('PlayPanelGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PlayPanelGuard]
    });
  });

  it('should ...', inject([PlayPanelGuard], (guard: PlayPanelGuard) => {
    expect(guard).toBeTruthy();
  }));
});
