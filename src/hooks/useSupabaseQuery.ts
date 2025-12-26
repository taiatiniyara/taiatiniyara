import { supabase, type tables } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";


interface SupabaseQueryOptions {
    // Define the options for the Supabase query here
    queryKey: string[];
    tableName: keyof typeof tables;
    fields?: string[];
}

export function useSupabaseQuery<T>(options: SupabaseQueryOptions) {
    // Implementation goes here
    const { data, error, isLoading } = useQuery({
        queryKey: options.queryKey,
        queryFn: async () => {
            const { data, error } = await supabase
                .from(options.tableName)
                .select(options.fields ? options.fields.join(', ') : '*');
            if (error) {
                throw error;
            }
            return data as T[];
        }
    });
    return { data, error, isLoading };
}