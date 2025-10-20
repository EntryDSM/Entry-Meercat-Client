import styled from "@emotion/styled";
import { keyframes, css } from "@emotion/react";
import {
  ConcurrentUsersCount,
  Content,
  DeviceTypeChart,
  NetworkSpeedBar,
} from "../components";
import { Flex, Text } from "../design-token";
import { useEffect, useState, useRef } from "react";
import { fetchDashboardData } from "../apis/dashboard";
import type { DashboardData } from "../types/dashboard";

export const Monitoring = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const isLoadingRef = useRef(false);
  const prevDataRef = useRef<DashboardData | null>(null);
  const [apiRequestIncreased, setApiRequestIncreased] = useState(false);
  const [displayedApiCount, setDisplayedApiCount] = useState<number>(0);

  // 에러 경고음 재생 함수 (높은 음)
  const playBeep = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const beepCount = 3;
    let currentBeep = 0;

    const playOnce = () => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);

      currentBeep++;
      if (currentBeep < beepCount) {
        setTimeout(playOnce, 200);
      }
    };

    playOnce();
  };

  // API 요청 증가 알림음 재생 함수 (짧은 삐 소리)
  const playLowBeep = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 600; // 중간 톤의 삐 소리
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.05);
  };

  useEffect(() => {
    const loadData = async () => {
      if (isLoadingRef.current) return;

      isLoadingRef.current = true;
      try {
        const response = await fetchDashboardData();
        const newData = response.data;

        // 이전 데이터와 비교
        if (prevDataRef.current) {
          // API 요청 수 증가 체크
          const requestDiff = newData.apiStatus.totalRequests - prevDataRef.current.apiStatus.totalRequests;
          if (requestDiff > 0) {
            setApiRequestIncreased(true);
            setTimeout(() => setApiRequestIncreased(false), 500);

            // 증가한 횟수만큼 소리 재생 + 숫자 애니메이션
            const startCount = prevDataRef.current.apiStatus.totalRequests;
            for (let i = 0; i < requestDiff; i++) {
              setTimeout(() => {
                playLowBeep();
                setDisplayedApiCount(startCount + i + 1);
              }, i * 100); // 100ms 간격으로 재생
            }
          } else {
            // 증가가 없으면 바로 표시
            setDisplayedApiCount(newData.apiStatus.totalRequests);
          }

          // 서버 에러 증가 체크 (삐 소리)
          if (newData.errors.lastHour.server > prevDataRef.current.errors.lastHour.server) {
            console.log('🔊 경고음 발생:', {
              이전: prevDataRef.current.errors.lastHour.server,
              현재: newData.errors.lastHour.server
            });
            playBeep();
          }
        } else {
          // 첫 로드 시
          setDisplayedApiCount(newData.apiStatus.totalRequests);
        }

        prevDataRef.current = newData;
        setData(newData);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        isLoadingRef.current = false;
      }
    };

    loadData();
    const interval = setInterval(loadData, 2000);

    return () => clearInterval(interval);
  }, []);

  if (!data) {
    return <LoadingContainer>Loading...</LoadingContainer>;
  }

  return (
    <ResponsiveContainer>
      <HeaderSection>
        <Text fontSize={16} color={"#5F5F5F"}>
          EntryDSM Meercat Monitoring
        </Text>
        <Text fontSize={32} fontWeight={700} color="#000000">
          실시간 모니터링
        </Text>
      </HeaderSection>

      <GridContainer>
        <Flex gap={12}>
        <Content width={"228"} title="실시간 사이트 접속자">
          {data.realtime.concurrent.total}명
        </Content>
        <Content
          width={"228"}
          title="접속자 통계"
          textColor="#000000"
          backColor="#F7F7F7"
        >
            <Flex alignItems="end" gap={4}>
                <Text fontSize={15} fontWeight={600}>
                    최대
                </Text>
                {data.timeline.concurrentMax}
                <Text>평균</Text>
                {data.timeline.concurrentAvg}
            </Flex>
        </Content>

        <Content
          textColor="#000000"
          backColor="#F7F7F7"
          width={"228"}
          title="최근 서버 API OK"
        >
          {data.apiStatus.successRequests}건
        </Content>

        <Content
          width={"228"}
          textColor={data.errors.lastHour.server >= 1 ? "red" : "#000000"}
          backColor="#F7F7F7"
          title="최근 서버 API 에러"
          className={data.errors.lastHour.server >= 1 ? "blink" : ""}
        >
            {data.errors.lastHour.server}건
        </Content>

        <Content width={"476"} title="총 API 요청" className={apiRequestIncreased ? "increase-animation" : ""}>
          {displayedApiCount}건
        </Content>
        </Flex>
        <Flex gap={12}>

        <Content
          width="228"
          textColor="#000000"
          backColor="#F7F7F7"
          title="총 접속자"
        >
          {data.visitorStats.totalSessions}명
        </Content>
        <Content width="476" title="사용자 평균 체류시간">
          {data.visitorStats.avgStayTime}
        </Content>
            <Content
                width="228"
                textColor="#000000"
                backColor="#F7F7F7"
                title="클라이언트 로드 시간"
            >
                {((data.performance.client.avgDomLoadTime ?? 0) / 1000).toFixed(2)}초
            </Content>

            <NetworkSpeedBar
          goodPercent={
            (data.network.good / (data.network.good + data.network.poor)) *
              100 || 0
          }
        />

        <Content width={"352"} title="클라이언트 크리티컬 오류">
          {data.errors.lastHour.critical}건
        </Content>
        </Flex>

        <Flex gap={12}>
        <CommitContainer>
          <Content
            width="204"
            backColor="#ffffff"
            textColor={data.errors.lastHour.server >= 1 ? "red" : "#000000"}
            title="최근 1시간 서버 요청 오류"
            className={data.errors.lastHour.server >= 1 ? "blink" : ""}
          >
            {data.errors.lastHour.server}건
          </Content>
          <Flex isColumn gap={8} width="100%">
            {data.errors.recentServerErrors.slice(0, 2).map((error) => (
              <CommitContent key={error.id}>{error.endpoint}</CommitContent>
            ))}
          </Flex>
        </CommitContainer>

        <DeviceTypeChart devices={data.devices} />

        <SideContainer>
            <Content
                width="228"
                height="85"
                textColor={((data.performance.server.avgResponseTime ?? 0) / 1000) >= 2 ? "red" : "#000000"}
                backColor="#F7F7F7"
                title="서버 평균 응답시간"
                className={((data.performance.server.avgResponseTime ?? 0) / 1000) >= 2 ? "blink" : ""}
            >
                {((data.performance.server.avgResponseTime ?? 0) / 1000).toFixed(2)}초
            </Content>



            <Content
                width="228"
                height="85"
                textColor="#000000"
                backColor="#F7F7F7"
                title="최대 서버 응답시간"
            >
                {((data.performance.server.maxResponseTime ?? 0) / 1000).toFixed(2)}초
            </Content>

        </SideContainer>
        <ConcurrentUsersCount timeline={data.timeline} />
        </Flex>

        <Flex gap={12}>

        <Flex isColumn gap={2}>

        <FlexContainer>
          <FlexContent title="종합">
            {data.realtime.concurrent.total}명
          </FlexContent>
          <FlexContent
            title="인증"
            backColor={
              data.realtime.concurrent.byPageType.AUTH > 0
                ? "#FF3737"
                : "#F7F7F7"
            }
            textColor={
              data.realtime.concurrent.byPageType.AUTH > 0
                ? "#ffffff"
                : "#000000"
            }
            isBlinking={data.realtime.concurrent.byPageType.AUTH > 0}
          >
            {data.realtime.concurrent.byPageType.AUTH}명
          </FlexContent>
          <FlexContent
            title="접수"
            backColor={
              data.realtime.concurrent.byPageType.ADMISSION > 0
                ? "#FF3737"
                : "#F7F7F7"
            }
            textColor={
              data.realtime.concurrent.byPageType.ADMISSION > 0
                ? "#ffffff"
                : "#000000"
            }
            isBlinking={data.realtime.concurrent.byPageType.ADMISSION > 0}
          >
            {data.realtime.concurrent.byPageType.ADMISSION}명
          </FlexContent>
          <FlexContent
            title="유저"
            backColor={
              data.realtime.concurrent.byPageType.USER > 0
                ? "#FF3737"
                : "#F7F7F7"
            }
            textColor={
              data.realtime.concurrent.byPageType.USER > 0
                ? "#ffffff"
                : "#000000"
            }
            isBlinking={data.realtime.concurrent.byPageType.USER > 0}
          >
            {data.realtime.concurrent.byPageType.USER}명
          </FlexContent>
        </FlexContainer>
        </Flex>
        <Content width={"352"}  textColor="#000000"
                 backColor="#F7F7F7" title="세션 수">
          {data.visitorStats.totalSessions}명
        </Content>
        <Content
          width={"352"}
          textColor="#000000"
          backColor="#F7F7F7"
          title="PDF 다운로드 성공"
        >
          {data.pdf.download.success}번
        </Content>
        <Content
          width={"352"}
          title="PDF 다운로드 실패"
          textColor={data.pdf.download.failed >= 1 ? "red" : "#000000"}
          backColor="#F7F7F7"
          className={data.pdf.download.failed >= 1 ? "blink" : ""}
        >
          {data.pdf.download.failed}번
        </Content>
        <Content
          width={"352"}
          textColor="#000000"
          backColor="#F7F7F7"
          title="PDF 미리보기 성공"
        >
          {data.pdf.preview.success}번
        </Content>
        <Content
          width={"352"}
          title="PDF 미리보기 실패"
          textColor={data.pdf.preview.failed >= 1 ? "red" : "#000000"}
          backColor="#F7F7F7"
          className={data.pdf.preview.failed >= 1 ? "blink" : ""}
        >
          {data.pdf.preview.failed}번
        </Content>
        </Flex>


      </GridContainer>
    </ResponsiveContainer>
  );
};

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-size: 18px;
  color: #5f5f5f;
`;

const ResponsiveContainer = styled.div`
  padding: 60px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (max-width: 1200px) {
    padding: 40px;
  }

  @media (max-width: 768px) {
    padding: 20px;
  }

  @media (max-width: 480px) {
    padding: 16px;
  }
`;

const HeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  @media (max-width: 768px) {
    h1 {
      font-size: 24px !important;
    }

    p {
      font-size: 16px !important;
    }
  }
`;

const GridContainer = styled.div`
  display: flex;
  flex-direction: column;
  /* flex-wrap: wrap; */
  gap: 20px;
  width: 100%;

  @media (max-width: 768px) {
    gap: 16px;
  }

  > * {
    flex: 0 0 auto;
  }
`;

const CommitContainer = styled.div`
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #cccccc;
  display: flex;
  gap: 8px;
  width: 228px;
  min-height: 200px;
  flex-direction: column;

  @media (max-width: 768px) {
    width: 100%;
    min-height: auto;
  }
`;

const ColumnContainer = styled.div`
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #cccccc;
  display: flex;
  gap: 8px;
  width: 228px;
  min-height: 100px;
  flex-direction: column;

  @media (max-width: 768px) {
    width: 100%;
    min-height: auto;
  }
`;

const FlexContainer = styled.div`
  padding: 6px;
  border-radius: 12px;
  height: 100px;
  border: 1px solid #cccccc;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  min-height: 110px;
  grid-column: span 2;

  @media (max-width: 768px) {
    grid-column: span 1;
    flex-wrap: wrap;
  }
`;

const SideContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: 200px;

  @media (max-width: 768px) {
    min-height: auto;
    gap: 16px;
  }
`;

const CommitContent = styled.div`
  width: 100%;
  border-radius: 2px;
  font-size: clamp(12px, 1vw, 14px);
  color: red;
  font-weight: bold;
  display: flex;
  align-items: center;
  padding: clamp(4px, 0.5vh, 6px) clamp(8px, 0.8vw, 10px);
`;

const blink = keyframes`
  50% {
    opacity: 0.2;
  }
`;

const FlexContent = styled.div<{
  backColor?: string;
  textColor?: string;
  title: string;
  isBlinking?: boolean;
}>`
  flex: 1;
  min-width: 80px;
  height: 66px;
  padding: clamp(6px, 0.8vh, 8px) clamp(4px, 0.5vw, 6px);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: clamp(2px, 0.3vh, 4px);
  background-color: ${({ backColor }) => backColor || "#FF7E36"};
  color: ${({ textColor }) => textColor || "#ffffff"};
  font-size: clamp(10px, 1vw, 12px);
  animation: ${({ isBlinking }) =>
    isBlinking &&
    css`
      ${blink} 1s infinite
    `};

  &::before {
    content: "${({ title }) => title}";
    font-weight: 300;
    font-size: clamp(9px, 0.9vw, 11px);
  }

  font-size: clamp(16px, 1.8vw, 20px);
  font-weight: 600;

  @media (max-width: 768px) {
    min-width: calc(50% - 4px);
  }
`;
