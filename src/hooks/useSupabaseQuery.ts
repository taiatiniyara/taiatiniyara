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
}

export function useSupabaseQuery<T>(options: SupabaseQueryOptions<T>) {
    // Implementation goes here
    const { data, error, isLoading } = useQuery({
        queryKey: options.queryKey,
        queryFn: async () => {
            const { data, error } = await supabase
                .from(options.tableName)
                .select(options.fields ? options.fields.join(', ') : '*')
                .eq(options.params?.name as string, options.params?.value);
            if (error) {
                throw error;
            }
            return data as T[];
        }
    });
    return { data, error, isLoading };
}