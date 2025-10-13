import styled from "@emotion/styled"
import { Content } from "../components"
import { Flex, Text } from "../design-token"

export const Monitoring = () => {
  return (
    <Flex gap={20} isColumn paddingLeft="60px" paddingRight="60px" paddingBottom="60px" paddingTop="60px">
      <Flex isColumn gap={4}>
        <Text fontSize={22} color={'#5F5F5F'}>EntryDSM Client Monitoring</Text>
        <Text fontSize={32} fontWeight={700} color="#000000">라이브 서버 </Text>
      </Flex>
      <Flex gap={20} flexWrap="wrap" >
        <CommitContainer>
          <Content width="400" backColor="#ffffff" textColor="#000000" title="최근 1시간 서버 요청 오류">0건
          </Content>
            <Flex isColumn gap={10} width="100%">
              <CommitContent>/api/v1/1000000/123</CommitContent>
              <CommitContent>/api/v1/1000000/123</CommitContent>
            </Flex>
        </CommitContainer>
        <Content width={'195'} title="실시간 동시접속">160명</Content>
        <Content width={'195'}  textColor="#000000" backColor="#F7F7F7" title="동시접속 기록">
          <Flex alignItems="end" gap={4}>
            <Text fontSize={15} fontWeight={600}>Max</Text>
              160
              <Text>Avg</Text>
              24
            </Flex>
        </Content>
        <div>그래프</div>
        <Content title="평균 서버 응답시간">920ms</Content>
        <Content title="최대 서버 응답시간"  textColor="#000000" backColor="#F7F7F7">1402ms</Content>
        <Content width={'412'}  textColor="#000000" backColor="#F7F7F7" title="서버 응답 타임아웃">
          <Flex alignItems="end" gap={8}>
            <Text fontSize={15} fontWeight={600}>최근 1시간</Text>
              2회
            <Text>전체</Text>
              10회
            </Flex>
        </Content>
        <FlexContainer>
          <Content title="종합">160명</Content>
          <Content title="인증" textColor="#000000" backColor="#F7F7F7">160명</Content>
          <Content title="접수" backColor="#FF3737">160명</Content>
          <Content title="유저"  textColor="#000000" backColor="#F7F7F7">160명</Content>
        </FlexContainer>
        <Content width="195" textColor="#000000" backColor="#F7F7F7" title="총 접속자">1,250명</Content>
        <Content width="412" title="사용자 평균 체류시간">0시간 2분 2초</Content>
        <Content width="195" title="클라이언트 DOM 시간">402ms</Content>
        <ColumnContainer>
          <Content width="409" backColor="#ffffff" textColor="#000000" title="최근 1시간 클라이언트 오류">0건</Content>
          <Content width="409" backColor="#ffffff" textColor="#000000" title="최근 1시간 클라이언트 경고">0건</Content>
        </ColumnContainer>
        <div>접근 기기 종류</div>
        <Content textColor="#000000" backColor="#F7F7F7"  width={'195'} title="서버 API 정상">160명</Content>
        <Content width={'195'} title="서버 API 오류">160명</Content>
        <Content width={'409'} title="총 API 요청">160명</Content>
        <div>네트워크 속도</div>
        <Content width={'195'} title="클라이언트 크리티컬 오류">0건</Content>
        <Content textColor="#000000" backColor="#F7F7F7"  width={'195'} title="실시간 원서 접수 중">160명</Content>
        <Content backColor="#31D254"  width={'195'} title="원서 접수 성공">160명</Content>
        <Content backColor="#FF3737"  width={'195'} title="원서 접수중 실패">160명</Content>
        <Content textColor="#000000" backColor="#F7F7F7"  width={'195'} title="원서 접수중 미제출 이탈">160명</Content>
        <Content backColor="#31D254"  width={'195'} title="원서 취소 성공">160명</Content>
        <Content backColor="#FF3737"  width={'195'} title="원서 취소 실패">160명</Content>
        <Content backColor="#FF3737"  width={'195'} title="원서 PDF 다운로드 실패">160명</Content>
      </Flex>
    </Flex>
  )
}

const CommitContainer = styled.div`
  padding: 16px;
  border-radius: 16px;
  border: 1px solid #cccccc;
  display: flex;
  gap: 10px;
  width: 420px;
  flex-direction: column;
`

const ColumnContainer = styled.div`
  padding: 16px;
  border-radius: 16px;
  border: 1px solid #cccccc;
  display: flex;
  gap: 10px;
  flex-direction: column;
`

const FlexContainer = styled.div `
  padding: 16px;
  border-radius: 16px;
  border: 1px solid #cccccc;
  display: flex;
  gap: 10px;
`

const CommitContent = styled.div`
  width: 380px;
  border-radius: 12px;
  background-color: #F7F7F7;
  font-size: 16px;
  color: #000000;
  display: flex;
  align-items: center;
  padding: 8px 14px;
`