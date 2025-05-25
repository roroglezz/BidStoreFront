import { TestBed } from '@angular/core/testing';

import { FavoriteproductsService } from './favoriteproducts.service';

describe('FavoriteproductsService', () => {
  let service: FavoriteproductsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FavoriteproductsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
