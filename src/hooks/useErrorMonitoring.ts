import { useState, useEffect } from 'react';
import { fetchDashboardData } from '../apis/dashboard';

export interface ServerError {
  id: string;
  message: string;
  endpoint: string;
  httpStatus: number | null;
  createdAt: string;
}

export const useErrorMonitoring = () => {
  const [previousErrorIds, setPreviousErrorIds] = useState<Set<string>>(new Set());
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [newErrors, setNewErrors] = useState<ServerError[]>([]);

  useEffect(() => {
    const checkErrors = async () => {
      try {
        const response = await fetchDashboardData();
        const recentServerErrors = response.data.errors.recentServerErrors;

        // 새로운 에러 ID 세트 생성
        const currentErrorIds = new Set(recentServerErrors.map(e => e.id));

        // 이전에 없던 새로운 에러 찾기
        if (previousErrorIds.size > 0) {
          const newErrorList = recentServerErrors.filter(
            error => !previousErrorIds.has(error.id)
          );

          if (newErrorList.length > 0) {
            setNewErrors(newErrorList);
            setShowErrorPopup(true);
          }
        }

        setPreviousErrorIds(currentErrorIds);
      } catch (err) {
        console.error('Failed to fetch dashboard data for error monitoring:', err);
      }
    };

    // 초기 로드
    checkErrors();

    // 3초마다 에러 체크
    const interval = setInterval(checkErrors, 3000);
    return () => clearInterval(interval);
  }, [previousErrorIds]);

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
