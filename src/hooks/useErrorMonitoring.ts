import { useState, useEffect } from 'react';
import { fetchApiErrors } from '../apis/apiErrors';

export const useErrorMonitoring = () => {
  const [previousTotalErrors, setPreviousTotalErrors] = useState<number | null>(null);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorIncrease, setErrorIncrease] = useState(0);

  useEffect(() => {
    const checkErrors = async () => {
      try {
        const response = await fetchApiErrors({
          page: 1,
          limit: 1, // 개수만 확인하면 되므로 최소한의 데이터만 요청
        });

        const newTotalErrors = response.data.meta.totalItems;

        // 이전 에러 개수와 비교하여 증가했는지 확인
        if (previousTotalErrors !== null && newTotalErrors > previousTotalErrors) {
          const increase = newTotalErrors - previousTotalErrors;
          setErrorIncrease(increase);
          setShowErrorPopup(true);
        }

        setPreviousTotalErrors(newTotalErrors);
      } catch (err) {
        console.error('Failed to fetch API errors for monitoring:', err);
      }
    };

    // 초기 로드
    checkErrors();

    // 3초마다 에러 체크
    const interval = setInterval(checkErrors, 3000);
    return () => clearInterval(interval);
  }, [previousTotalErrors]);

  // 팝업 자동 숨김 (5초 후)
  useEffect(() => {
    if (showErrorPopup) {
      const timer = setTimeout(() => {
        setShowErrorPopup(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showErrorPopup]);

  const closePopup = () => {
    setShowErrorPopup(false);
  };

  return {
    showErrorPopup,
    errorIncrease,
    closePopup,
  };
};
