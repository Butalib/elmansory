import { EnvironmentInjector, createEnvironmentInjector, runInInjectionContext } from '@angular/core';
import { firstValueFrom, of } from 'rxjs';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { RefreshService } from '../refresh.service';
import { ApiDataService } from './api.data.service';
import { GenericCrudService } from './generic-crud.service';

interface TestItem {
  id: number;
}

describe('GenericCrudService refresh integration', () => {
  let injector: EnvironmentInjector | undefined;

  afterEach(() => {
    injector?.destroy();
    injector = undefined;
    vi.restoreAllMocks();
  });

  it('reloads its authoritative items when a refresh event is emitted', async () => {
    const refreshService = new RefreshService();
    const refreshedItems: TestItem[] = [{ id: 1 }];
    const apiService = {
      get: vi.fn(() => of(refreshedItems)),
    };

    injector = createEnvironmentInjector(
      [{ provide: RefreshService, useValue: refreshService }],
      null,
    );

    const service = runInInjectionContext(injector, () =>
      new GenericCrudService<TestItem>(
        'test-items',
        apiService as unknown as ApiDataService,
      ),
    );

    refreshService.refresh();

    expect(apiService.get).toHaveBeenCalledWith('test-items', undefined);
    await expect(firstValueFrom(service.items$)).resolves.toEqual(refreshedItems);
  });
});
