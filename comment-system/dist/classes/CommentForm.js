import { User } from './User.js';
import { CommentItem } from './Comment.js';
export class CommentForm {
    constructor(service, parentId) {
        this.maxLength = 1000;
        this.service = service;
        this.parentId = parentId;
        this.form = document.createElement('form');
        this.textarea = document.createElement('textarea');
        this.submitButton = document.createElement('button');
        this.initForm();
        this.setupEventListeners();
    }
    initForm() {
        this.textarea.placeholder = this.parentId ? 'Напишите ответ...' : 'Добавьте комментарий...';
        this.textarea.maxLength = this.maxLength;
        this.submitButton.textContent = 'Отправить';
        this.submitButton.disabled = true;
        this.form.classList.add('comment-form');
        this.form.append(this.textarea, this.submitButton);
    }
    setupEventListeners() {
        this.textarea.addEventListener('input', () => {
            const isValid = this.textarea.value.trim().length > 0 && this.textarea.value.length <= this.maxLength;
            this.submitButton.disabled = !isValid;
        });
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            const content = this.textarea.value.trim();
            if (!content || content.length > this.maxLength)
                return;
            fetch('https://randomuser.me/api/')
                .then(res => res.json())
                .then(data => {
                const user = new User(data.results[0]);
                const comment = new CommentItem(user, content, this.parentId);
                if (this.parentId) {
                    this.service.addReply(comment, this.parentId);
                }
                else {
                    this.service.addComment(comment);
                }
                this.textarea.value = '';
                this.submitButton.disabled = true;
            });
        });
    }
    render(container) {
        container.appendChild(this.form);
    }
}
