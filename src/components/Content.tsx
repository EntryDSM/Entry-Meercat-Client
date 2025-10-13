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
      <Text fontSize={16} fontWeight={300} color={textColor}>{title}</Text>
      <Text fontSize={36} fontWeight={600} color={textColor}>{children}</Text>
    </Container>
  )
}

const Container = styled.div<{backColor: string, width: string, isCenter: boolean}>`
  width: ${({width}) => width}px;
  padding: 24px 18px;
  border-radius: 16px;
  display: flex;
  justify-content: ${({isCenter}) => isCenter ? 'center' : 'flex-start'};
  flex-direction: column;
  gap: 10px;
  display: flex;
  background-color: ${({backColor}) => backColor};

`