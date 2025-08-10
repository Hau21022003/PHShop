export class PaginationResultDto<T> {
  data: T[];
  total: number;

  constructor(items: T[], total: number) {
    this.data = items;
    this.total = total;
  }
}
