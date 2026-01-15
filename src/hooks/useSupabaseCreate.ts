import { supabase, type tables } from "@/lib/supabase";
import { useState } from "react";

interface SupabaseCreateOptions {
    tableName: keyof typeof tables;
    onSuccess?: () => void;
    onError?: (error: Error) => void;
}

interface SupabaseCreateResult<T> {
    createItem: (data: Partial<T>) => Promise<T[] | null>;
    isLoading: boolean;
    error: Error | null;
}

/**
 * Custom hook for creating items in Supabase
 * @template T - The type of data being created
 * @param options - Configuration options including table name and callbacks
 * @returns Object containing createItem function, loading state, and error
 */
export function useSupabaseCreate<T = any>(
    options: SupabaseCreateOptions
): SupabaseCreateResult<T> {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const createItem = async (data: Partial<T>): Promise<T[] | null> => {
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
            return result as T[];
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