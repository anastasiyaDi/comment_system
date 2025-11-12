export class CommentItem {
    constructor(user, content, parentId) {
        this.id = Date.now().toString() + Math.random().toString(36).substring(2, 9);
        this.user = user;
        this.content = content;
        this.date = new Date();
        this.rating = 0;
        this.isFavorite = false;
        this.replies = [];
        this.parentId = parentId;
    }
    incrementRating() {
        this.rating++;
    }
    decrementRating() {
        this.rating--;
    }
    toggleFavorite() {
        this.isFavorite = !this.isFavorite;
    }
    addReply(reply) {
        if (!this.parentId) {
            this.replies.push(reply);
        }
    }
}
