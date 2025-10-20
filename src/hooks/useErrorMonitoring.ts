import { useState, useEffect } from 'react';
import { fetchApiErrors } from '../apis/apiErrors';
import type { ApiError } from '../types/apiErrors';

export const useErrorMonitoring = () => {
  const [previousTotalErrors, setPreviousTotalErrors] = useState<number | null>(null);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [newErrors, setNewErrors] = useState<ApiError[]>([]);

  useEffect(() => {
    const checkErrors = async () => {
      try {
        const response = await fetchApiErrors({
          page: 1,
          limit: 10, // 최근 에러 10개 가져오기
        });

        const newTotalErrors = response.data.meta.totalItems;

        // 이전 에러 개수와 비교하여 증가했는지 확인
        if (previousTotalErrors !== null && newTotalErrors > previousTotalErrors) {
          const increase = newTotalErrors - previousTotalErrors;
          // 증가한 개수만큼 최신 에러 가져오기
          const latestErrors = response.data.errors.slice(0, Math.min(increase, 10));
          setNewErrors(latestErrors);
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
    newErrors,
    closePopup,
  };
};
