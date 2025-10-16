import { ResponsiveLine } from "@nivo/line";
import styled from "@emotion/styled";

export type TimelineType = {
  concurrentMax: number;
  concurrentAvg: number;
  data: Array<{
    time: string;
    count: number;
  }>;
};

interface IConcurrentUsersCountType {
  timeline: TimelineType;
}

export const ConcurrentUsersCount = ({
  timeline,
}: IConcurrentUsersCountType) => {
  const { concurrentMax, concurrentAvg, data } = timeline;

  const chartData = [
    {
      id: "동시 접속자 수",
      color: "#2563EB",
      data: data.map((item) => ({
        x: item.time,
        y: item.count,
      })),
    },
  ];

  // x축 레이블을 간결하게 표시
  const formatXAxis = (value: string) => {
    // "HH:MM:SS" 형식에서 "HH:MM"만 추출
    if (value.includes(":")) {
      const parts = value.split(":");
      return `${parts[0]}:${parts[1]}`;
    }
    return value;
  };

  // x축에 표시할 틱을 간격을 두고 선택
  const getXAxisValues = () => {
    if (data.length <= 10) return undefined; // 데이터가 적으면 모두 표시

    // 데이터 포인트가 많을 때는 일정 간격으로만 표시
    const interval = Math.ceil(data.length / 8);
    return data
      .filter((_, index) => index % interval === 0)
      .map((item) => item.time);
  };

  return (
    <Container>
      <ChartArea>
        <ResponsiveLine
          data={chartData}
          margin={{ top: 10, right: 20, bottom: 40, left: 50 }}
          xScale={{ type: "point" }}
          yScale={{ type: "linear", min: 0, max: "auto" }}
          curve="monotoneX"
          axisBottom={{
            legend: "시간",
            legendOffset: 32,
            legendPosition: "end",
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -45,
            format: formatXAxis,
            tickValues: getXAxisValues(),
          }}
          axisLeft={{
            legend: "접속자 수",
            legendOffset: -40,
            legendPosition: "middle",
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
          }}
          colors={["#2563EB"]}
          pointSize={6}
          pointColor={{ theme: "background" }}
          pointBorderWidth={2}
          pointBorderColor={{ from: "serieColor" }}
          enableArea={true}
          areaOpacity={0.2}
          useMesh={true}
          crosshairType="cross"
          enableSlices={false}
          tooltip={({ point }) => (
            <ChartModal>
              <div>시간: {point.data.x}</div>
              <div>접속자 수: {point.data.y}명</div>
            </ChartModal>
          )}
          theme={{
            tooltip: {
              container: {
                fontSize: 12,
                padding: 4,
              },
            },
            axis: {
              ticks: {
                text: { fontSize: 11 },
              },
              legend: { text: { fontSize: 12, fontWeight: 500 } },
            },
            grid: {
              line: {
                stroke: "#e0e0e0",
                strokeWidth: 1,
              },
            },
            crosshair: {
              line: {
                stroke: "#2563EB",
                strokeWidth: 1,
                strokeDasharray: "3 3",
              },
            },
            labels: {
              text: {
                fontSize: 0,
              },
            },
          }}
        />
      </ChartArea>

      <LegendSection>
        <LegendItem>
          <LegendDot color="#2563EB" />
          <LegendLabel>최대 동시접속: {concurrentMax}명</LegendLabel>
        </LegendItem>
        <LegendItem>
          <LegendDot color="#60A5FA" />
          <LegendLabel>평균 동시접속: {concurrentAvg}명</LegendLabel>
        </LegendItem>
      </LegendSection>
    </Container>
  );
};

const ChartModal = styled.div`
  min-width: 120px;
  width: fit-content;
  max-width: 200px;
  padding: 8px 12px;
  font-size: 12px;
  background: #fff;
  color: #111;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  white-space: nowrap;

  > div {
    line-height: 1.4;
  }

  > div:not(:last-child) {
    margin-bottom: 4px;
  }
`;

const Container = styled.div`
  width: 476px;
  height: 200px;
  border-radius: 14px;
  background: #ffffff;
  border: 1px solid #ececec;
  padding: 16px 20px 12px 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ChartArea = styled.div`
  height: 150px;
  width: 100%;
`;

const LegendSection = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 6px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const LegendDot = styled.div<{ color: string }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${({ color }) => color};
`;

const LegendLabel = styled.div`
  font-size: 13px;
  color: #333;
`;
