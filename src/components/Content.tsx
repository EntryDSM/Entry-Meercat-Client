import styled from "@emotion/styled"
import { Text } from "../design-token"

interface IContentType {
  title : string,
  children: React.ReactNode,
  width?: string
  isCenter?: boolean
  textColor?: string,
  backColor?: string
}

export const Content = ({width = 'auto', title, children, isCenter = false, textColor = "#ffffff", backColor="#FF7E36"}: IContentType) => {
  return (
    <Container backColor={backColor} isCenter={isCenter} width={width}>
      <Text fontSize="clamp(12px, 1.2vw, 16px)" fontWeight={300} color={textColor}>{title}</Text>
      <Text fontSize="clamp(20px, 2.5vw, 36px)" fontWeight={600} color={textColor}>{children}</Text>
    </Container>
  )
}

const Container = styled.div<{backColor: string, width: string, isCenter: boolean}>`
  width: ${({width}) => width === 'auto' ? 'auto' : `${width}px`};
  height: 90px;
  padding: clamp(8px, 1vh, 12px) clamp(10px, 1vw, 14px);
  border-radius: 12px;
  display: flex;
  justify-content: ${({isCenter}) => isCenter ? 'center' : 'flex-start'};
  flex-direction: column;
  gap: clamp(4px, 0.5vh, 6px);
  background-color: ${({backColor}) => backColor};

`