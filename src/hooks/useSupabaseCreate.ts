import { supabase, type tables } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

interface SupabaseCreateOptions<T> {
    // Define the options for the Supabase create here
    tableName: keyof typeof tables;
    data: Partial<T>;
}

export function useSupabaseCreate<T>(options: SupabaseCreateOptions<T>) {
    const { data, isLoading, error } = useQuery({
        queryKey: [options.tableName + "_create"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from(options.tableName)
                .insert(options.data)
                .select();
            if (error) {
                throw error;
            }
            return data as T[];
        }
    });

    return { data, isLoading, error };
}