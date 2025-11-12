import { CommentItem } from './Comment.js';

export class CommentService {
  private comments: CommentItem[];
  private storageKey: string;

  constructor(storageKey: string = 'comments') {
    this.storageKey = storageKey;
    this.comments = this.loadComments();
  }

  private loadComments(): CommentItem[] {
    const stored = localStorage.getItem(this.storageKey);
    if (!stored) return [];

    return JSON.parse(stored).map((item: any) => {
      const comment = new CommentItem(
        item.user,
        item.content,
        item.parentId
      );
      comment.id = item.id;
      comment.date = new Date(item.date);
      comment.rating = item.rating;
      comment.isFavorite = item.isFavorite;
      comment.replies = item.replies.map((r: any) => {
        const reply = new CommentItem(r.user, r.content, r.parentId);
        reply.id = r.id;
        reply.date = new Date(r.date);
        reply.rating = r.rating;
        reply.isFavorite = r.isFavorite;
        return reply;
      });
      return comment;
    });
  }

  private saveComments(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.comments));
  }

  addComment(comment: CommentItem): void {
    this.comments.push(comment);
    this.saveComments();
  }

  addReply(reply: CommentItem, parentId: string): void {
    const parent = this.comments.find(comment => comment.id === parentId);
    if (parent) {
      parent.addReply(reply);
      this.saveComments();
    }
  }

  updateComment(updatedComment: CommentItem): void {
    const index = this.comments.findIndex(c => c.id === updatedComment.id);
    if (index !== -1) {
      this.comments[index] = updatedComment;
      this.saveComments();
    }
  }

  getComments(): CommentItem[] {
    return [...this.comments];
  }

  getFavoriteComments(): CommentItem[] {
    return this.comments.filter(comment => comment.isFavorite);
  }

  sortByDate(ascending: boolean = true): CommentItem[] {
    return [...this.comments].sort((a, b) => {
      const diff = new Date(a.date).getTime() - new Date(b.date).getTime();
      return ascending ? diff : -diff;
    });
  }

  sortByRating(ascending: boolean = true): CommentItem[] {
    return [...this.comments].sort((a, b) => {
      const diff = a.rating - b.rating;
      return ascending ? diff : -diff;
    });
  }

  sortByReplies(ascending: boolean = true): CommentItem[] {
    return [...this.comments].sort((a, b) => {
      const diff = a.replies.length - b.replies.length;
      return ascending ? diff : -diff;
    });
  }
}