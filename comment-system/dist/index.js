import { CommentService } from './classes/CommentService.js';
import { CommentUI } from './classes/CommentUI.js';
document.addEventListener('DOMContentLoaded', () => {
    const commentService = new CommentService();
    new CommentUI(commentService, 'comment-container');
});
