import React from 'react';
import { Box, Typography, Card, CardContent, Divider, Container } from '@mui/material';
import { Description } from '@mui/icons-material';
import MainLayout from '../components/layout/MainLayout';

const TermsOfServicePage: React.FC = () => {
  const lastUpdated = '2024년 10월 1일';

  return (
    <MainLayout>
      <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Description sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h3" fontWeight={700} gutterBottom>
          이용약관
        </Typography>
        <Typography variant="body2" color="text.secondary">
          최종 수정일: {lastUpdated}
        </Typography>
      </Box>

      <Card>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ '& > *': { mb: 4 } }}>
            {/* 섹션 1 */}
            <Box>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                제1조 (목적)
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                본 약관은 Cube(이하 "회사"라 함)가 제공하는 맛집 정보 및 리뷰 서비스(이하 "서비스"라 함)의
                이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을
                목적으로 합니다.
              </Typography>
            </Box>

            <Divider />

            {/* 섹션 2 */}
            <Box>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                제2조 (정의)
              </Typography>
              <Typography variant="body1" component="div" sx={{ lineHeight: 1.8 }}>
                <ol>
                  <li>
                    "서비스"란 회사가 제공하는 맛집 정보, 리뷰, 이벤트 등 모든 부가 서비스를 의미합니다.
                  </li>
                  <li>
                    "회원"이란 본 약관에 동의하고 회사와 서비스 이용계약을 체결한 자를 말합니다.
                  </li>
                  <li>"아이디(ID)"란 회원의 식별과 서비스 이용을 위하여 회원이 설정하고 회사가 승인한 이메일 주소를 말합니다.</li>
                  <li>"비밀번호"란 회원의 개인정보 보호를 위해 회원이 설정한 문자와 숫자의 조합을 말합니다.</li>
                </ol>
              </Typography>
            </Box>

            <Divider />

            {/* 섹션 3 */}
            <Box>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                제3조 (약관의 효력 및 변경)
              </Typography>
              <Typography variant="body1" component="div" sx={{ lineHeight: 1.8 }}>
                <ol>
                  <li>본 약관은 서비스를 이용하고자 하는 모든 회원에게 그 효력이 발생합니다.</li>
                  <li>
                    회사는 필요한 경우 관련 법령을 위배하지 않는 범위 내에서 본 약관을 변경할 수 있으며,
                    변경된 약관은 시행일 7일 전부터 공지합니다.
                  </li>
                  <li>
                    회원이 변경된 약관에 동의하지 않을 경우, 서비스 이용을 중단하고 탈퇴할 수 있습니다.
                  </li>
                </ol>
              </Typography>
            </Box>

            <Divider />

            {/* 섹션 4 */}
            <Box>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                제4조 (회원가입)
              </Typography>
              <Typography variant="body1" component="div" sx={{ lineHeight: 1.8 }}>
                <ol>
                  <li>
                    회원가입은 이용자가 약관의 내용에 대하여 동의한 후 회사가 정한 가입 양식에 따라
                    회원정보를 기입하고, 회사가 이를 승인함으로써 완료됩니다.
                  </li>
                  <li>
                    회사는 다음 각 호에 해당하는 경우 회원가입을 거부하거나 사후에 회원자격을 상실시킬 수
                    있습니다:
                    <ul style={{ marginTop: '8px' }}>
                      <li>타인의 정보를 도용한 경우</li>
                      <li>허위 정보를 기재한 경우</li>
                      <li>사회의 안녕질서 또는 미풍양속을 저해할 목적으로 가입한 경우</li>
                      <li>기타 회사가 정한 이용 조건에 맞지 않는 경우</li>
                    </ul>
                  </li>
                </ol>
              </Typography>
            </Box>

            <Divider />

            {/* 섹션 5 */}
            <Box>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                제5조 (서비스의 제공 및 변경)
              </Typography>
              <Typography variant="body1" component="div" sx={{ lineHeight: 1.8 }}>
                <ol>
                  <li>
                    회사는 다음과 같은 서비스를 제공합니다:
                    <ul style={{ marginTop: '8px' }}>
                      <li>맛집 정보 검색 및 제공</li>
                      <li>맛집 리뷰 작성 및 조회</li>
                      <li>이벤트 및 공지사항 안내</li>
                      <li>기타 회사가 추가 개발하거나 제휴계약 등을 통해 제공하는 서비스</li>
                    </ul>
                  </li>
                  <li>
                    회사는 상당한 이유가 있는 경우 운영상, 기술상의 필요에 따라 제공하고 있는 서비스를
                    변경할 수 있습니다.
                  </li>
                </ol>
              </Typography>
            </Box>

            <Divider />

            {/* 섹션 6 */}
            <Box>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                제6조 (서비스의 중단)
              </Typography>
              <Typography variant="body1" component="div" sx={{ lineHeight: 1.8 }}>
                <ol>
                  <li>
                    회사는 다음 각 호에 해당하는 경우 서비스 제공을 중단할 수 있습니다:
                    <ul style={{ marginTop: '8px' }}>
                      <li>서비스용 설비의 보수 등 공사로 인한 부득이한 경우</li>
                      <li>전기통신사업법에 규정된 기간통신사업자가 전기통신 서비스를 중지한 경우</li>
                      <li>국가비상사태, 서비스 설비의 장애 또는 서비스 이용의 폭주 등으로 서비스 이용에 지장이 있는 경우</li>
                    </ul>
                  </li>
                  <li>
                    회사는 서비스 중단의 경우 사전에 서비스 초기화면이나 공지사항에 이를 통지합니다. 다만,
                    회사가 통제할 수 없는 사유로 인한 서비스 중단의 경우에는 사후에 통지할 수 있습니다.
                  </li>
                </ol>
              </Typography>
            </Box>

            <Divider />

            {/* 섹션 7 */}
            <Box>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                제7조 (회원의 의무)
              </Typography>
              <Typography variant="body1" component="div" sx={{ lineHeight: 1.8 }}>
                <ol>
                  <li>
                    회원은 다음 행위를 하여서는 안 됩니다:
                    <ul style={{ marginTop: '8px' }}>
                      <li>신청 또는 변경 시 허위 내용 등록</li>
                      <li>타인의 정보 도용</li>
                      <li>회사가 게시한 정보의 변경</li>
                      <li>회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 송신 또는 게시</li>
                      <li>회사와 기타 제3자의 저작권 등 지적재산권 침해</li>
                      <li>회사 및 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
                      <li>외설 또는 폭력적인 메시지, 화상, 음성 등 공서양속에 반하는 정보 공개 또는 게시</li>
                    </ul>
                  </li>
                </ol>
              </Typography>
            </Box>

            <Divider />

            {/* 섹션 8 */}
            <Box>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                제8조 (저작권의 귀속 및 이용제한)
              </Typography>
              <Typography variant="body1" component="div" sx={{ lineHeight: 1.8 }}>
                <ol>
                  <li>
                    회사가 작성한 저작물에 대한 저작권 및 기타 지적재산권은 회사에 귀속됩니다.
                  </li>
                  <li>
                    회원은 서비스를 이용함으로써 얻은 정보를 회사의 사전 승낙 없이 복제, 송신, 출판, 배포,
                    방송 기타 방법에 의하여 영리목적으로 이용하거나 제3자에게 이용하게 하여서는 안 됩니다.
                  </li>
                </ol>
              </Typography>
            </Box>

            <Divider />

            {/* 섹션 9 */}
            <Box>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                제9조 (분쟁해결)
              </Typography>
              <Typography variant="body1" component="div" sx={{ lineHeight: 1.8 }}>
                <ol>
                  <li>
                    회사는 회원이 제기하는 정당한 의견이나 불만을 반영하고 그 피해를 보상처리하기 위하여
                    피해보상처리기구를 설치·운영합니다.
                  </li>
                  <li>
                    회사와 회원 간에 발생한 분쟁은 대한민국 법률에 따라 해결되며, 소송이 제기될 경우
                    회사의 본사 소재지를 관할하는 법원을 관할 법원으로 합니다.
                  </li>
                </ol>
              </Typography>
            </Box>

            {/* 부칙 */}
            <Box sx={{ mt: 6, pt: 3, borderTop: '2px solid #000' }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                부칙
              </Typography>
              <Typography variant="body2" color="text.secondary">
                본 약관은 {lastUpdated}부터 시행됩니다.
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
    </MainLayout>
  );
};

export default TermsOfServicePage;
