import { useState, useEffect } from 'react';
import type { Property } from 'csstype';

interface ITextType {
  children?: React.ReactNode;
  color?: string;
  fontSize?: number;
  fontWeight?: number;
  position?: Property.Position;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  isOverFlow?: boolean;
  width?: string;
  top?: string;
  left?: string;
  bottom?: string;
  right?: string;
  isSpan?: boolean;
  textAlign?: Property.TextAlign;
  isCursor?: boolean;
  isMedia?: boolean; 
}

export const Text = ({
  onClick,
  children,
  fontSize = 16,
  fontWeight = 500,
  color = '#000000',
  position,
  isOverFlow,
  width = 'fit-content',
  top,
  left,
  right,
  bottom,
  textAlign,
  isSpan = false,
  isCursor,
  isMedia = false, 
}: ITextType) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (!isMedia) return;  // isMedia가 false면 미디어 체크 안함

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 656);
    };
    handleResize(); // 최초 실행
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMedia]);

  // isMedia가 true면 화면 크기 따라 fontSize 조절, 아니면 그냥 fontSize 사용
  const adjustedFontSize = isMedia && isMobile ? fontSize * 0.75 : fontSize;

  const style: React.CSSProperties = {
    width,
    color,
    fontSize: adjustedFontSize,
    fontWeight,
    position,
    top,
    left,
    right,
    bottom,
    textOverflow: isOverFlow ? 'ellipsis' : 'clip',
    overflow: isOverFlow ? 'hidden' : undefined,
    whiteSpace: isOverFlow ? 'nowrap' : undefined,
    display: isSpan ? 'inline' : 'block',
    textAlign,
    cursor: isCursor ? 'pointer' : 'auto',
  };

  return (
    <div onClick={onClick} style={style}>
      {children}
    </div>
  );
};
