import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { useSupabaseCreate } from "@/hooks/useSupabaseCreate";
import type { BlogComment, UserProfile } from "@/lib/drizzle/schema";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, Reply, Send } from "lucide-react";
import { Link } from "@tanstack/react-router";

interface BlogCommentWithUser extends BlogComment {
  user_profiles: UserProfile;
  replies?: BlogCommentWithUser[];
}

interface BlogCommentsProps {
  blogPostId: string;
}

interface CommentItemProps {
  comment: BlogCommentWithUser;
  onReply: (commentId: string) => void;
  replyingTo: string | null;
  onCancelReply: () => void;
  onSubmitReply: (parentId: string, text: string) => Promise<void>;
}

function CommentItem({ comment, onReply, replyingTo, onCancelReply, onSubmitReply }: CommentItemProps) {
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSubmitReply = async () => {
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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? "minute" : "minutes"} ago`;
    if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;
    if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarFallback className="text-xs">
            {getInitials(comment.user_profiles.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm">{comment.user_profiles.name}</span>
            <span className="text-xs text-muted-foreground">
              {formatDate(comment.created_at)}
            </span>
          </div>
          <p className="text-sm text-foreground whitespace-pre-wrap break-words">
            {comment.comment_text}
          </p>
          {user && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 mt-2 text-xs"
              onClick={() => onReply(comment.id)}
            >
              <Reply className="h-3 w-3 mr-1" />
              Reply
            </Button>
          )}
        </div>
      </div>

      {replyingTo === comment.id && (
        <div className="ml-11 space-y-2">
          <Textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a reply..."
            className="min-h-[80px] resize-none"
            disabled={isSubmitting}
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleSubmitReply}
              disabled={!replyText.trim() || isSubmitting}
            >
              <Send className="h-3 w-3 mr-1" />
              {isSubmitting ? "Posting..." : "Post Reply"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onCancelReply}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-11 space-y-3 pl-4 border-l-2">
          {comment.replies.map(reply => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReply={onReply}
              replyingTo={replyingTo}
              onCancelReply={onCancelReply}
              onSubmitReply={onSubmitReply}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function BlogComments({ blogPostId }: BlogCommentsProps) {
  const { user } = useAuth();
  const [commentText, setCommentText] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  // Fetch all comments for this blog post
  const { data: commentsData, isLoading, refetch } = useSupabaseQuery<BlogCommentWithUser>({
    queryKey: [`blog_comments_${blogPostId}`],
    tableName: "blog_comments",
    params: { name: "blog_post_id", value: blogPostId },
    select: "*, user_profiles(*)",
  });

  const { createItem, isLoading: isCreating } = useSupabaseCreate({
    tableName: "blog_comments",
    onSuccess: () => {
      setCommentText("");
      setReplyingTo(null);
      refetch();
    },
  });

  // Organize comments into a tree structure
  const organizeComments = (comments: BlogCommentWithUser[]): BlogCommentWithUser[] => {
    const commentMap = new Map<string, BlogCommentWithUser>();
    const rootComments: BlogCommentWithUser[] = [];

    // First pass: create a map of all comments
    comments.forEach(comment => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    // Second pass: organize into tree structure
    comments.forEach(comment => {
      const commentWithReplies = commentMap.get(comment.id)!;
      if (comment.parent_comment_id) {
        const parent = commentMap.get(comment.parent_comment_id);
        if (parent) {
          parent.replies = parent.replies || [];
          parent.replies.push(commentWithReplies);
        }
      } else {
        rootComments.push(commentWithReplies);
      }
    });

    // Sort by date (newest first for root, oldest first for replies)
    rootComments.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    rootComments.forEach(comment => {
      if (comment.replies) {
        comment.replies.sort((a, b) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      }
    });

    return rootComments;
  };

  const organizedComments = commentsData ? organizeComments(commentsData) : [];

  const handleSubmitComment = async () => {
    if (!user || !commentText.trim()) return;

    await createItem({
      blog_post_id: blogPostId,
      user_id: user.id,
      comment_text: commentText,
      parent_comment_id: null,
    });
  };

  const handleSubmitReply = async (parentId: string, text: string) => {
    if (!user || !text.trim()) return;

    await createItem({
      blog_post_id: blogPostId,
      user_id: user.id,
      comment_text: text,
      parent_comment_id: parentId,
    });
  };

  const commentCount = commentsData?.length || 0;

  return (
    <Card className="mt-8">
      <CardHeader>
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          <h2 className="text-xl font-semibold">
            Comments ({commentCount})
          </h2>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {user ? (
          <div className="space-y-3">
            <Textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Share your thoughts..."
              className="min-h-[100px] resize-none"
              disabled={isCreating}
            />
            <Button
              onClick={handleSubmitComment}
              disabled={!commentText.trim() || isCreating}
              className="w-full sm:w-auto"
            >
              <Send className="h-4 w-4 mr-2" />
              {isCreating ? "Posting..." : "Post Comment"}
            </Button>
          </div>
        ) : (
          <div className="text-center py-6 border rounded-lg bg-muted/30">
            <p className="text-muted-foreground mb-3">
              Please sign in to leave a comment
            </p>
            <Button asChild>
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading comments...
          </div>
        ) : organizedComments.length > 0 ? (
          <div className="space-y-6 pt-4">
            {organizedComments.map(comment => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onReply={setReplyingTo}
                replyingTo={replyingTo}
                onCancelReply={() => setReplyingTo(null)}
                onSubmitReply={handleSubmitReply}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No comments yet. Be the first to comment!
          </div>
        )}
      </CardContent>
    </Card>
  );
}
