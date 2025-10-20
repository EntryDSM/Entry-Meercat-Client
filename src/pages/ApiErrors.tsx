import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { fetchApiErrors } from '../apis/apiErrors';
import type { ApiError, ApiErrorsData } from '../types/apiErrors';

export const ApiErrors = () => {
  const [data, setData] = useState<ApiErrorsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFilter, setShowFilter] = useState(false);

  // 필터 상태
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [errorType, setErrorType] = useState<'CLIENT' | 'SERVER' | ''>('');
  const [resolutionStatus, setResolutionStatus] = useState<'RESOLVED' | 'UNRESOLVED' | ''>('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // 에러 증가 알림 팝업 상태
  const [previousTotalErrors, setPreviousTotalErrors] = useState<number | null>(null);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorIncrease, setErrorIncrease] = useState(0);

  const loadErrors = async () => {
    setLoading(true);
    setError(null);
    try {
      // 최대 1000건까지만 조회 가능
      const maxLimit = Math.min(limit, 1000);
      const response = await fetchApiErrors({
        page,
        limit: maxLimit,
        errorType: errorType || undefined,
        resolutionStatus: resolutionStatus || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });

      const newTotalErrors = response.data.meta.totalItems;

      // 이전 에러 개수와 비교하여 증가했는지 확인
      if (previousTotalErrors !== null && newTotalErrors > previousTotalErrors) {
        const increase = newTotalErrors - previousTotalErrors;
        setErrorIncrease(increase);
        setShowErrorPopup(true);
      }

      setPreviousTotalErrors(newTotalErrors);
      setData(response.data);
    } catch (err) {
      setError('에러 데이터를 불러오는데 실패했습니다.');
      console.error('Failed to fetch API errors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadErrors();
    // 3초마다 자동 새로고침
    const interval = setInterval(loadErrors, 3000);
    return () => clearInterval(interval);
  }, [page, limit]);

  // 팝업 자동 숨김 (5초 후)
  useEffect(() => {
    if (showErrorPopup) {
      const timer = setTimeout(() => {
        setShowErrorPopup(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showErrorPopup]);

  const handleFilter = () => {
    setPage(1);
    loadErrors();
  };

  const handleReset = () => {
    setErrorType('');
    setResolutionStatus('');
    setStartDate('');
    setEndDate('');
    setPage(1);
    setLimit(20);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getErrorTypeColor = (type: string) => {
    return type === 'CLIENT' ? '#dc3545' : '#ffc107';
  };

  const getErrorCategoryColor = (category: string) => {
    switch (category) {
      case 'NETWORK_ERROR':
        return '#17a2b8';
      case 'RUNTIME_ERROR':
        return '#dc3545';
      case 'SERVER_ERROR':
        return '#ffc107';
      default:
        return '#6c757d';
    }
  };

  const getPageTypeColor = (pageType: string) => {
    return pageType === 'USER' ? '#007bff' : '#28a745';
  };

  return (
    <Container>
      {/* 에러 증가 알림 팝업 */}
      {showErrorPopup && (
        <ErrorPopupOverlay>
          <ErrorPopup>
            <PopupIcon>⚠️</PopupIcon>
            <PopupTitle>새로운 에러 발생!</PopupTitle>
            <PopupMessage>{errorIncrease}개의 새로운 에러가 발생했습니다</PopupMessage>
          </ErrorPopup>
        </ErrorPopupOverlay>
      )}

      <Header>
        <Title>API 에러 모니터링</Title>
        <Subtitle>API 에러 조회 및 분석</Subtitle>
        <FilterToggleButton onClick={() => setShowFilter(!showFilter)}>
          {showFilter ? '필터 숨기기 ▲' : '필터 보기 ▼'}
        </FilterToggleButton>
      </Header>

      {showFilter && (
        <FilterSection>
          <FilterTitle>필터 설정</FilterTitle>
          <FilterGrid>
            <FilterGroup>
              <Label>에러 타입</Label>
              <Select value={errorType} onChange={(e) => setErrorType(e.target.value as any)}>
                <option value="">전체</option>
                <option value="CLIENT">CLIENT</option>
                <option value="SERVER">SERVER</option>
              </Select>
            </FilterGroup>

            <FilterGroup>
              <Label>해결 상태</Label>
              <Select value={resolutionStatus} onChange={(e) => setResolutionStatus(e.target.value as any)}>
                <option value="">전체</option>
                <option value="RESOLVED">해결됨</option>
                <option value="UNRESOLVED">미해결</option>
              </Select>
            </FilterGroup>

            <FilterGroup>
              <Label>시작 날짜</Label>
              <Input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </FilterGroup>

            <FilterGroup>
              <Label>종료 날짜</Label>
              <Input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </FilterGroup>

            <FilterGroup>
              <Label>페이지 크기 (최대 1000)</Label>
              <Select value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
                <option value={10}>10개</option>
                <option value={20}>20개</option>
                <option value={50}>50개</option>
                <option value={100}>100개</option>
                <option value={500}>500개</option>
                <option value={1000}>1000개</option>
              </Select>
            </FilterGroup>
          </FilterGrid>

          <ButtonGroup>
            <Button onClick={handleFilter} disabled={loading}>
              {loading ? '로딩 중...' : '조회'}
            </Button>
            <ResetButton onClick={handleReset}>초기화</ResetButton>
          </ButtonGroup>
        </FilterSection>
      )}

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {data && (
        <>
          <TableContainer>
            <Table>
              <thead>
                <tr>
                  <Th width="60px">ID</Th>
                  <Th width="100px">에러 타입</Th>
                  <Th width="100px">페이지</Th>
                  <Th width="140px">에러 카테고리</Th>
                  <Th width="160px">에러 코드</Th>
                  <Th width="300px">메시지</Th>
                  <Th width="280px">세션 ID</Th>
                  <Th width="180px">발생시간</Th>
                </tr>
              </thead>
              <tbody>
                {data.errors.map((errorItem: ApiError) => (
                  <tr key={errorItem.id}>
                    <Td>{errorItem.id}</Td>
                    <Td>
                      <ErrorTypeBadge color={getErrorTypeColor(errorItem.errorType)}>
                        {errorItem.errorType}
                      </ErrorTypeBadge>
                    </Td>
                    <Td>
                      <PageTypeBadge color={getPageTypeColor(errorItem.pageType)}>
                        {errorItem.pageType}
                      </PageTypeBadge>
                    </Td>
                    <Td>
                      <ErrorCategoryBadge color={getErrorCategoryColor(errorItem.errorCategory)}>
                        {errorItem.errorCategory}
                      </ErrorCategoryBadge>
                    </Td>
                    <Td>
                      <ErrorCodeText>{errorItem.errorCode}</ErrorCodeText>
                    </Td>
                    <Td>
                      <MessageText title={errorItem.message}>
                        {errorItem.message}
                      </MessageText>
                    </Td>
                    <Td>
                      <SessionId>{errorItem.sessionId}</SessionId>
                    </Td>
                    <Td>{formatDate(errorItem.createdAt)}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableContainer>

          <Pagination>
            <PageButton
              onClick={() => setPage(1)}
              disabled={page === 1 || loading}
            >
              처음
            </PageButton>
            <PageButton
              onClick={() => setPage(page - 1)}
              disabled={page === 1 || loading}
            >
              이전
            </PageButton>
            <PageInfo>
              {page} / {data.meta.totalPages}
            </PageInfo>
            <PageButton
              onClick={() => setPage(page + 1)}
              disabled={page >= data.meta.totalPages || loading}
            >
              다음
            </PageButton>
            <PageButton
              onClick={() => setPage(data.meta.totalPages)}
              disabled={page >= data.meta.totalPages || loading}
            >
              마지막
            </PageButton>
          </Pagination>
        </>
      )}
    </Container>
  );
};

const Container = styled.div`
  padding: 40px;
  max-width: 1600px;
  margin: 0 auto;
  background-color: #f5f5f5;
  min-height: 100vh;
`;

const Header = styled.div`
  margin-bottom: 30px;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin: 0 0 8px 0;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0 0 16px 0;
`;

const FilterToggleButton = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0056b3;
  }
`;

const FilterSection = styled.div`
  background-color: white;
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const FilterTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 500;
  color: #555;
`;

const Input = styled.input`
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const Select = styled.select`
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background-color: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const Button = styled.button`
  padding: 12px 24px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const ResetButton = styled(Button)`
  background-color: #6c757d;

  &:hover:not(:disabled) {
    background-color: #5a6268;
  }
`;

const ErrorMessage = styled.div`
  background-color: #f8d7da;
  color: #721c24;
  padding: 16px;
  border-radius: 4px;
  margin-bottom: 20px;
  border: 1px solid #f5c6cb;
`;

const TableContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 1400px;
`;

const Th = styled.th<{ width?: string }>`
  background-color: #f8f9fa;
  padding: 14px 12px;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #dee2e6;
  white-space: nowrap;
  ${({ width }) => width && `width: ${width};`}
`;

const Td = styled.td`
  padding: 14px 12px;
  border-bottom: 1px solid #dee2e6;
  font-size: 13px;
  color: #495057;
`;

const ErrorTypeBadge = styled.span<{ color: string }>`
  display: inline-block;
  padding: 4px 10px;
  background-color: ${({ color }) => color};
  color: white;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  text-align: center;
  min-width: 70px;
`;

const PageTypeBadge = styled.span<{ color: string }>`
  display: inline-block;
  padding: 4px 10px;
  background-color: ${({ color }) => color};
  color: white;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  text-align: center;
  min-width: 80px;
`;

const ErrorCategoryBadge = styled.span<{ color: string }>`
  display: inline-block;
  padding: 4px 10px;
  background-color: ${({ color }) => color};
  color: white;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  text-align: center;
`;

const ErrorCodeText = styled.span`
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 12px;
  color: #333;
  font-weight: 500;
`;

const MessageText = styled.span`
  font-size: 12px;
  color: #495057;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 300px;
`;

const SessionId = styled.span`
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 11px;
  color: #666;
  word-break: break-all;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const PageButton = styled.button`
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const PageInfo = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #333;
  min-width: 80px;
  text-align: center;
`;

// 에러 알림 팝업 스타일
const ErrorPopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  pointer-events: none;
`;

const ErrorPopup = styled.div`
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
  color: white;
  padding: 32px 48px;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  text-align: center;
  min-width: 400px;
  animation: popupSlideIn 0.3s ease-out;
  pointer-events: auto;

  @keyframes popupSlideIn {
    from {
      transform: scale(0.8) translateY(-20px);
      opacity: 0;
    }
    to {
      transform: scale(1) translateY(0);
      opacity: 1;
    }
  }
`;

const PopupIcon = styled.div`
  font-size: 64px;
  margin-bottom: 16px;
  animation: iconBounce 0.5s ease-out;

  @keyframes iconBounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }
`;

const PopupTitle = styled.h2`
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 12px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const PopupMessage = styled.p`
  font-size: 18px;
  font-weight: 500;
  margin: 0;
  opacity: 0.95;
`;
