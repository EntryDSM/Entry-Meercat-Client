import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { fetchApiLogs } from '../apis/apiLogs';
import type { ApiLog, ApiLogsData } from '../types/apiLogs';

export const ApiLogs = () => {
  const [data, setData] = useState<ApiLogsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 필터 상태
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [sessionId, setSessionId] = useState('');
  const [endpoint, setEndpoint] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const loadLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchApiLogs({
        page,
        limit,
        sessionId: sessionId || undefined,
        endpoint: endpoint || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
      setData(response.data);
    } catch (err) {
      setError('로그 데이터를 불러오는데 실패했습니다.');
      console.error('Failed to fetch API logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [page, limit]);

  const handleFilter = () => {
    setPage(1);
    loadLogs();
  };

  const handleReset = () => {
    setSessionId('');
    setEndpoint('');
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

  const getStatusColor = (statusCode: number) => {
    if (statusCode >= 200 && statusCode < 300) return '#28a745';
    if (statusCode >= 300 && statusCode < 400) return '#17a2b8';
    if (statusCode >= 400 && statusCode < 500) return '#ffc107';
    return '#dc3545';
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET':
        return '#007bff';
      case 'POST':
        return '#28a745';
      case 'PUT':
        return '#ffc107';
      case 'DELETE':
        return '#dc3545';
      case 'PATCH':
        return '#17a2b8';
      default:
        return '#6c757d';
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <Container>
      <Header>
        <Title>API 로그 모니터링</Title>
        <Subtitle>API 요청 로그 조회 및 분석</Subtitle>
      </Header>

      <FilterSection>
        <FilterTitle>필터 설정</FilterTitle>
        <FilterGrid>
          <FilterGroup>
            <Label>세션 ID</Label>
            <Input
              type="text"
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              placeholder="세션 ID를 입력하세요"
            />
          </FilterGroup>

          <FilterGroup>
            <Label>엔드포인트</Label>
            <Input
              type="text"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              placeholder="예: /schedule/all"
            />
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
            <Label>페이지 크기</Label>
            <Select value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
              <option value={10}>10개</option>
              <option value={20}>20개</option>
              <option value={50}>50개</option>
              <option value={100}>100개</option>
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

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {data && (
        <>
          <StatsSection>
            <StatBox>
              <StatLabel>전체 로그</StatLabel>
              <StatValue>{data.meta.totalItems.toLocaleString()}건</StatValue>
            </StatBox>
            <StatBox>
              <StatLabel>현재 페이지</StatLabel>
              <StatValue>
                {data.meta.currentPage} / {data.meta.totalPages}
              </StatValue>
            </StatBox>
            <StatBox>
              <StatLabel>표시 개수</StatLabel>
              <StatValue>{data.logs.length}건</StatValue>
            </StatBox>
          </StatsSection>

          <TableContainer>
            <Table>
              <thead>
                <tr>
                  <Th width="60px">ID</Th>
                  <Th width="80px">메소드</Th>
                  <Th width="200px">엔드포인트</Th>
                  <Th width="70px">상태</Th>
                  <Th width="100px">응답시간</Th>
                  <Th width="100px">요청크기</Th>
                  <Th width="100px">응답크기</Th>
                  <Th width="280px">세션 ID</Th>
                  <Th width="180px">요청시간</Th>
                </tr>
              </thead>
              <tbody>
                {data.logs.map((log: ApiLog) => (
                  <tr key={log.id}>
                    <Td>{log.id}</Td>
                    <Td>
                      <MethodBadge color={getMethodColor(log.method)}>
                        {log.method}
                      </MethodBadge>
                    </Td>
                    <Td>
                      <EndpointText>{log.endpoint}</EndpointText>
                    </Td>
                    <Td>
                      <StatusBadge color={getStatusColor(log.statusCode)}>
                        {log.statusCode}
                      </StatusBadge>
                    </Td>
                    <Td>
                      <ResponseTime slow={log.responseTime > 1000}>
                        {log.responseTime}ms
                      </ResponseTime>
                    </Td>
                    <Td>{formatBytes(log.requestSize)}</Td>
                    <Td>{formatBytes(log.responseSize)}</Td>
                    <Td>
                      <SessionId>{log.sessionId}</SessionId>
                    </Td>
                    <Td>{formatDate(log.createdAt)}</Td>
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
  margin: 0;
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

const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
`;

const StatBox = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const StatLabel = styled.div`
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #333;
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
  min-width: 1200px;
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

const MethodBadge = styled.span<{ color: string }>`
  display: inline-block;
  padding: 4px 10px;
  background-color: ${({ color }) => color};
  color: white;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  text-align: center;
  min-width: 60px;
`;

const StatusBadge = styled.span<{ color: string }>`
  display: inline-block;
  padding: 4px 10px;
  background-color: ${({ color }) => color};
  color: white;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
`;

const EndpointText = styled.span`
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 12px;
  color: #333;
`;

const ResponseTime = styled.span<{ slow?: boolean }>`
  font-weight: 500;
  color: ${({ slow }) => (slow ? '#dc3545' : '#28a745')};
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
