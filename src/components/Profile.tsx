import { FaLink } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { useProfile } from '../contexts/ProfileContext';
import styles from '../styles/Profile.module.css';

const Profile = () => {
  const { loading, profile } = useProfile();

  return (
    <div>
      {loading ? (
        <p>loading ...</p>
      ) : profile ? (
        <div id="myInfo">
          <div className={styles.col} id="SummaryInfo">
            <h3 className={styles.title}>{profile.name}</h3>
            <p className={styles.bodyText}>{profile.email}</p>
            <p className={styles.bodyText}>
              {profile.department.split(',').join('∙')}{' '}
              {profile.enrollYear - 2000}학번
            </p>
            <br />
          </div>
          <div className={styles.col} id="BasicInfo">
            {(profile.positions ||
              profile.stacks ||
              profile.explanation ||
              profile.links) && <h3 className={styles.title}>기본 정보</h3>}

            {profile.positions && (
              <div id="position">
                <h4 className={styles.title}>희망 직무</h4>
                <span>{profile.positions.join(', ')}</span>
              </div>
            )}

            {profile.slogan && (
              <div id="slogan">
                <h4 className={styles.title}>한 줄 소개</h4>
                <span className={styles.bodyText}>{profile.slogan}</span>
              </div>
            )}

            {profile.stacks && (
              <div id="stack">
                <h4 className={styles.title}>기술 스택</h4>
                <ul className={styles.stackChips}>
                  {profile.stacks.map((stack) => (
                    <li key={stack} className={styles.stackChip}>
                      {stack}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {profile.explanation && (
              <div id="explanation">
                <h4 className={styles.title}>자기소개</h4>
                <p className={styles.bodyText}>{profile.explanation}</p>
              </div>
            )}

            {profile.links && (
              <div id="links">
                <h4 className={styles.title}>소개 링크</h4>
                <ul>
                  {profile.links.map((l) => (
                    <li key={l.link}>
                      <span className={styles.bodyText}>{l.description}</span>
                      <a href={l.link} className={styles.link}>
                        <FaLink />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className={styles.profilePromptContainer}>
          <h2 className={styles.promptTitle}>
            아직 프로필이 등록되지 않았어요!
          </h2>
          <p className={styles.promptSubtitle}>
            기업에 소개할 나의 정보를 작성해서 나를 소개해보세요.
          </p>
          <Link to="/mypage/profile/new" className={styles.promptButton}>
            지금 바로 프로필 작성하기
          </Link>
        </div>
      )}
    </div>
  );
};
export default Profile;
