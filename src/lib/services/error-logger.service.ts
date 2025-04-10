import type { SupabaseClient } from "../../db/supabase.client";

export type ErrorLevel = "info" | "warning" | "error" | "critical";

export class ErrorLoggerService {
  constructor(private supabase: SupabaseClient) {}

  async logError(error: Error, level: ErrorLevel = "error", userId?: string) {
    try {
      const { error: logError } = await this.supabase.from("error_logs").insert({
        user_id: userId,
        error_level: level,
        error_message: error.message,
        error_stack: error.stack,
        created_at: new Date().toISOString(),
      });
      // TODO: Remove this once we have a proper error logging system
      if (logError) {
        console.error("Failed to log error to database:", logError);
      }
    } catch (e) {
      console.error("Error logging failed:", e);
    }
  }
}
