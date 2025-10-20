import styled from '@emotion/styled';

interface ErrorNotificationProps {
  errorIncrease: number;
  onClose: () => void;
}

export const ErrorNotification = ({ errorIncrease, onClose }: ErrorNotificationProps) => {
  return (
    <ErrorPopupOverlay onClick={onClose}>
      <ErrorPopup onClick={(e) => e.stopPropagation()}>
        <PopupIcon>⚠️</PopupIcon>
        <PopupTitle>새로운 에러 발생!</PopupTitle>
        <PopupMessage>{errorIncrease}개의 새로운 에러가 발생했습니다</PopupMessage>
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
  padding: 32px 48px;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  text-align: center;
  min-width: 400px;
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
