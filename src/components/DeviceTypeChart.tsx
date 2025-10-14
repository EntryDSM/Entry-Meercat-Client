import styled from "@emotion/styled";
import { ResponsivePie } from "@nivo/pie";

export const DeviceTypeChart = () => {
    const data = [
        { id: "Android", label: "Android", value: 240, color: "#f04c3e" },
        { id: "Windows", label: "Windows", value: 240, color: "#9bd1ff" },
        { id: "iOS", label: "iOS", value: 240, color: "#f0c23e" },
    ];

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
                                <strong>{item.label}</strong> {item.value}명 (80%)
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
    width: 100%;
    max-width: 700px;
    border: 1px solid #e5e5e5;
    border-radius: 12px;
    padding: 16px 24px;
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
  height: 220px;
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

