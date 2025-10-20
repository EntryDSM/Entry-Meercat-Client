import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { Text } from "../design-token";

interface IContentType {
    title: string;
    children: React.ReactNode;
    width?: string;
    height?: string;
    isCenter?: boolean;
    textColor?: string;
    backColor?: string;
    className?: string;
}

const increaseAnimation = keyframes`
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  50% {
    transform: translateY(-10px);
    opacity: 0.7;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
`;

export const Content = ({
                            width = 'auto',
                            height = '100',
                            title,
                            children,
                            isCenter = false,
                            textColor = "#ffffff",
                            backColor = "#FF7E36",
                            className, // className 받기
                        }: IContentType) => {
    const isBlinking = className?.includes('blink');
    const isIncreasing = className?.includes('increase-animation');

    return (
        <Container
            backColor={backColor}
            isCenter={isCenter}
            width={width}
            height={height}
        >
            <Text
                fontSize="clamp(12px, 1.2vw, 16px)"
                fontWeight={300}
                color={textColor}
            >
                {title}
            </Text>
            <AnimatedText
                fontSize="clamp(20px, 2.5vw, 36px)"
                fontWeight={600}
                className={className}
                color={isBlinking ? undefined : textColor}
                isIncreasing={isIncreasing}
            >
                {children}
            </AnimatedText>
        </Container>
    );
};

const Container = styled.div<{
    backColor: string;
    width: string;
    height: string;
    isCenter: boolean;
}>`
    width: ${({ width }) => (width === 'auto' ? 'auto' : `${width}px`)};
    height: ${({ height }) => (height === 'auto' ? 'auto' : `${height}px`)};
    padding: clamp(8px, 1vh, 12px) clamp(10px, 1vw, 14px);
    border-radius: 12px;
    display: flex;
    justify-content: ${({ isCenter }) => (isCenter ? 'center' : 'flex-start')};
    flex-direction: column;
    gap: clamp(4px, 0.5vh, 6px);
    background-color: ${({ backColor }) => backColor};
`;

const AnimatedText = styled(Text)<{ isIncreasing?: boolean }>`
    ${({ isIncreasing }) =>
        isIncreasing &&
        `
        animation: ${increaseAnimation} 0.5s ease-out;
    `}
`;
