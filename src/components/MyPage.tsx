import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProfile } from '../contexts/ProfileContext';
import styles from '../styles/MyPage.module.css';
import Bookmark from './Bookmark';
import Profile from './Profile';

const MyPage = () => {
  const { profile } = useProfile();

  const [activeTab, setActiveTab] = useState<'myinfo' | 'bookmarks'>(
    'bookmarks'
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>마이페이지</h1>
      <div className={styles.menuHeader}>
        <div className={styles.menu}>
          <button
            type="button"
            className={activeTab === 'bookmarks' ? styles.active : ''}
            onClick={() => setActiveTab('bookmarks')}
          >
            관심공고
          </button>
          <button
            type="button"
            className={activeTab === 'myinfo' ? styles.active : ''}
            onClick={() => setActiveTab('myinfo')}
          >
            내 정보
          </button>
        </div>
        {activeTab === 'myinfo' && (
          <Link to="/mypage/profile/new" className={styles.createProfileButton}>
            {profile ? '내 프로필 수정' : '내 프로필 생성'}
          </Link>
        )}
      </div>
      <div className={styles.content}>
        {activeTab === 'bookmarks' ? (
          // 북마크 랜더링
          <Bookmark />
        ) : (
          // 'myinfo' 페이지
          // api로 프로필이 있는지 확인해야 함
          <Profile />
        )}
      </div>
    </div>
  );
};

export default MyPage;
