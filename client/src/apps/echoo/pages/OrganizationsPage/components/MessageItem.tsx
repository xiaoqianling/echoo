import { JSX } from 'solid-js';

interface Message {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
}

interface MessageItemProps {
  message: Message;
  formatDate: (dateString: string) => string;
}

export const MessageItem = (props: MessageItemProps): JSX.Element => {
  const { message, formatDate } = props;

  return (
    <div class="message-item">
      <div class="message-header">
        <div class="message-title">{message.title}</div>
        <div class="message-meta">
          <span class="message-author">
            {message.author}
          </span>
          <span class="message-date">
            {formatDate(message.createdAt)}
          </span>
        </div>
        <div class="message-content">{message.content}</div>
      </div>
    </div>
  );
};