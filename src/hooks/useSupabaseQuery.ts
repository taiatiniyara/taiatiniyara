import { type tables } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { buildSupabaseQuery } from "@/lib/supabase-query-builder";

interface Param<T> {
    name: keyof T;
    value: string | number;
}

interface SupabaseQueryOptions<T> {
    queryKey: string[];
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
}

export function useSupabaseQuery<T>(options: SupabaseQueryOptions<T>) {
    const { data, error, isLoading } = useQuery({
        queryKey: options.queryKey,
        enabled: options.enabled !== false,
        queryFn: async () => {
            const query = buildSupabaseQuery<T>(options.tableName, {
                params: options.params,
                orderBy: options.orderBy,
                whereIsNotEqualTo: options.whereIsNotEqualTo,
            }).limit(options.numberOfItems || 100);
            
            const { data, error } = await query;
            if (error) throw error;
            return data as T[];
        }
    });
    return { data, error, isLoading };
}