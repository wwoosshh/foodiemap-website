import React from 'react';
import { Box, Typography, Card, CardContent, Divider } from '@mui/material';
import { Security } from '@mui/icons-material';
import StandardLayout from '../components/StandardLayout';

const PrivacyPolicyPage: React.FC = () => {
  const lastUpdated = '2024년 10월 1일';

  return (
    <StandardLayout maxWidth="md">
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Security sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h3" fontWeight={700} gutterBottom>
          개인정보처리방침
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
                1. 개인정보의 수집 및 이용 목적
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                Cube(이하 '회사'라 함)는 다음의 목적을 위하여 개인정보를 처리합니다. 처리한 개인정보는
                다음의 목적 이외의 용도로는 사용되지 않으며, 이용 목적이 변경될 시에는 사전 동의를 구할
                것입니다.
              </Typography>
              <Typography variant="body1" component="div" sx={{ pl: 2 }}>
                <ul>
                  <li>회원 가입 및 관리</li>
                  <li>맛집 정보 제공 및 서비스 이용</li>
                  <li>리뷰 작성 및 관리</li>
                  <li>이벤트 및 공지사항 알림</li>
                  <li>서비스 개선 및 통계 분석</li>
                </ul>
              </Typography>
            </Box>

            <Divider />

            {/* 섹션 2 */}
            <Box>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                2. 수집하는 개인정보의 항목
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                회사는 서비스 제공을 위해 다음과 같은 개인정보를 수집합니다:
              </Typography>
              <Typography variant="body1" component="div" sx={{ pl: 2 }}>
                <ul>
                  <li>
                    <strong>필수항목:</strong> 이메일, 비밀번호, 이름
                  </li>
                  <li>
                    <strong>선택항목:</strong> 프로필 사진, 전화번호
                  </li>
                  <li>
                    <strong>자동수집항목:</strong> IP 주소, 쿠키, 서비스 이용 기록, 접속 로그
                  </li>
                  <li>
                    <strong>소셜 로그인 시:</strong> 소셜 서비스 제공자로부터 제공받는 정보 (이메일, 이름 등)
                  </li>
                </ul>
              </Typography>
            </Box>

            <Divider />

            {/* 섹션 3 */}
            <Box>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                3. 개인정보의 보유 및 이용 기간
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의
                받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
              </Typography>
              <Typography variant="body1" component="div" sx={{ pl: 2 }}>
                <ul>
                  <li>회원 탈퇴 시까지: 회원 정보</li>
                  <li>3년: 리뷰 및 활동 기록</li>
                  <li>관련 법령에 따른 보존 기간: 거래 기록 등</li>
                </ul>
              </Typography>
            </Box>

            <Divider />

            {/* 섹션 4 */}
            <Box>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                4. 개인정보의 제3자 제공
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                회사는 정보주체의 개인정보를 제1조(개인정보의 수집 및 이용 목적)에서 명시한 범위 내에서만
                처리하며, 정보주체의 동의, 법률의 특별한 규정 등 개인정보 보호법 제17조 및 제18조에
                해당하는 경우에만 개인정보를 제3자에게 제공합니다.
              </Typography>
            </Box>

            <Divider />

            {/* 섹션 5 */}
            <Box>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                5. 정보주체의 권리·의무 및 행사 방법
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다:
              </Typography>
              <Typography variant="body1" component="div" sx={{ pl: 2 }}>
                <ul>
                  <li>개인정보 열람 요구</li>
                  <li>오류 등이 있을 경우 정정 요구</li>
                  <li>삭제 요구</li>
                  <li>처리정지 요구</li>
                </ul>
              </Typography>
            </Box>

            <Divider />

            {/* 섹션 6 */}
            <Box>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                6. 개인정보의 안전성 확보 조치
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다:
              </Typography>
              <Typography variant="body1" component="div" sx={{ pl: 2 }}>
                <ul>
                  <li>개인정보 암호화</li>
                  <li>해킹 등에 대비한 기술적 대책</li>
                  <li>개인정보 취급 직원의 최소화 및 교육</li>
                  <li>개인정보 보호 전담기구 운영</li>
                </ul>
              </Typography>
            </Box>

            <Divider />

            {/* 섹션 7 */}
            <Box>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                7. 개인정보 보호책임자
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의
                불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
              </Typography>
              <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1 }}>
                <Typography variant="body1">
                  <strong>개인정보 보호책임자</strong>
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  담당자: Cube 관리자
                  <br />
                  이메일: privacy@cube.com
                </Typography>
              </Box>
            </Box>

            <Divider />

            {/* 섹션 8 */}
            <Box>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                8. 개인정보처리방침의 변경
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및
                정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </StandardLayout>
  );
};

export default PrivacyPolicyPage;
