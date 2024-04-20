import styles from './Message.module.css';

// general component to use anywhere we want to show a message, we easily pass the required message as a prop
function Message({ message }) {
  return (
    <p className={styles.message}>
      <span role='img'>👋</span> {message}
    </p>
  );
}

export default Message;
