import { type tables } from "@/lib/supabase";
import { useInfiniteQuery } from "@tanstack/react-query";
import { buildSupabaseQuery } from "@/lib/supabase-query-builder";

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
            const query = buildSupabaseQuery<T>(
                options.tableName,
                {
                    params: options.params,
                    orderBy: options.orderBy,
                    whereIsNotEqualTo: options.whereIsNotEqualTo,
                },
                { count: 'exact' }
            ).range(pageParam, pageParam + pageSize - 1);
            
            const { data, error, count } = await query;
            if (error) throw error;
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
