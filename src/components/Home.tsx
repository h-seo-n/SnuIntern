import { type ChangeEvent, useEffect, useState } from 'react';
import { FaAngleDown, FaAngleUp, FaArrowRotateRight } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import styles from '../Home.module.css';
import { encodeQueryParams, usePosts } from '../contexts/PostContext';
import InternCard from './InternCard';

type OpenDropdownType = 'rec' | 'dm' | 'new' | null;

const Home = () => {
  const DOMAINS: string[] = [
    'FINTECH',
    'HEALTHTECH',
    'EDUCATION',
    'ECOMMERCE',
    'FOODTECH',
    'MOBILITY',
    'CONTENTS',
    'B2B',
    'OTHERS',
  ];

  const DEV: string[] = ['FRONT', 'APP', 'BACKEND', 'DATA', 'OTHERS'];

  const { posts, isLoading, fetchPosts, paginator } = usePosts();
  const [panelExpanded, setPanelExpanded] = useState(false);
  const [roles, setRoles] = useState<string[]>([]);

  const [isActive, setIsActive] = useState(false);
  const [recStatus, setRecStatus] = useState<'all' | 'recruiting'>(
    isActive ? 'recruiting' : 'all'
  );

  const [domains, setDomain] = useState<string[]>(DOMAINS);
  const [dmStatus, setDmStatus] = useState<string[]>(domains);

  const [order, setOrder] = useState<number>(0);
  const [orderStatus, setOrderStatus] = useState<number>(0);

  const [query, setQuery] = useState<string>('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const [openDropdown, setOpenDropdown] = useState<OpenDropdownType>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  // const postsPerPage = 12;

  const currentPosts = posts;
  const totalPages = paginator;

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleDropdownToggle = (dropdown: OpenDropdownType) => {
    setOpenDropdown((prev) => (prev === dropdown ? null : dropdown));
  };

  const handleLoginRequired = () => {
    setIsModalOpen(true);
  };

  // make fetch api call
  useEffect(() => {
    fetchPosts(query);
  }, [query, fetchPosts]);

  // when filter settings change, re-calculate query (leads to above useEffect, i.e fetchPosts)
  useEffect(() => {
    const q: string = encodeQueryParams({
      params: {
        roles: roles.length === 0 ? null : roles,
        isActive: isActive,
        domains: domains.length === DOMAINS.length ? null : domains, // if null -> all domains
        order: order,
        page: currentPage - 1,
      },
    });
    setQuery(q);
  }, [roles, isActive, domains, order, currentPage]);

  // role check
  const handleRoleCheck = (e: ChangeEvent<HTMLInputElement>) => {
    const { checked, value } = e.currentTarget;
    if (value === 'total') {
      if (checked)
        setRoles((p) => [...DEV, ...p.filter((v) => !DEV.includes(v))]);
      else setRoles((p) => [...p.filter((v) => !DEV.includes(v))]);
    } else {
      setRoles((p) => {
        if (checked) return [...p, value];
        return p.filter((v) => v !== value);
      });
    }
    setCurrentPage(1);
  };

  // domain check
  const handleDomainCheck = (e: ChangeEvent<HTMLInputElement>) => {
    const { checked, value } = e.currentTarget;
    if (value === 'all') {
      if (checked) {
        setDmStatus(DOMAINS);
      } else {
        setDmStatus([]);
      }
    } else {
      setDmStatus((p) => {
        if (checked) return [...p, value];
        return p.filter((v) => v !== value);
      });
    }
  };

  const handleReset = () => {
    // reset 모집 상태 selection and other filters
    setIsActive(false);
    setDomain(DOMAINS);
    setOrder(0);

    setRecStatus('all');
    setDmStatus(DOMAINS);
    setOrderStatus(0);
    setCurrentPage(1);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const pageBlockSize = 5;

    const currentBlock = Math.ceil(currentPage / pageBlockSize);

    const startPage = (currentBlock - 1) * pageBlockSize + 1;
    const endPage = startPage + pageBlockSize - 1;

    for (let i = startPage; i <= endPage; i++) {
      const isDisabled = i > totalPages;

      pageNumbers.push(
        <button
          key={i}
          onClick={() => !isDisabled && handlePageChange(i)}
          disabled={isDisabled}
          className={`
           ${currentPage === i ? styles.activePage : ''}
            ${isDisabled ? styles.disabledPage : ''} 
            `}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  return (
    <>
      <main className={styles.main}>
        <div className={styles.contentWrapper}>
          <div className={styles.filterContainer}>
            <button
              className={
                panelExpanded
                  ? `${styles.accordion} ${styles.active}`
                  : `${styles.accordion}`
              }
              onClick={() => {
                setPanelExpanded((p) => !p);
              }}
            >
              <span>직군 필터</span>
              {panelExpanded ? <FaAngleUp /> : <FaAngleDown />}
            </button>
            {panelExpanded && (
              <div className={styles.panel}>
                <section className="col">
                  <h3>개발</h3>
                  <div className="row">
                    <label htmlFor="check-dev-total">전체</label>
                    <input
                      type="checkbox"
                      id="check-dev-total"
                      name="total"
                      value="total"
                      checked={DEV.every((d) => roles.includes(d))}
                      onChange={handleRoleCheck}
                    ></input>
                  </div>
                  <div className="row">
                    <label htmlFor="check-dev-front">프론트엔드 개발</label>
                    <input
                      type="checkbox"
                      id="check-dev-front"
                      name="check-dev-front"
                      value="FRONT"
                      checked={roles.includes('FRONT')}
                      onChange={handleRoleCheck}
                    ></input>
                  </div>
                  <div className="row">
                    <label htmlFor="check-dev-backend">서버⋅백엔드 개발</label>
                    <input
                      type="checkbox"
                      id="check-dev-backend"
                      name="backend"
                      value="BACKEND"
                      checked={roles.includes('BACKEND')}
                      onChange={handleRoleCheck}
                    ></input>
                  </div>
                  <div className="row">
                    <label htmlFor="check-dev-app">앱 개발</label>
                    <input
                      type="checkbox"
                      id="check-dev-app"
                      name="app"
                      value="APP"
                      checked={roles.includes('APP')}
                      onChange={handleRoleCheck}
                    ></input>
                  </div>
                  <div className="row">
                    <label htmlFor="check-dev-others">기타 분야</label>
                    <input
                      type="checkbox"
                      id="check-dev-others"
                      name="others"
                      value="OTHERS"
                      checked={roles.includes('OTHERS')}
                      onChange={handleRoleCheck}
                    ></input>
                  </div>
                </section>

                <section>
                  <h3>기획</h3>
                  <div className="row">
                    <label htmlFor="project-total">전체</label>
                    <input
                      type="checkbox"
                      id="project-total"
                      name="PLANNING"
                      value="PLANNING"
                      checked={roles.includes('PLANNING')}
                      onChange={handleRoleCheck}
                    ></input>
                  </div>
                </section>

                <section>
                  <h3>디자인</h3>
                  <div className="row">
                    <label htmlFor="design-total">전체</label>
                    <input
                      type="checkbox"
                      id="design-total"
                      name="DESIGN"
                      value="DESIGN"
                      checked={roles.includes('DESIGN')}
                      onChange={handleRoleCheck}
                    ></input>
                  </div>
                </section>
                <section>
                  <h3>마케팅</h3>
                  <div className="row">
                    <label htmlFor="marketing-total">전체</label>
                    <input
                      type="checkbox"
                      id="marketing-total"
                      name="MARKETING"
                      value="MARKETING"
                      checked={roles.includes('MARKETING')}
                      onChange={handleRoleCheck}
                    ></input>
                  </div>
                </section>
              </div>
            )}
          </div>
          <div className={styles.postsArea}>
            <ul className={styles.chips}>
              {/* 모집 상태 옵션 버튼 */}
              <li
                className={`${styles.chip} ${styles.modalTrigger}`}
                onClick={() => handleDropdownToggle('rec')}
              >
                <span>모집 상태</span>{' '}
                {openDropdown === 'rec' ? <FaAngleUp /> : <FaAngleDown />}
                {/* 모집 상태 팝업 */}
                {openDropdown === 'rec' && (
                  <div
                    className={styles.modal}
                    onClick={(e) => e.stopPropagation()} // prevents clicks inside from closing modal
                  >
                    <div className={styles.modalOptions}>
                      <label className={styles.radioLabel}>
                        <input
                          type="radio"
                          name="recStatus"
                          value="all"
                          checked={recStatus === 'all'}
                          onChange={() => setRecStatus('all')}
                        />
                        <span className={styles.radioVisual}></span>
                        <span>전체</span>
                      </label>

                      <label className={styles.radioLabel}>
                        <input
                          type="radio"
                          name="recStatus"
                          value="recruiting"
                          checked={recStatus === 'recruiting'}
                          onChange={() => setRecStatus('recruiting')}
                        />
                        <span className={styles.radioVisual}></span>
                        <span>모집중</span>
                      </label>
                    </div>
                    <div className={styles.modalActions}>
                      <button
                        className={`${styles.btn} ${styles.btnReset}`}
                        onClick={() => setRecStatus('all')}
                      >
                        초기화
                      </button>
                      <button
                        className={`${styles.btn} ${styles.btnApply}`}
                        onClick={() => {
                          setIsActive(recStatus === 'recruiting');
                          setOpenDropdown(null);
                          setCurrentPage(1);
                        }}
                      >
                        적용
                      </button>
                    </div>
                  </div>
                )}
              </li>

              {/* 업종 옵션 버튼 */}
              <li
                className={`${styles.chip} ${styles.modalTrigger}`}
                onClick={() => handleDropdownToggle('dm')}
              >
                <span>업종</span>{' '}
                {openDropdown === 'dm' ? <FaAngleUp /> : <FaAngleDown />}
                {/* 업종 선택 팝업 */}
                {openDropdown === 'dm' && (
                  <div
                    className={styles.modal}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className={styles.modalOptions}>
                      <div className="row">
                        <label htmlFor="all">전체</label>
                        <input
                          type="checkbox"
                          name="dmStatus"
                          id="all"
                          value="all"
                          checked={
                            dmStatus.length === DOMAINS.length &&
                            DOMAINS.every((d) => dmStatus.includes(d))
                          }
                          onChange={handleDomainCheck}
                        />
                      </div>
                      <div className="row">
                        <label htmlFor="fin">핀테크</label>
                        <input
                          type="checkbox"
                          name="dmStatus"
                          id="fin"
                          value="FINTECH"
                          checked={dmStatus?.includes('FINTECH')}
                          onChange={handleDomainCheck}
                        />
                      </div>
                      <div className="row">
                        <label htmlFor="ht">헬스테크</label>
                        <input
                          type="checkbox"
                          name="dmStatus"
                          id="ht"
                          value="HEALTHTECH"
                          checked={dmStatus?.includes('HEALTHTECH')}
                          onChange={handleDomainCheck}
                        />
                      </div>
                      <div className="row">
                        <label htmlFor="ed">교육</label>
                        <input
                          type="checkbox"
                          name="dmStatus"
                          id="ed"
                          value="EDUCATION"
                          checked={dmStatus?.includes('EDUCATION')}
                          onChange={handleDomainCheck}
                        />
                      </div>
                      <div className="row">
                        <label htmlFor="ec">이커머스</label>
                        <input
                          type="checkbox"
                          name="dmStatus"
                          id="ec"
                          value="ECOMMERCE"
                          checked={dmStatus?.includes('ECOMMERCE')}
                          onChange={handleDomainCheck}
                        />
                      </div>
                      <div className="row">
                        <label htmlFor="ft">푸드테크</label>
                        <input
                          type="checkbox"
                          name="dmStatus"
                          id="ft"
                          value="FOODTECH"
                          checked={dmStatus?.includes('FOODTECH')}
                          onChange={handleDomainCheck}
                        />
                      </div>
                      <div className="row">
                        <label htmlFor="mb">모빌리티</label>
                        <input
                          type="checkbox"
                          name="dmStatus"
                          id="mb"
                          value="MOBILITY"
                          checked={dmStatus?.includes('MOBILITY')}
                          onChange={handleDomainCheck}
                        />
                      </div>
                      <div className="row">
                        <label htmlFor="con">컨텐츠</label>
                        <input
                          type="checkbox"
                          name="dmStatus"
                          id="con"
                          value="CONTENTS"
                          checked={dmStatus?.includes('CONTENTS')}
                          onChange={handleDomainCheck}
                        />
                      </div>
                      <div className="row">
                        <label htmlFor="b2b">B2B</label>
                        <input
                          type="checkbox"
                          name="dmStatus"
                          id="b2b"
                          value="B2B"
                          checked={dmStatus?.includes('B2B')}
                          onChange={handleDomainCheck}
                        />
                      </div>
                      <div className="row">
                        <label htmlFor="others">기타</label>
                        <input
                          type="checkbox"
                          name="dmStatus"
                          id="others"
                          value="OTHERS"
                          checked={dmStatus?.includes('OTHERS')}
                          onChange={handleDomainCheck}
                        />
                      </div>
                    </div>
                    <div className={styles.modalActions}>
                      <button
                        className={`${styles.btn} ${styles.btnReset}`}
                        onClick={() => setDmStatus(DOMAINS)}
                      >
                        초기화
                      </button>
                      <button
                        className={`${styles.btn} ${styles.btnApply}`}
                        onClick={() => {
                          setDomain(dmStatus);
                          setOpenDropdown(null);
                          setCurrentPage(1);
                        }}
                      >
                        적용
                      </button>
                    </div>
                  </div>
                )}
              </li>

              {/* 순서 */}
              <li
                className={`${styles.chip} ${styles.modalTrigger}`}
                onClick={() => handleDropdownToggle('new')}
              >
                <span>최신순</span>{' '}
                {openDropdown === 'new' ? <FaAngleUp /> : <FaAngleDown />}
                {/* 순서 선택 팝업 */}
                {openDropdown === 'new' && (
                  <div
                    className={styles.modal}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className={styles.modalOptions}>
                      <label className={styles.radioLabel}>
                        <input
                          type="radio"
                          name="orderStatus"
                          value={0}
                          checked={orderStatus === 0}
                          onChange={() => setOrderStatus(0)}
                        />
                        <span className={styles.radioVisual}></span>
                        <span>공고등록순</span>
                      </label>
                      <label className={styles.radioLabel}>
                        <input
                          type="radio"
                          name="orderStatus"
                          value={1}
                          checked={orderStatus === 1}
                          onChange={() => setOrderStatus(1)}
                        />
                        <span className={styles.radioVisual}></span>
                        <span>마감임박순</span>
                      </label>
                    </div>
                    <div className={styles.modalActions}>
                      <button
                        className={`${styles.btn} ${styles.btnReset}`}
                        onClick={() => setOrderStatus(0)}
                      >
                        초기화
                      </button>
                      <button
                        className={`${styles.btn} ${styles.btnApply}`}
                        onClick={() => {
                          setOrder(orderStatus);
                          setOpenDropdown(null);
                          setCurrentPage(1);
                        }}
                      >
                        적용
                      </button>
                    </div>
                  </div>
                )}
              </li>
              <li className={styles.resetChip} onClick={handleReset}>
                <FaArrowRotateRight /> <span>초기화</span>
              </li>
            </ul>

            <section className={styles.postList}>
              {isLoading ? (
                <p>Loading...</p>
              ) : (
                //test
                currentPosts?.map((post) => (
                  <InternCard
                    key={post.id}
                    post={post}
                    onLoginRequired={handleLoginRequired}
                  />
                ))
              )}
            </section>

            <div className={styles.pagination}>
              <button
                className={`${styles.btn}`}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                이전
              </button>
              {renderPageNumbers()}
              <button
                className={`${styles.btn}`}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                다음
              </button>
            </div>
          </div>
        </div>
        {isModalOpen && (
          <div
            className={styles.modalBackdrop}
            onClick={() => setIsModalOpen(false)}
          >
            <div
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <p>로그인이 필요한 기능입니다.</p>
              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnReset}`}
                  onClick={() => setIsModalOpen(false)}
                >
                  뒤로가기
                </button>
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnApply}`}
                  onClick={() => navigate('/login')}
                >
                  로그인하기
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default Home;
