import { supabase, type tables } from "@/lib/supabase";

interface Param<T> {
  name: keyof T;
  value: string | number;
}

interface QueryFilter<T> {
  params?: Param<T>;
  orderBy?: {
    column: keyof T;
    ascending: boolean;
  };
  whereIsNotEqualTo?: Param<T>;
  select?: string;
}

/**
 * Unified function to build Supabase queries
 * Eliminates duplicate query building logic across hooks
 */
export function buildSupabaseQuery<T>(
  tableName: keyof typeof tables,
  filter: QueryFilter<T>,
  selectOptions?: string | { count?: 'exact' | 'planned' | 'estimated' }
) {
  // Use filter.select if provided, otherwise use selectOptions, otherwise default to '*'
  const selectQuery = filter.select || selectOptions;
  
  let query = typeof selectQuery === 'string' 
    ? supabase.from(tableName).select(selectQuery)
    : selectQuery
    ? supabase.from(tableName).select('*', selectQuery)
    : supabase.from(tableName).select('*');

  if (filter.params) {
    query = query.eq(filter.params.name as string, filter.params.value);
  }

  if (filter.orderBy) {
    query = query.order(filter.orderBy.column as string, {
      ascending: filter.orderBy.ascending,
    });
  }

  if (filter.whereIsNotEqualTo) {
    query = query.neq(
      filter.whereIsNotEqualTo.name as string,
      filter.whereIsNotEqualTo.value
    );
  }

  return query;
}
