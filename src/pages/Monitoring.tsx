import styled from "@emotion/styled";
import { Content, DeviceTypeChart, NetworkSpeedBar } from "../components";
import { Flex, Text } from "../design-token";
import { useEffect, useState, useRef } from "react";
import { fetchDashboardData } from "../apis/dashboard";
import type { DashboardData } from "../types/dashboard";

export const Monitoring = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const isLoadingRef = useRef(false);

  useEffect(() => {
    const loadData = async () => {
      if (isLoadingRef.current) return; // 이전 요청이 진행 중이면 중단

      isLoadingRef.current = true;
      try {
        const response = await fetchDashboardData();
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        isLoadingRef.current = false;
      }
    };

    loadData(); // 초기 로드
    const interval = setInterval(loadData, 2000); // 2초마다 업데이트

    return () => clearInterval(interval);
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <Flex
      gap={20}
      isColumn
      paddingLeft="60px"
      paddingRight="60px"
      paddingBottom="60px"
      paddingTop="60px"
    >
      <Flex isColumn gap={4}>
        <Text fontSize={22} color={"#5F5F5F"}>
          EntryDSM Client Monitoring
        </Text>
        <Text fontSize={32} fontWeight={700} color="#000000">
          라이브 서버
        </Text>
      </Flex>
      <Flex gap={20} flexWrap="wrap">
        <CommitContainer>
          <Content
            width="204"
            backColor="#ffffff"
            textColor="#000000"
            title="최근 1시간 서버 요청 오류"
          >
            {data.errors.lastHour.server}건
          </Content>
          <Flex isColumn gap={8} width="100%">
            {data.errors.recentServerErrors.slice(0, 2).map((error) => (
              <CommitContent key={error.id}>{error.endpoint}</CommitContent>
            ))}
          </Flex>
        </CommitContainer>

        {/*<div>접근 기기 종류</div>*/}
        <DeviceTypeChart devices={data.devices} />

        <SideContainer>
          <Content width={"228"} title="실시간 동시접속">
            {data.realtime.concurrent.total}명
          </Content>
          <Content
            width={"228"}
            textColor="#000000"
            backColor="#F7F7F7"
            title="동시접속 기록"
          >
            <Flex alignItems="end" gap={4}>
              <Text fontSize={15} fontWeight={600}>
                Max
              </Text>
              {data.timeline.concurrentMax}
              <Text>Avg</Text>
              {data.timeline.concurrentAvg}
            </Flex>
          </Content>
        </SideContainer>

        <ColumnContainer>
          <Content
            width="204"
            backColor="#ffffff"
            textColor="#000000"
            title="최근 1시간 클라이언트 오류"
          >
            {data.errors.lastHour.client}건
          </Content>
          <Content
            width="204"
            backColor="#ffffff"
            textColor="#000000"
            title="최근 1시간 클라이언트 경고"
          >
            {data.errors.lastHour.clientWarnings}건
          </Content>
        </ColumnContainer>

        <Content width={"228"} title="평균 서버 응답시간">{data.performance.server.avgResponseTime}ms</Content>
        <Content
          width={"228"}
          title="최대 서버 응답시간"
          textColor="#000000"
          backColor="#F7F7F7"
        >
          {data.performance.server.maxResponseTime}ms
        </Content>
        <Content
          width={"476"}
          textColor="#000000"
          backColor="#F7F7F7"
          title="서버 응답 타임아웃"
        >
          <Flex alignItems="end" gap={8}>
            <Text fontSize={15} fontWeight={600}>
              최근 1시간
            </Text>
            {data.serverTimeout.lastHour}회
            <Text>전체</Text>
            {data.serverTimeout.total}회
          </Flex>
        </Content>
        <FlexContainer>
          <FlexContent title="종합">{data.realtime.concurrent.total}명</FlexContent>
          <FlexContent title="인증" textColor="#000000" backColor="#F7F7F7">
            {data.realtime.concurrent.byPageType.AUTH}명
          </FlexContent>
          <FlexContent title="접수" backColor="#FF3737">
            {data.realtime.concurrent.byPageType.ADMISSION}명
          </FlexContent>
          <FlexContent title="유저" textColor="#000000" backColor="#F7F7F7">
            {data.realtime.concurrent.byPageType.USER}명
          </FlexContent>
        </FlexContainer>
        <Content
          width="228"
          textColor="#000000"
          backColor="#F7F7F7"
          title="총 접속자"
        >
          {data.visitorStats.totalSessions}명
        </Content>
        <Content width="476" title="사용자 평균 체류시간">
          {data.submissions.avgDuration}
        </Content>
        <Content width="228" title="클라이언트 DOM 시간">
          {data.performance.client.avgDomLoadTime ?? 0}ms
        </Content>

        <Content
          textColor="#000000"
          backColor="#F7F7F7"
          width={"228"}
          title="서버 API 정상"
        >
          {data.apiStatus.successRequests}건
        </Content>

        <Content width={"228"} title="서버 API 오류">
          {data.apiStatus.errorRequests}건
        </Content>

        <Content width={"476"} title="총 API 요청">
          {data.apiStatus.totalRequests}건
        </Content>

        {/*<div>네트워크 속도</div>*/}
        <NetworkSpeedBar goodPercent={data.network.good / (data.network.good + data.network.poor) * 100 || 0} />

        <Content width={"352"} title="클라이언트 크리티컬 오류">
          {data.errors.lastHour.critical}건
        </Content>
        <Content
          textColor="#000000"
          backColor="#F7F7F7"
          width={"352"}
          title="실시간 원서 접수 중"
        >
          {data.submissions.inProgress}명
        </Content>
        <Content backColor="#31D254" width={"352"} title="원서 접수 성공">
          {data.submissions.success}명
        </Content>
        <Content backColor="#FF3737" width={"352"} title="원서 접수중 실패">
          {data.submissions.failed}명
        </Content>
        <Content
          textColor="#000000"
          backColor="#F7F7F7"
          width={"352"}
          title="원서 접수중 미제출 이탈"
        >
          {data.submissions.abandoned}명
        </Content>
        <Content backColor="#31D254" width={"352"} title="원서 취소 성공">
          {data.cancellations.success}명
        </Content>
        <Content backColor="#FF3737" width={"352"} title="원서 취소 실패">
          {data.cancellations.failed}명
        </Content>
        <Content
          backColor="#FF3737"
          width={"352"}
          title="원서 PDF 다운로드 실패"
        >
          {data.pdf.download.failed}명
        </Content>
      </Flex>
    </Flex>
  );
};

const CommitContainer = styled.div`
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #cccccc;
  display: flex;
  gap: 8px;
  width: 228px;
  height: 200px;
  flex-direction: column;
`;

const ColumnContainer = styled.div`
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #cccccc;
  display: flex;
  gap: 8px;
  width: 228px;
  height: 200px;
  flex-direction: column;
`;

const FlexContainer = styled.div`
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #cccccc;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  width: 476px;
  height: 90px;
`;

const SideContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 200px;
`;

const CommitContent = styled.div`
  width: 100%;
  border-radius: 8px;
  background-color: #f7f7f7;
  font-size: clamp(12px, 1vw, 14px);
  color: #000000;
  display: flex;
  align-items: center;
  padding: clamp(4px, 0.5vh, 6px) clamp(8px, 0.8vw, 10px);
`;

const FlexContent = styled.div<{backColor?: string, textColor?: string, title: string}>`
  flex: 1;
  height: 66px;
  padding: clamp(6px, 0.8vh, 8px) clamp(4px, 0.5vw, 6px);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: clamp(2px, 0.3vh, 4px);
  background-color: ${({backColor}) => backColor || "#FF7E36"};
  color: ${({textColor}) => textColor || "#ffffff"};
  font-size: clamp(10px, 1vw, 12px);

  &::before {
    content: "${({title}) => title}";
    font-weight: 300;
    font-size: clamp(9px, 0.9vw, 11px);
  }

  font-size: clamp(16px, 1.8vw, 20px);
  font-weight: 600;
`;
