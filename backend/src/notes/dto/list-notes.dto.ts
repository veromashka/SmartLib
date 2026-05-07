import { PaginationQueryDto } from '../../common/dto/pagination.dto';

/**
 * Notes list query — pagination only for now. Add filters
 * (date range, hasComment, etc.) here when needed.
 */
export class ListNotesQueryDto extends PaginationQueryDto {}
