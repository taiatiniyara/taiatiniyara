import { supabase, type tables } from "@/lib/supabase";
import { useInfiniteQuery } from "@tanstack/react-query";

interface Param<T> {
    name: keyof T;
    value: string | number;
}

interface SupabaseInfiniteQueryOptions<T> {
    queryKey: string[];
    tableName: keyof typeof tables;
    fields?: (keyof T)[];
    params?: Param<T>;
    pageSize?: number;
    orderBy?: {
        column: keyof T;
        ascending: boolean;
    };
    whereIsNotEqualTo?: Param<T>;
}

export function useSupabaseInfiniteQuery<T>(options: SupabaseInfiniteQueryOptions<T>) {
    const pageSize = options.pageSize || 10;

    return useInfiniteQuery({
        queryKey: options.queryKey,
        queryFn: async ({ pageParam = 0 }) => {
            let query = supabase
                .from(options.tableName)
                .select('*', { count: 'exact' })
                .range(pageParam, pageParam + pageSize - 1);
            
            // Apply filters
            if (options.params) {
                query = query.eq(options.params.name as string, options.params.value);
            }

            if (options.orderBy) {
                query = query.order(
                    options.orderBy.column as string,
                    { ascending: options.orderBy.ascending }
                );
            }

            if (options.whereIsNotEqualTo) {
                query = query.neq(
                    options.whereIsNotEqualTo.name as string,
                    options.whereIsNotEqualTo.value
                );
            }
            
            const { data, error, count } = await query;
            if (error) {
                throw error;
            }
            return {
                data: data as T[],
                count: count || 0,
                nextCursor: pageParam + pageSize < (count || 0) ? pageParam + pageSize : undefined
            };
        },
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        initialPageParam: 0,
    });
}
