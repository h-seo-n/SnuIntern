import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaFolderPlus } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api';
import { useProfile } from '../contexts/ProfileContext';
import styles from '../styles/Profile.module.css';

const CreateProfile = () => {
  const { profile } = useProfile();

  const [isSaving, setIsSaving] = useState(false);
  // 마지막 확인 : 학번/학과/이력서 다 valid한 input으로 차있음
  const [canSave, setCanSave] = useState<boolean>(true);

  const [classNumber, setClassNumber] = useState<string>(
    profile ? (profile.enrollYear - 2000).toString() : ''
  );
  const [classNumberOk, setClassNumberOk] = useState<boolean>(true);

  const [majors, setMajors] = useState<string[]>(
    profile ? profile.department.split(',') : ['']
  ); // has at least one element
  const [majorOk, setMajorOk] = useState<Boolean>(true);

  // file
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvOk, setCvOk] = useState<boolean>(true);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // positions (optional)
  const [positions, setPositions] = useState<string[]>(
    profile?.positions?.length ? profile.positions : ['']
  );
  const [positionsOk, setPositionsOk] = useState(true);

  /**
   * when the index'th major input is edited
   * @param index
   * @param value
   */
  const handleMajorChange = (index: number, value: string) => {
    setMajors((prev) => prev.map((m, i) => (i === index ? value : m)));
  };

  /**
   * add a new input
   */
  const addMajor = () => {
    if (majors.length >= 6) return;
    setMajors((prev) => [...prev, '']);
  };

  /**
   * delete major by index number
   */
  const majorDelete = (index: number) => {
    if (index === 0) alert('주전공은 삭제할 수 없습니다.');
    else {
      setMajors((prev) => prev.filter((_, i) => i !== index));
    }
  };

  /**
   * limit input file to pf
   * usage: when file input filled
   * @param e
   */
  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      alert('PDF 파일만 업로드할 수 있습니다.');
      setCvOk(false);
      e.target.value = '';
      return;
    }
    setCvFile(file);
  };

  /**
   * delete file from state & reset input val
   * usage: when CV deleted
   */
  const handleDeleteCv = () => {
    setCvFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /**
   * checks whether entered class number is valid or not
   * usage: when 'save' button clicked
   */
  const checkId = useCallback(() => {
    // only accept numbers & apply globally for input string
    // accept only two digits
    const containsOnlyNumbers = (str: string): boolean => {
      return /^\d+$/.test(str);
    };

    if (containsOnlyNumbers(classNumber) && classNumber.length === 2) {
      setClassNumberOk(true);
    } else {
      setClassNumberOk(false);
    }
  }, [classNumber]);

  useEffect(() => {
    checkId();
  }, [checkId]);

  /**
   * check whether entered major value is valid or not
   */
  const checkMajorOk = useCallback(() => {
    if (majors[0] && new Set(majors).size === majors.length) setMajorOk(true);
    else setMajorOk(false);
  }, [majors]);

  useEffect(() => {
    checkMajorOk();
  }, [checkMajorOk]);
  /**
   * check whether entered cv value is valid or not
   */
  const checkCV = useCallback(() => {
    if (cvFile && cvFile.size < 5000000) setCvOk(true);
    else setCvOk(false);
  }, [cvFile]);

  useEffect(() => {
    checkCV();
  }, [checkCV]);

  const handlePositionChange = (index: number, value: string) => {
    // 100자 제한
    if (value.length > 100) value = value.slice(0, 100);
    setPositions((prev) => prev.map((p, i) => (i === index ? value : p)));
  };

  const addPosition = () => {
    setPositions((prev) => [...prev, '']);
  };

  const deletePosition = (index: number) => {
    setPositions((prev) => prev.filter((_, i) => i !== index));
  };

  const checkPositionsOk = useCallback(() => {
    const filled = positions.map((p) => p.trim()).filter(Boolean);
    const noDup = new Set(filled).size === filled.length;
    const within100 = filled.every((p) => p.length <= 100);
    setPositionsOk(noDup && within100);
  }, [positions]);

  useEffect(() => {
    checkPositionsOk();
  }, [checkPositionsOk]);

  const checkOptionalOk = useCallback(() => {
    return positionsOk;
  }, [positionsOk]);

  /**
   * consider whether required inputs are not empty & are valid
   */
  const checkSavePossible = useCallback((): boolean => {
    return Boolean(
      classNumberOk &&
        majorOk &&
        cvOk &&
        cvFile &&
        classNumber &&
        majors.filter(Boolean).length > 0
    );
  }, [classNumberOk, majorOk, cvOk, cvFile, classNumber, majors]);
  const generateRandomString = (length: number = 10) => {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };
  const getYYMMDD = () => {
    const now = new Date();
    const year = String(now.getFullYear()).slice(2); // 2025 → "25"
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}${month}${day}`; // "251122"
  };

  const saveProfile = async () => {
    const savePossible = checkSavePossible();
    const optionalOk = checkOptionalOk();

    if (!savePossible || !cvFile || !optionalOk) {
      setCanSave(savePossible);
      return;
    }
    setIsSaving(true);
    try {
      const enrollYear: number = parseInt(classNumber) + 2000;
      const department: string = majors.filter(Boolean).join(',');
      const cv: string = `static/private/CV/${generateRandomString()}_${getYYMMDD()}/${cvFile.name}.pdf`;
      const cleanedPositions = positions.map((p) => p.trim()).filter(Boolean);

      // file
      await apiClient.put('/api/applicant/me', {
        enrollYear,
        department,
        positions: cleanedPositions,
        cvKey: cv,
        // slogan,
        // explanation
        // stacks
        // links
      });
      setCanSave(true);
      navigate('/mypage');
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };
  /**
   * for '뒤로가기' button
   */
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div id="main">
      <h2 className={styles.title}>
        {profile ? '프로필 수정' : '프로필 생성'}
      </h2>
      <h3 className={styles.title}>필수 작성 항목</h3>
      <span className={styles.smallText}>아래 항목은 필수로 작성해주세요.</span>

      <div id="classNumber">
        <span className={styles.title}>
          학번 <span className={styles.redText}>*</span>
        </span>
        <div className="row">
          <input
            type="text"
            value={classNumber}
            onChange={(e) => setClassNumber(e.target.value)}
            placeholder={classNumber ? classNumber : ''}
          />
          <label>학번</label>
        </div>
        {!classNumberOk && (
          <p className={styles.redText}>
            두 자리 수 숫자로 작성해주세요. (e.g. 25)
          </p>
        )}
      </div>

      <div id="major">
        <span className={styles.title}>
          학과
          <span className={styles.redText}>*</span>
        </span>
        {majors.map((major, idx) => (
          <div className="row" key={idx}>
            <input
              type="text"
              placeholder={
                idx > 0
                  ? `부전공 학과명 (예시: 컴퓨터공학부, 심리학과 등)`
                  : `주전공 학과명 (예시: 컴퓨터공학부, 심리학과 등)`
              }
              onChange={(e) => handleMajorChange(idx, e.target.value)}
              value={major}
            />
            {idx > 0 && (
              <button
                type="button"
                onClick={() => {
                  majorDelete(idx);
                }}
                className={styles.createProfileButton}
              >
                삭제
              </button>
            )}
          </div>
        ))}
        <button
          className={styles.createProfileButton}
          onClick={addMajor}
          disabled={majors.length >= 6}
        >
          추가
        </button>
        {!majorOk && (
          <p className={styles.redText}>
            주전공은 필수 작성이며, 다전공은 총 6개 이하로 중복되지 않게
            입력해주세요.
          </p>
        )}
      </div>

      <div id="cv">
        <span className={styles.title}>
          이력서
          <span className={styles.redText}>*</span>
        </span>

        {cvFile ? (
          <div className={styles.cvInfo}>
            <span>{cvFile.name}</span>
            <button
              type="button"
              onClick={handleDeleteCv}
              className={styles.createProfileButton}
            >
              삭제
            </button>
          </div>
        ) : (
          <div>
            <input
              id="cvInput"
              className={styles.hide}
              type="file"
              accept="application/pdf"
              onChange={handleCvChange}
              ref={fileInputRef}
            />
            <div
              className={styles.fileInput}
              onClick={() => fileInputRef.current?.click()}
            >
              <FaFolderPlus />
              <span>PDF 파일만 업로드 가능해요.</span>
            </div>
          </div>
        )}
      </div>
      <hr></hr>
      <h3 className={styles.title}>선택 작성 항목</h3>
      <span className={styles.smallText}>
        아래 항목은 필수로 작성하지 않아도 괜찮지만, 작성해 주시면 채용 담당자가
        지원자의 강점을 이해하는 데 더욱 도움이 되어요.
      </span>
      <div id="positions">
        <span className={styles.title}>희망 직무</span>
        {positions.map((pos, idx) => (
          <div className="row" key={idx}>
            <input
              type="text"
              value={pos}
              placeholder="희망 직무 (100자 이내)"
              onChange={(e) => handlePositionChange(idx, e.target.value)}
            />
            {idx > 0 && (
              <button
                type="button"
                onClick={() => deletePosition(idx)}
                className={styles.createProfileButton}
              >
                삭제
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={addPosition}
          className={styles.createProfileButton}
        >
          추가
        </button>

        {!positionsOk && (
          <p className={styles.redText}>
            중복되지 않는 100자 이내의 직무명을 작성해주세요.
          </p>
        )}
      </div>
      <div className="col" id="buttons">
        <button
          onClick={async () => {
            await saveProfile();
          }}
          className={styles.promptButton}
        >
          {isSaving ? '저장 중...' : '저장'}
        </button>
        {!canSave && (
          <p className={styles.redText}>
            필수 입력란들을 조건에 맞게 입력했는지 다시 한번 확인해주세요.
          </p>
        )}
        <button onClick={handleGoBack} className={styles.createProfileButton}>
          뒤로 가기
        </button>
      </div>
    </div>
  );
};

export default CreateProfile;
