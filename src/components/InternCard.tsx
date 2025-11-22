import { FaBookmark, FaRegBookmark } from 'react-icons/fa6';
import { useAuth } from '../contexts/AuthContext';
import { usePosts } from '../contexts/PostContext';
import styles from '../styles/InternCard.module.css';
import type { Post } from '../types';

interface InternCardProps {
  post: Post;
  onLoginRequired: () => void;
}

const InternCard = ({ post, onLoginRequired }: InternCardProps) => {
  const { user } = useAuth();
  const { toggleBookmark } = usePosts();

  const DOMAIN_MAP: { [key: string]: string } = {
    FINTECH: '핀테크',
    HEALTHTECH: '헬스테크',
    EDUCATION: '교육',
    ECOMMERCE: '이커머스',
    FOODTECH: '푸드테크',
    MOBILITY: '모빌리티',
    CONTENTS: '컨텐츠',
    B2B: 'B2B',
    OTHERS: '기타',
  };

  const handleBookmarkClick = async () => {
    if (!user) {
      onLoginRequired();
      return;
    }
    await toggleBookmark(post.id);
  };

  const calculateDday = (dateString: string) => {
    const endDate = new Date(dateString);
    const today = new Date();
    // UTC 기준으로 변환하여 계산
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

    if (post.employmentEndDate === null) return '상시채용';
    if (diffDays < 0) return '마감';
    if (diffDays === 0) return 'D-day';
    return `D-${diffDays}`;
  };

  const dDay = calculateDday(post.employmentEndDate);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.logo} />
        <div className={styles.titleGroup}>
          <h4 className={styles.companyName}>{post.companyName}</h4>
        </div>

        <button
          type="button"
          onClick={handleBookmarkClick}
          className={styles.bookmarkBtn}
          aria-label="북마크"
        >
          {post.isBookmarked ? (
            <FaBookmark color="royalblue" />
          ) : (
            <FaRegBookmark color="gray" />
          )}
        </button>
      </div>
      <div>
        <h3 className={styles.positionTitle}>{post.positionTitle}</h3>
      </div>
      <div className={styles.body}>
        <span className={styles.tag}>
          {DOMAIN_MAP[post.domain] || post.domain}
        </span>
        {/* <span className={styles.tag}>{post.positionType}</span> */}
      </div>
      <div className={styles.footer}>
        <span className={dDay === '마감' ? styles.deadline : styles.dDay}>
          {dDay}
        </span>
      </div>
    </div>
  );
};

export default InternCard;
