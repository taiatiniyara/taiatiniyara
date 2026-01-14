import { supabase, type tables } from "@/lib/supabase";
import { useState } from "react";

interface SupabaseCreateOptions {
    tableName: keyof typeof tables;
    onSuccess?: () => void;
    onError?: (error: Error) => void;
}

export function useSupabaseCreate<T = any>(options: SupabaseCreateOptions) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const createItem = async (data: Partial<T>) => {
        setIsLoading(true);
        setError(null);
        try {
            const { data: result, error } = await supabase
                .from(options.tableName)
                .insert(data)
                .select();
            if (error) {
                throw error;
            }
            options.onSuccess?.();
            return result;
        } catch (err) {
            const error = err as Error;
            setError(error);
            options.onError?.(error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return { createItem, isLoading, error };
}