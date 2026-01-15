import { useState, useMemo } from "react";
import { useAuth } from "@/context/auth-context";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { useSupabaseCreate } from "@/hooks/useSupabaseCreate";
import type { BlogComment, UserProfile } from "@/lib/drizzle/schema";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, Reply, Send, Edit2, Trash2, MoreVertical } from "lucide-react";
import { Link } from "@tanstack/react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Skeleton } from "../ui/skeleton";

interface BlogCommentWithUser extends BlogComment {
  user_profiles: UserProfile;
  replies?: BlogCommentWithUser[];
}

interface BlogCommentsProps {
  blogPostId: string;
}

type SortOption = 'newest' | 'oldest';

interface CommentItemProps {
  comment: BlogCommentWithUser;
  onReply: (commentId: string) => void;
  replyingTo: string | null;
  onCancelReply: () => void;
  onSubmitReply: (parentId: string, text: string) => Promise<void>;
  onEdit: (commentId: string) => void;
  onDelete: (commentId: string) => void;
  editingId: string | null;
  onCancelEdit: () => void;
  onSaveEdit: (commentId: string, text: string) => Promise<void>;
}

const MAX_COMMENT_LENGTH = 1000;

function CommentItem({ 
  comment, 
  onReply, 
  replyingTo, 
  onCancelReply, 
  onSubmitReply,
  onEdit,
  onDelete,
  editingId,
  onCancelEdit,
  onSaveEdit 
}: CommentItemProps) {
  const [replyText, setReplyText] = useState("");
  const [editText, setEditText] = useState(comment.comment_text);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const isAuthor = user?.id === comment.user_id;
  const isEditing = editingId === comment.id;

  const handleSubmitReply = async () => {
    if (!replyText.trim() || replyText.length > MAX_COMMENT_LENGTH) return;
    
    setIsSubmitting(true);
    try {
      await onSubmitReply(comment.id, replyText);
      setReplyText("");
      onCancelReply();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editText.trim() || editText.length > MAX_COMMENT_LENGTH) return;
    
    setIsSubmitting(true);
    try {
      await onSaveEdit(comment.id, editText);
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
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback className="text-xs">
            {getInitials(comment.user_profiles.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">{comment.user_profiles.name}</span>
              <span className="text-xs text-muted-foreground">
                {formatDate(comment.created_at)}
              </span>
              {comment.updated_at !== comment.created_at && (
                <span className="text-xs text-muted-foreground italic">(edited)</span>
              )}
            </div>
            {isAuthor && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(comment.id)}>
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onDelete(comment.id)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          
          {isEditing ? (
            <div className="space-y-2 mt-2">
              <Textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="min-h-20 resize-none"
                disabled={isSubmitting}
                maxLength={MAX_COMMENT_LENGTH}
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {editText.length}/{MAX_COMMENT_LENGTH}
                </span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleSaveEdit}
                    disabled={!editText.trim() || editText === comment.comment_text || isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Save"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onCancelEdit}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm text-foreground whitespace-pre-wrap wrap-break-word">
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
            </>
          )}
        </div>
      </div>

      {replyingTo === comment.id && (
        <div className="ml-11 space-y-2">
          <Textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a reply..."
            className="min-h-20 resize-none"
            disabled={isSubmitting}
            maxLength={MAX_COMMENT_LENGTH}
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {replyText.length}/{MAX_COMMENT_LENGTH}
            </span>
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
              onEdit={onEdit}
              onDelete={onDelete}
              editingId={editingId}
              onCancelEdit={onCancelEdit}
              onSaveEdit={onSaveEdit}
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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('newest');

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
      toast.success("Comment posted successfully!");
    },
    onError: () => {
      toast.error("Failed to post comment");
    }
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

    return rootComments;
  };

  // Sort comments based on selected option
  const sortComments = (comments: BlogCommentWithUser[], option: SortOption): BlogCommentWithUser[] => {
    const sorted = [...comments];
    
    switch (option) {
      case 'newest':
        sorted.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      case 'oldest':
        sorted.sort((a, b) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        break;
    }

    // Always sort replies by oldest first for readability
    sorted.forEach(comment => {
      if (comment.replies && comment.replies.length > 0) {
        comment.replies.sort((a, b) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      }
    });

    return sorted;
  };

  const organizedComments = useMemo(() => {
    if (!commentsData) return [];
    const organized = organizeComments(commentsData);
    return sortComments(organized, sortBy);
  }, [commentsData, sortBy]);

  const handleSubmitComment = async () => {
    if (!user || !commentText.trim() || commentText.length > MAX_COMMENT_LENGTH) return;

    await createItem({
      blog_post_id: blogPostId,
      user_id: user.id,
      comment_text: commentText,
      parent_comment_id: null,
    });
  };

  const handleSubmitReply = async (parentId: string, text: string) => {
    if (!user || !text.trim() || text.length > MAX_COMMENT_LENGTH) return;

    await createItem({
      blog_post_id: blogPostId,
      user_id: user.id,
      comment_text: text,
      parent_comment_id: parentId,
    });
  };

  const handleEdit = (commentId: string) => {
    setEditingId(commentId);
    setReplyingTo(null);
  };

  const handleSaveEdit = async (commentId: string, text: string) => {
    if (!text.trim() || text.length > MAX_COMMENT_LENGTH) return;

    try {
      const { error } = await supabase
        .from('blog_comments')
        .update({ 
          comment_text: text,
          updated_at: new Date().toISOString()
        })
        .eq('id', commentId);

      if (error) throw error;

      setEditingId(null);
      refetch();
      toast.success("Comment updated successfully!");
    } catch (error) {
      console.error('Error updating comment:', error);
      toast.error("Failed to update comment");
    }
  };

  const handleDelete = (commentId: string) => {
    setCommentToDelete(commentId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!commentToDelete) return;

    try {
      const { error } = await supabase
        .from('blog_comments')
        .delete()
        .eq('id', commentToDelete);

      if (error) throw error;

      setDeleteDialogOpen(false);
      setCommentToDelete(null);
      refetch();
      toast.success("Comment deleted successfully!");
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error("Failed to delete comment");
    }
  };

  const commentCount = commentsData?.length || 0;

  return (
    <>
      <Card className="mt-8 py-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <h2 className="text-xl font-semibold">
                Comments ({commentCount})
              </h2>
            </div>
            {commentCount > 0 && (
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                <SelectTrigger className="w-35">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {user ? (
            <div className="space-y-3">
              <Textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Share your thoughts..."
                className="min-h-20 resize-none"
                disabled={isCreating}
                maxLength={MAX_COMMENT_LENGTH}
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {commentText.length}/{MAX_COMMENT_LENGTH}
                </span>
                <Button
                  onClick={handleSubmitComment}
                  disabled={!commentText.trim() || isCreating}
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isCreating ? "Posting..." : "Post Comment"}
                </Button>
              </div>
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
            <div className="space-y-4 pt-4">
              <CommentSkeleton />
              <CommentSkeleton />
              <CommentSkeleton />
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
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  editingId={editingId}
                  onCancelEdit={() => setEditingId(null)}
                  onSaveEdit={handleSaveEdit}
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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Comment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this comment? This action cannot be undone.
              All replies to this comment will also be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function CommentSkeleton() {
  return (
    <div className="flex gap-3">
      <Skeleton className="h-8 w-8 rounded-full shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-16 w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-7 w-16" />
          <Skeleton className="h-7 w-16" />
        </div>
      </div>
    </div>
  );
}
