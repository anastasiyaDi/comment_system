import { CommentService } from './CommentService.js';
import { CommentItem } from './Comment.js';
import { CommentForm } from './CommentForm.js';

export class CommentUI {
  private service: CommentService;
  private container: HTMLElement;
  private sortSelect: HTMLSelectElement;
  private sortOrderBtn: HTMLButtonElement;
  private favoriteFilterBtn: HTMLButtonElement;
  private isAscending: boolean = false;
  private isFavoriteFilter: boolean = false;
  private commentList: HTMLElement;

  constructor(service: CommentService, containerId: string) {
    this.service = service;
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Контейнер с id "${containerId}" не найден`);
    }
    this.container = container;

    this.sortSelect = document.createElement('select');
    this.sortOrderBtn = document.createElement('button');
    this.favoriteFilterBtn = document.createElement('button');
    this.commentList = document.createElement('div');

    this.initUI();
    this.setupEventListeners();
    this.renderComments();
  }

  private initUI(): void {
    const controlPanel = document.createElement('div');
    controlPanel.className = 'comment-controls';

    this.sortSelect.innerHTML = `
      <option value="date">По дате</option>
      <option value="rating">По рейтингу</option>
      <option value="replies">По ответам</option>
    `;

    this.sortOrderBtn.textContent = '▲';
    this.sortOrderBtn.title = 'Сортировать по возрастанию';
    this.sortOrderBtn.className = 'sort-order-btn';

    this.favoriteFilterBtn.textContent = 'Избранное';
    this.favoriteFilterBtn.className = 'filter-btn';

    controlPanel.append(this.sortSelect, this.sortOrderBtn, this.favoriteFilterBtn);
    this.container.appendChild(controlPanel);

    this.commentList = document.createElement('div');
    this.commentList.className = 'comment-list';
    this.container.appendChild(this.commentList);

    const commentForm = new CommentForm(this.service);
    commentForm.render(this.container);
  }

  private setupEventListeners(): void {
    this.sortSelect.addEventListener('change', () => this.renderComments());
    this.sortOrderBtn.addEventListener('click', () => {
      this.isAscending = !this.isAscending;
      this.sortOrderBtn.textContent = this.isAscending ? '▲' : '▼';
      this.renderComments();
    });

    this.favoriteFilterBtn.addEventListener('click', () => {
      this.isFavoriteFilter = !this.isFavoriteFilter;
      this.favoriteFilterBtn.classList.toggle('active', this.isFavoriteFilter);
      this.renderComments();
    });
  }

  private renderComment(comment: CommentItem): HTMLElement {
    const commentEl = document.createElement('div');
    commentEl.className = `comment ${comment.parentId ? 'reply' : ''} ${comment.isFavorite ? 'favorite' : ''}`;
    commentEl.dataset.id = comment.id;

    commentEl.innerHTML = `
      <div class="comment-header">
        <img src="${comment.user.avatar.thumbnail}" alt="${comment.user.getFullName()}" class="comment-avatar">
        <div class="comment-meta">
          <h4 class="comment-author">${comment.user.getFullName()}</h4>
          <time class="comment-date">${new Date(comment.date).toLocaleString()}</time>
        </div>
        <button class="comment-favorite" title="${comment.isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}">
          ${comment.isFavorite ? '★' : '☆'}
        </button>
      </div>
      <div class="comment-content">${comment.content}</div>
      <div class="comment-actions">
        <button class="comment-rating-up" title="Понравилось">▲ ${comment.rating > 0 ? comment.rating : ''}</button>
        <button class="comment-rating-down" title="Не понравилось">▼ ${comment.rating < 0 ? Math.abs(comment.rating) : ''}</button>
        <button class="comment-reply" title="Ответить">Ответить</button>
      </div>
      <div class="reply-form-container"></div>
      <div class="replies-container ${comment.replies.length === 0 ? 'hidden' : ''}"></div>
    `;

    commentEl.querySelector('.comment-favorite')?.addEventListener('click', () => {
      comment.toggleFavorite();
      this.service.updateComment(comment);
      this.renderComments();
    });

    commentEl.querySelector('.comment-rating-up')?.addEventListener('click', () => {
      comment.incrementRating();
      this.service.updateComment(comment);
      this.renderComments();
    });

    commentEl.querySelector('.comment-rating-down')?.addEventListener('click', () => {
      comment.decrementRating();
      this.service.updateComment(comment);
      this.renderComments();
    });

    commentEl.querySelector('.comment-reply')?.addEventListener('click', () => {
      const replyFormContainer = commentEl.querySelector('.reply-form-container') as HTMLElement;
      replyFormContainer.innerHTML = '';
      const replyForm = new CommentForm(this.service, comment.id);
      replyForm.render(replyFormContainer);
    });

    const repliesContainer = commentEl.querySelector('.replies-container') as HTMLElement;
    comment.replies.forEach(reply => {
      const replyEl = this.renderComment(reply);
      repliesContainer.appendChild(replyEl);
    });

    return commentEl;
  }

  renderComments(): void {
    this.commentList.innerHTML = '';

    let commentsToRender = this.service.getComments();

    if (this.isFavoriteFilter) {
      commentsToRender = this.service.getFavoriteComments();
    }

    switch (this.sortSelect.value) {
      case 'date':
        commentsToRender = this.service.sortByDate(this.isAscending);
        break;
      case 'rating':
        commentsToRender = this.service.sortByRating(this.isAscending);
        break;
      case 'replies':
        commentsToRender = this.service.sortByReplies(this.isAscending);
        break;
    }

    commentsToRender.forEach(comment => {
      if (!comment.parentId) {
        const commentEl = this.renderComment(comment);
        this.commentList.appendChild(commentEl);
      }
    });
  }
}