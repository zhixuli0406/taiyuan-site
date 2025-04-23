import React, { useState } from 'react';
import styles from './LineChatFloatingButton.module.css'; // Assuming CSS Modules are used

const LineChatFloatingButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const lineAddFriendUrl = 'https://line.me/R/ti/p/@855glzdc';

  return (
    <div className={styles.container}>
      {/* Chat Window */}
      <div className={`${styles.chatWindow} ${isOpen ? styles.open : ''}`}>
        <div className={styles.chatHeader}>
          <span>與我們聯絡</span>
          <button onClick={toggleChat} className={styles.closeButton}>×</button>
        </div>
        <div className={styles.chatBody}>
          <p>點擊下方按鈕，透過 LINE 與我們聯繫！</p>
          <a
            href={lineAddFriendUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.lineButton}
          >
            <img src="https://scdn.line-apps.com/n/line_add_friends/btn/zh-Hant.png" alt="加入好友" height="36" border="0" />
          </a>
           {/* <img src="/path/to/your/line-qr-code.png" alt="LINE QR Code" className={styles.qrCode} /> */}
        </div>
      </div>

      {/* Floating Button */}
      <button onClick={toggleChat} className={styles.chatButton}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
        </svg>
      </button>
    </div>
  );
};

export default LineChatFloatingButton; 