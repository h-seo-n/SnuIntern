import { useEffect } from 'react';
import { FaBookmark } from 'react-icons/fa6';
import { usePosts } from '../contexts/PostContext';
import styles from '../styles/Bookmark.module.css';
import type { Post } from '../types';

const Bookmark = () => {
  const { bookmarkedPosts, getBookmark, isLoading } = usePosts();

  useEffect(() => {
    getBookmark();
  }, [getBookmark]);

  const calculateDday = (post: Post) => {
    const dateString = post.employmentEndDate;
    if (!dateString) return '상시채용';

    const endDate = new Date(dateString);
    const today = new Date();
    const utcEndDate = Date.UTC(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate()
    );
    const utcToday = Date.UTC(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const diffTime = utcEndDate - utcToday;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (diffDays < 0) return '마감';
    if (diffDays === 0) return 'D-day';
    return `D-${diffDays}`;
  };

  if (isLoading) {
    return <p>로딩 중...</p>;
  }

  if (!bookmarkedPosts || bookmarkedPosts.length === 0) {
    return <p>관심공고가 없습니다.</p>;
  }

  return (
    <div className={styles.container}>
      {bookmarkedPosts.map((post) => {
        const dDay = calculateDday(post);
        return (
          <div key={post.id} className={styles.card}>
            <div className={styles.header}>
              <FaBookmark color="gray" />
              <h4 className={styles.companyName}>{post.companyName}</h4>
            </div>

            <div className={styles.details}>
              <h3 className={styles.positionTitle}>
                {post.positionTitle.length > 30
                  ? `${post.positionTitle.substring(0, 30)}...`
                  : post.positionTitle}
              </h3>
              <div className={styles.footer}>
                <span
                  className={
                    dDay === '마감' ? styles.deadline : styles.recruiting
                  }
                >
                  {dDay}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Bookmark;
