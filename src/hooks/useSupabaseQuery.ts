import { supabase, type tables } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";


interface Param<T> {
    name: keyof T;
    value: string | number;
}

interface SupabaseQueryOptions<T> {
    // Define the options for the Supabase query here
    queryKey: string[];
    tableName: keyof typeof tables;
    fields?: (keyof T)[];
    params?: Param<T>;
    numberOfItems?: number;
}

export function useSupabaseQuery<T>(options: SupabaseQueryOptions<T>) {
    // Implementation goes here
    const { data, error, isLoading } = useQuery({
        queryKey: options.queryKey,
        queryFn: async () => {
            let query = supabase
                .from(options.tableName)
                .select('*')
                .limit(options.numberOfItems || 100);
            
            // Only apply the .eq() filter if params are provided
            if (options.params) {
                query = query.eq(options.params.name as string, options.params.value);
            }
            
            const { data, error } = await query;
            if (error) {
                throw error;
            }
            return data as T[];
        }
    });
    return { data, error, isLoading };
}