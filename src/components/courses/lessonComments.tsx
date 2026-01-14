import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { supabase } from "@/lib/supabase";
import type { LessonComment, UserProfile } from "@/lib/drizzle/schema";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface LessonCommentsProps {
  lessonId: string;
}

interface CommentWithUser extends LessonComment {
  user_profiles?: UserProfile;
}

interface CommentItemProps {
  comment: CommentWithUser;
  replies: CommentWithUser[];
  onReply: (parentId: string) => void;
  onDelete: (commentId: string) => void;
  user: any;
  replyingTo: string | null;
  onCancelReply: () => void;
  onSubmitReply: (parentId: string, text: string) => Promise<void>;
}

function CommentItem({ 
  comment, 
  replies, 
  onReply, 
  onDelete, 
  user, 
  replyingTo,
  onCancelReply,
  onSubmitReply
}: CommentItemProps) {
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmitReply(comment.id, replyText);
      setReplyText("");
      onCancelReply();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-semibold text-sm">
                {comment.user_profiles?.name?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
            <div>
              <p className="font-medium text-sm">
                {comment.user_profiles?.name || "Anonymous"}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(comment.created_at), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>

          {user && (user.id === comment.user_id || user.user_metadata?.role === "admin") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(comment.id)}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </Button>
          )}
        </div>

        <p className="text-sm leading-relaxed whitespace-pre-wrap mb-3">
          {comment.comment_text}
        </p>

        {user && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onReply(comment.id)}
            className="text-xs"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
              />
            </svg>
            Reply
          </Button>
        )}
      </div>

      {/* Reply Form */}
      {replyingTo === comment.id && (
        <div className="ml-8 mt-3 p-3 bg-background rounded-lg border">
          <form onSubmit={handleSubmitReply}>
            <Textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Reply to ${comment.user_profiles?.name || "this comment"}...`}
              className="min-h-20 mb-2"
              disabled={isSubmitting}
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onCancelReply}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isSubmitting || !replyText.trim()}>
                {isSubmitting ? "Posting..." : "Post Reply"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Nested Replies */}
      {replies.length > 0 && (
        <div className="ml-8 mt-3 space-y-3 border-l-2 border-primary/20 pl-4">
          {replies.map((reply) => (
            <div key={reply.id} className="p-3 rounded-lg bg-background/50">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-semibold text-xs">
                      {reply.user_profiles?.name?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-xs">
                      {reply.user_profiles?.name || "Anonymous"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(reply.created_at), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>

                {user && (user.id === reply.user_id || user.user_metadata?.role === "admin") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(reply.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 h-7 w-7 p-0"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </Button>
                )}
              </div>

              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {reply.comment_text}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function LessonComments({ lessonId }: LessonCommentsProps) {
  const { user } = useAuth();
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Fetch comments with user data
  const { data: allComments, isLoading } = useQuery({
    queryKey: [`lesson-comments/${lessonId}`],
    enabled: !!lessonId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lesson_comments")
        .select("*, user_profiles(*)")
        .eq("lesson_id", lessonId)
        .order("created_at", { ascending: true });
      
      if (error) throw error;
      return data as CommentWithUser[];
    },
  });

  // Separate top-level comments from replies
  const topLevelComments = allComments?.filter(c => !c.parent_comment_id) || [];
  const replies = allComments?.filter(c => c.parent_comment_id) || [];

  const getRepliesForComment = (commentId: string) => {
    return replies.filter(r => r.parent_comment_id === commentId);
  };

  const handleSubmitComment = async (e: React.FormEvent, parentId?: string) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please sign in to post a comment");
      return;
    }

    if (!commentText.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("lesson_comments")
        .insert({
          lesson_id: lessonId,
          user_id: user.id,
          comment_text: commentText.trim(),
          parent_comment_id: parentId || null,
        });

      if (error) throw error;

      toast.success("Comment posted successfully!");
      setCommentText("");
      queryClient.invalidateQueries({ queryKey: [`lesson-comments/${lessonId}`] });
    } catch (error) {
      console.error("Error posting comment:", error);
      toast.error("Failed to post comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitReply = async (parentId: string, text: string) => {
    if (!user) {
      toast.error("Please sign in to post a reply");
      return;
    }

    try {
      const { error } = await supabase
        .from("lesson_comments")
        .insert({
          lesson_id: lessonId,
          user_id: user.id,
          comment_text: text.trim(),
          parent_comment_id: parentId,
        });

      if (error) throw error;

      toast.success("Reply posted successfully!");
      queryClient.invalidateQueries({ queryKey: [`lesson-comments/${lessonId}`] });
    } catch (error) {
      console.error("Error posting reply:", error);
      toast.error("Failed to post reply. Please try again.");
      throw error;
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      const { error } = await supabase
        .from("lesson_comments")
        .delete()
        .eq("id", commentId);

      if (error) throw error;

      toast.success("Comment deleted successfully!");
      queryClient.invalidateQueries({ queryKey: [`lesson-comments/${lessonId}`] });
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment. Please try again.");
    }
  };

  return (
    <Card className="p-6">
      <Heading level={3} className="mb-6">
        Discussion ({allComments?.length || 0})
      </Heading>

      {/* Comment Form */}
      {user ? (
        <form onSubmit={(e) => handleSubmitComment(e)} className="mb-8">
          <Textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Share your thoughts or ask a question..."
            className="min-h-25 mb-3"
            disabled={isSubmitting}
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting || !commentText.trim()}>
              {isSubmitting ? "Posting..." : "Post Comment"}
            </Button>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-4 bg-muted rounded-lg text-center">
          <p className="text-muted-foreground mb-3">
            Sign in to join the discussion
          </p>
          <Button size="sm" asChild>
            <Link to="/login">Sign In</Link>
          </Button>
        </div>
      )}

      {/* Comments List */}
      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">
          Loading comments...
        </div>
      ) : topLevelComments.length > 0 ? (
        <div className="space-y-4">
          {topLevelComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              replies={getRepliesForComment(comment.id)}
              onReply={setReplyingTo}
              onDelete={handleDeleteComment}
              user={user}
              replyingTo={replyingTo}
              onCancelReply={() => setReplyingTo(null)}
              onSubmitReply={handleSubmitReply}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <svg
            className="w-12 h-12 mx-auto mb-3 opacity-50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <p>No comments yet. Be the first to share your thoughts!</p>
        </div>
      )}
    </Card>
  );
}