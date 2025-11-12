import { CommentItem } from './Comment.js';
export class CommentService {
    constructor(storageKey = 'comments') {
        this.storageKey = storageKey;
        this.comments = this.loadComments();
    }
    loadComments() {
        const stored = localStorage.getItem(this.storageKey);
        if (!stored)
            return [];
        return JSON.parse(stored).map((item) => {
            const comment = new CommentItem(item.user, item.content, item.parentId);
            comment.id = item.id;
            comment.date = new Date(item.date);
            comment.rating = item.rating;
            comment.isFavorite = item.isFavorite;
            comment.replies = item.replies.map((r) => {
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
    saveComments() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.comments));
    }
    addComment(comment) {
        this.comments.push(comment);
        this.saveComments();
    }
    addReply(reply, parentId) {
        const parent = this.comments.find(comment => comment.id === parentId);
        if (parent) {
            parent.addReply(reply);
            this.saveComments();
        }
    }
    updateComment(updatedComment) {
        const index = this.comments.findIndex(c => c.id === updatedComment.id);
        if (index !== -1) {
            this.comments[index] = updatedComment;
            this.saveComments();
        }
    }
    getComments() {
        return [...this.comments];
    }
    getFavoriteComments() {
        return this.comments.filter(comment => comment.isFavorite);
    }
    sortByDate(ascending = true) {
        return [...this.comments].sort((a, b) => {
            const diff = new Date(a.date).getTime() - new Date(b.date).getTime();
            return ascending ? diff : -diff;
        });
    }
    sortByRating(ascending = true) {
        return [...this.comments].sort((a, b) => {
            const diff = a.rating - b.rating;
            return ascending ? diff : -diff;
        });
    }
    sortByReplies(ascending = true) {
        return [...this.comments].sort((a, b) => {
            const diff = a.replies.length - b.replies.length;
            return ascending ? diff : -diff;
        });
    }
}
