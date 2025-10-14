import React from "react";
import styled from "@emotion/styled";

interface NetworkSpeedBarProps {
  label?: string;
  goodPercent: number; // 0~100 (%)
}

export const NetworkSpeedBar: React.FC<NetworkSpeedBarProps> = ({
  label = "네트워크 속도",
  goodPercent,
}) => {
  const badPercent = 100 - goodPercent;

  return (
    <Container>
      <Label>{label}</Label>
      <BarWrapper>
        <Bar>
          <GoodSection style={{ width: `${goodPercent}%` }}>좋음</GoodSection>
          <BadSection style={{ width: `${badPercent}%` }}>불안정</BadSection>
        </Bar>
      </BarWrapper>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  padding: 16px 24px;
  background-color: #fff;
  width: 100%;
  max-width: 700px;
`;

const Label = styled.div`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 12px;
`;

const BarWrapper = styled.div`
  width: 100%;
`;

const Bar = styled.div`
  display: flex;
  height: 40px;
  border-radius: 50px;
  overflow: hidden;
`;

const GoodSection = styled.div`
  background-color: #4caf50;
  color: white;
  font-weight: 500;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BadSection = styled.div`
  background-color: #d84315;
  color: white;
  font-weight: 500;
  display: flex;
  justify-content: center;
  align-items: center;
`;
