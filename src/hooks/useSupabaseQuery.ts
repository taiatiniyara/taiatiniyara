import { type tables } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { buildSupabaseQuery } from "@/lib/supabase-query-builder";
import { PAGINATION } from "@/lib/constants";

interface Param<T> {
    name: keyof T;
    value: string | number;
}

interface SupabaseQueryOptions<T> {
    queryKey: readonly string[] | string[];
    tableName: keyof typeof tables;
    fields?: (keyof T)[];
    params?: Param<T>;
    numberOfItems?: number;
    orderBy?: {
        column: keyof T;
        ascending: boolean;
    };
    whereIsNotEqualTo?: Param<T>;
    enabled?: boolean;
    select?: string;
}

interface SupabaseQueryResult<T> {
    data: T[] | undefined;
    error: Error | null;
    isLoading: boolean;
    refetch: () => void;
}

/**
 * Custom hook for querying data from Supabase with TanStack Query
 * @template T - The type of data being queried
 * @param options - Query configuration options
 * @returns Query result with data, error, loading state, and refetch function
 */
export function useSupabaseQuery<T>(
    options: SupabaseQueryOptions<T>
): SupabaseQueryResult<T> {
    const { data, error, isLoading, refetch } = useQuery({
        queryKey: options.queryKey as any[],
        enabled: options.enabled !== false,
        queryFn: async () => {
            // Convert fields array to select string if fields is provided
            const selectString = options.fields 
                ? options.fields.join(',')
                : options.select;
            
            const query = buildSupabaseQuery<T>(options.tableName, {
                params: options.params,
                orderBy: options.orderBy,
                whereIsNotEqualTo: options.whereIsNotEqualTo,
                select: selectString,
            }).limit(options.numberOfItems || PAGINATION.defaultLimit);
            
            const { data, error } = await query;
            if (error) throw error;
            return data as T[];
        }
    });
    
    return { 
        data, 
        error: error as Error | null, 
        isLoading, 
        refetch 
    };
}