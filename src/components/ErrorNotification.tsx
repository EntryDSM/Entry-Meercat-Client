import styled from '@emotion/styled';
import type { ServerError } from '../hooks/useErrorMonitoring';

interface ErrorNotificationProps {
  errors: ServerError[];
  onClose: () => void;
}

export const ErrorNotification = ({ errors, onClose }: ErrorNotificationProps) => {
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

  const getErrorTypeColor = (type?: string) => {
    if (!type) return '#6c757d';
    return type === 'CLIENT' ? '#dc3545' : '#ffc107';
  };

  const getErrorCategoryColor = (category?: string) => {
    if (!category) return '#6c757d';
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

  return (
    <ErrorPopupOverlay onClick={onClose}>
      <ErrorPopup onClick={(e) => e.stopPropagation()}>
        <PopupTitle>새로운 에러 발생! ({errors.length}개)</PopupTitle>
        <ErrorList>
          {errors.map((error) => (
            <ErrorItem key={error.id}>
              <ErrorHeader>
                <ErrorEndpoint>{error.endpoint}</ErrorEndpoint>
                <BadgeContainer>
                  {error.errorType && (
                    <Badge color={getErrorTypeColor(error.errorType)}>
                      {error.errorType}
                    </Badge>
                  )}
                  {error.errorCategory && (
                    <Badge color={getErrorCategoryColor(error.errorCategory)}>
                      {error.errorCategory}
                    </Badge>
                  )}
                </BadgeContainer>
              </ErrorHeader>
              {error.errorCode && (
                <ErrorCode>ERROR CODE: {error.errorCode}</ErrorCode>
              )}
              <ErrorMessage>{error.message}</ErrorMessage>
              <ErrorTime>{formatDate(error.createdAt)}</ErrorTime>
            </ErrorItem>
          ))}
        </ErrorList>
      </ErrorPopup>
    </ErrorPopupOverlay>
  );
};

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
  background-color: rgba(0, 0, 0, 0.3);
`;

const ErrorPopup = styled.div`
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
  color: white;
  padding: 24px 32px;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  min-width: 500px;
  max-width: 700px;
  max-height: 80vh;
  overflow-y: auto;
  animation: popupSlideIn 0.3s ease-out;

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

const PopupTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 20px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  text-align: center;
`;

const ErrorList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ErrorItem = styled.div`
  background: rgba(255, 255, 255, 0.15);
  padding: 16px;
  border-radius: 8px;
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ErrorHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 4px;
`;

const ErrorEndpoint = styled.div`
  font-size: 16px;
  font-weight: 600;
  font-family: 'Consolas', 'Monaco', monospace;
  flex: 1;
`;

const BadgeContainer = styled.div`
  display: flex;
  gap: 6px;
  flex-shrink: 0;
`;

const Badge = styled.span<{ color: string }>`
  display: inline-block;
  padding: 4px 8px;
  background-color: ${({ color }) => color};
  color: white;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
  text-align: center;
  white-space: nowrap;
`;

const ErrorCode = styled.div`
  font-size: 13px;
  font-weight: 600;
  font-family: 'Consolas', 'Monaco', monospace;
  opacity: 0.95;
`;

const ErrorMessage = styled.div`
  font-size: 13px;
  opacity: 0.85;
  line-height: 1.4;
`;

const ErrorTime = styled.div`
  font-size: 12px;
  opacity: 0.75;
  margin-top: 4px;
`;
