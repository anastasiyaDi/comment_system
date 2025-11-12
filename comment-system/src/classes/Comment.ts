import { User } from './User.js';

export class CommentItem {
  id: string;
  user: User;
  content: string;
  date: Date;
  rating: number;
  isFavorite: boolean;
  replies: CommentItem[];
  parentId?: string;

  constructor(user: User, content: string, parentId?: string) {
    this.id = Date.now().toString() + Math.random().toString(36).substring(2, 9);
    this.user = user;
    this.content = content;
    this.date = new Date();
    this.rating = 0;
    this.isFavorite = false;
    this.replies = [];
    this.parentId = parentId;
  }

  incrementRating(): void {
    this.rating++;
  }

  decrementRating(): void {
    this.rating--;
  }

  toggleFavorite(): void {
    this.isFavorite = !this.isFavorite;
  }

  addReply(reply: CommentItem): void {
    if (!this.parentId) {
      this.replies.push(reply);
    }
  }
}