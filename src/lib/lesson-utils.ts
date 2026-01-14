import { supabase } from "@/lib/supabase";

/**
 * Automatically determines the next order number for a lesson within a course
 * by finding the maximum existing order and incrementing it by 1.
 * If no lessons exist for the course, returns 1.
 * 
 * @param courseId - The UUID of the course
 * @returns The next available order number
 */
export async function getNextLessonOrder(courseId: string): Promise<number> {
  const { data, error } = await supabase
    .from("lessons")
    .select("order")
    .eq("course_id", courseId)
    .order("order", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    // If no lessons exist yet, start from 1
    if (error.code === "PGRST116") {
      return 1;
    }
    console.error("Error fetching lesson order:", error);
    return 1;
  }

  return (data?.order ?? 0) + 1;
}
