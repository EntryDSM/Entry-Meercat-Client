import styled from "@emotion/styled";
import { ResponsivePie } from "@nivo/pie";

interface IDeviceTypeChartType {
  devices: {
    [key: string]: {
      count: number;
      percentage: number;
    };
  };
}

const deviceColors: { [key: string]: string } = {
  Android: "#f04c3e",
  Windows: "#9bd1ff",
  iOS: "#f0c23e",
};

export const DeviceTypeChart = ({ devices }: IDeviceTypeChartType) => {
  const data = Object.entries(devices).map(([key, value]) => ({
    id: key,
    label: key,
    value: value.count,
    color: deviceColors[key] || "#cccccc",
  }));

  return (
    <Container>
      <Title>접근 기기 종류</Title>
      <Content>
        <ChartWrapper>
          <ResponsivePie
            data={data}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            innerRadius={0.5}
            padAngle={1.5}
            cornerRadius={3}
            colors={(d) => d.data.color}
            enableArcLabels={false}
            enableArcLinkLabels={false}
          />
        </ChartWrapper>

        <LegendWrapper>
          {data.map((item) => (
            <LegendItem key={item.id}>
              <LegendColor style={{ backgroundColor: item.color }} />
              <LegendText>
                <strong>{item.label}</strong> {item.value}명 (
                {devices[item.id].percentage}%)
              </LegendText>
            </LegendItem>
          ))}
        </LegendWrapper>
      </Content>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 476px;
  height: 200px;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  padding: 12px 16px;
  background-color: #fff;
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 12px;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

const ChartWrapper = styled.div`
  flex: 1;
  height: 150px;
`;

const LegendWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LegendColor = styled.div`
  width: 14px;
  height: 14px;
  border-radius: 3px;
`;

const LegendText = styled.div`
  font-size: 14px;
`;
