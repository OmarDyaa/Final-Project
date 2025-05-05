export class ShopParams {
  brands: string[] = [];
  types: string[] = [];
  sort: string = 'name';
  pageNumber = 1;
  pageSize = 10;
  search = '';
  timestamp?: number; // Add timestamp property for cache-busting
}
