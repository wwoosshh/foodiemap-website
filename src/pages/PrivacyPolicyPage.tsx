import React from 'react';
import { Box, Typography, Card, CardContent, Divider, Container } from '@mui/material';
import { Security } from '@mui/icons-material';
import MainLayout from '../components/layout/MainLayout';

const PrivacyPolicyPage: React.FC = () => {
  const lastUpdated = '2025년 1월 1일';

  return (
    <MainLayout>
      <Container maxWidth="md" sx={{ py: 4 }}>
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
            {/* 머리말 */}
            <Box>
              <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                Cube(이하 '회사'라 함)는 「개인정보 보호법」 제30조에 따라 정보주체의 개인정보를 보호하고
                이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보
                처리방침을 수립·공개합니다. 본 개인정보처리방침은 회사가 제공하는 맛집 정보 서비스, 리뷰 서비스,
                커뮤니티 서비스 등 모든 서비스(이하 '서비스')에 적용됩니다.
              </Typography>
            </Box>

            <Divider />

            {/* 섹션 1 */}
            <Box>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                제1조 (개인정보의 처리 목적)
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의
                용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 「개인정보 보호법」 제18조에 따라
                별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
              </Typography>
              <Typography variant="body1" component="div" sx={{ pl: 2 }}>
                <ol>
                  <li>
                    <strong>회원 가입 및 관리</strong>
                    <ul style={{ marginTop: '8px' }}>
                      <li>회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증</li>
                      <li>회원자격 유지·관리, 서비스 부정이용 방지</li>
                      <li>각종 고지·통지, 고충처리</li>
                      <li>분쟁 조정을 위한 기록 보존</li>
                    </ul>
                  </li>
                  <li>
                    <strong>민원사무 처리</strong>
                    <ul style={{ marginTop: '8px' }}>
                      <li>민원인의 신원 확인, 민원사항 확인, 사실조사를 위한 연락·통지</li>
                      <li>처리결과 통보</li>
                    </ul>
                  </li>
                  <li>
                    <strong>재화 또는 서비스 제공</strong>
                    <ul style={{ marginTop: '8px' }}>
                      <li>맛집 정보 제공, 리뷰 작성 및 관리 서비스 제공</li>
                      <li>맞춤형 콘텐츠 및 추천 서비스 제공</li>
                      <li>본인인증, 요금결제·정산</li>
                    </ul>
                  </li>
                  <li>
                    <strong>마케팅 및 광고에의 활용</strong>
                    <ul style={{ marginTop: '8px' }}>
                      <li>신규 서비스(제품) 개발 및 맞춤 서비스 제공</li>
                      <li>이벤트 및 광고성 정보 제공 및 참여기회 제공</li>
                      <li>인구통계학적 특성에 따른 서비스 제공 및 광고 게재</li>
                      <li>서비스의 유효성 확인, 접속빈도 파악 또는 회원의 서비스 이용에 대한 통계</li>
                    </ul>
                  </li>
                </ol>
              </Typography>
            </Box>

            <Divider />

            {/* 섹션 2 */}
            <Box>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                제2조 (개인정보의 처리 및 보유 기간)
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                ① 회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은
                개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                ② 각각의 개인정보 처리 및 보유 기간은 다음과 같습니다:
              </Typography>
              <Typography variant="body1" component="div" sx={{ pl: 2 }}>
                <ul>
                  <li>
                    <strong>회원 가입 및 관리:</strong> 회원 탈퇴 시까지
                    <br />
                    <Typography variant="body2" color="text.secondary" component="span">
                      (다만, 다음의 사유에 해당하는 경우에는 해당 사유 종료 시까지)
                    </Typography>
                    <ul style={{ marginTop: '8px' }}>
                      <li>관계 법령 위반에 따른 수사·조사 등이 진행중인 경우: 해당 수사·조사 종료 시까지</li>
                      <li>서비스 이용에 따른 채권·채무관계 잔존 시: 해당 채권·채무관계 정산 시까지</li>
                    </ul>
                  </li>
                  <li>
                    <strong>재화 또는 서비스 제공:</strong> 재화·서비스 공급완료 및 요금결제·정산 완료 시까지
                    <br />
                    <Typography variant="body2" color="text.secondary" component="span">
                      (다만, 다음의 사유에 해당하는 경우에는 해당 기간 종료 시까지)
                    </Typography>
                    <ul style={{ marginTop: '8px' }}>
                      <li>「전자상거래 등에서의 소비자 보호에 관한 법률」에 따른 표시·광고, 계약내용 및 이행 등
                        거래에 관한 기록: 5년</li>
                      <li>「전자상거래 등에서의 소비자 보호에 관한 법률」에 따른 소비자 불만 또는 분쟁처리에 관한 기록: 3년</li>
                      <li>「통신비밀보호법」에 따른 로그인 기록: 3개월</li>
                    </ul>
                  </li>
                  <li>
                    <strong>리뷰 및 게시물:</strong> 회원 탈퇴 시 또는 회원이 삭제 요청 시까지
                    <br />
                    <Typography variant="body2" color="text.secondary" component="span">
                      (다만, 타 회원의 정당한 이익을 위해 필요한 경우 익명화 처리 후 보관될 수 있음)
                    </Typography>
                  </li>
                  <li>
                    <strong>마케팅 및 광고:</strong> 동의 철회 시 또는 마케팅 및 광고 목적 달성 시까지
                  </li>
                </ul>
              </Typography>
            </Box>

            <Divider />

            {/* 섹션 3 */}
            <Box>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                제3조 (처리하는 개인정보의 항목)
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                ① 회사는 다음의 개인정보 항목을 처리하고 있습니다:
              </Typography>
              <Typography variant="body1" component="div" sx={{ pl: 2 }}>
                <ol>
                  <li>
                    <strong>회원가입 및 관리</strong>
                    <ul style={{ marginTop: '8px' }}>
                      <li><strong>필수항목:</strong> 이메일 주소, 비밀번호, 이름(닉네임)</li>
                      <li><strong>선택항목:</strong> 프로필 사진, 전화번호, 생년월일, 성별</li>
                    </ul>
                  </li>
                  <li>
                    <strong>서비스 이용 과정에서 자동으로 생성·수집되는 정보</strong>
                    <ul style={{ marginTop: '8px' }}>
                      <li>IP 주소, 쿠키, MAC 주소, 서비스 이용 기록, 방문 기록</li>
                      <li>접속 로그, 불량 이용 기록, 기기정보(OS, 화면사이즈, 디바이스 아이디 등)</li>
                    </ul>
                  </li>
                  <li>
                    <strong>소셜 로그인 이용 시</strong>
                    <ul style={{ marginTop: '8px' }}>
                      <li>소셜 서비스 제공자로부터 제공받는 정보 (소셜 서비스별로 상이)</li>
                      <li>일반적으로 포함되는 정보: 이메일 주소, 이름, 프로필 사진</li>
                    </ul>
                  </li>
                  <li>
                    <strong>리뷰 작성 시</strong>
                    <ul style={{ marginTop: '8px' }}>
                      <li>리뷰 내용, 평점, 업로드한 사진 및 동영상</li>
                      <li>방문일자(선택사항)</li>
                    </ul>
                  </li>
                  <li>
                    <strong>이벤트 참여 시</strong>
                    <ul style={{ marginTop: '8px' }}>
                      <li>이벤트 참여에 필요한 정보 (이벤트별로 상이)</li>
                      <li>경품 배송 시: 수령인 이름, 주소, 연락처</li>
                    </ul>
                  </li>
                </ol>
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, mt: 2 }}>
                ② 회사는 정보주체의 사생활을 현저히 침해할 우려가 있는 민감정보(사상·신념, 노동조합·정당의 가입·탈퇴,
                정치적 견해, 건강, 성생활 등에 관한 정보, 그 밖에 정보주체의 사생활을 현저히 침해할 우려가 있는
                개인정보로서 대통령령으로 정하는 정보)는 수집하지 않습니다.
              </Typography>
            </Box>

            <Divider />

            {/* 섹션 4 */}
            <Box>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                제4조 (개인정보의 제3자 제공)
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                ① 회사는 정보주체의 개인정보를 제1조(개인정보의 처리 목적)에서 명시한 범위 내에서만 처리하며,
                정보주체의 동의, 법률의 특별한 규정 등 「개인정보 보호법」 제17조 및 제18조에 해당하는 경우에만
                개인정보를 제3자에게 제공합니다.
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                ② 회사는 다음과 같이 개인정보를 제3자에게 제공하고 있습니다:
              </Typography>
              <Typography variant="body1" component="div" sx={{ pl: 2, mb: 2 }}>
                <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1, mb: 2 }}>
                  <Typography variant="body2">
                    <strong>현재 제3자 제공 사례 없음</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    회사는 현재 회원의 개인정보를 제3자에게 제공하고 있지 않습니다.
                    향후 제3자 제공이 필요한 경우 사전에 정보주체에게 제공받는 자, 제공 목적, 제공 항목,
                    보유 및 이용기간 등을 고지하고 동의를 받겠습니다.
                  </Typography>
                </Box>
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                ③ 회사는 원활한 서비스 제공을 위해 다음의 경우 「개인정보 보호법」 제17조 제1항 제1호에 따라
                정보주체의 동의 없이 개인정보를 제3자에게 제공할 수 있습니다:
              </Typography>
              <Typography variant="body1" component="div" sx={{ pl: 2 }}>
                <ul>
                  <li>정보주체 또는 그 법정대리인이 의사표시를 할 수 없는 상태에 있거나 주소불명 등으로
                    사전 동의를 받을 수 없는 경우로서 명백히 정보주체 또는 제3자의 급박한 생명, 신체, 재산의
                    이익을 위하여 필요하다고 인정되는 경우</li>
                  <li>통계작성 및 학술연구 등의 목적을 위하여 필요한 경우로서 특정 개인을 알아볼 수 없는
                    형태로 개인정보를 제공하는 경우</li>
                  <li>범죄의 수사와 공소의 제기 및 유지를 위하여 필요한 경우</li>
                  <li>법원의 재판업무 수행을 위하여 필요한 경우</li>
                  <li>형(刑) 및 감호, 보호처분의 집행을 위하여 필요한 경우</li>
                </ul>
              </Typography>
            </Box>

            <Divider />

            {/* 섹션 5 */}
            <Box>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                제5조 (개인정보처리의 위탁)
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                ① 회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다:
              </Typography>
              <Typography variant="body1" component="div" sx={{ pl: 2 }}>
                <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1, mb: 2 }}>
                  <Typography variant="body2" paragraph>
                    <strong>1. 클라우드 서비스 제공</strong>
                  </Typography>
                  <Typography variant="body2" component="div">
                    <ul>
                      <li><strong>수탁업체:</strong> Supabase (또는 실제 사용중인 클라우드 서비스 제공자)</li>
                      <li><strong>위탁업무 내용:</strong> 서버 및 데이터베이스 관리, 백업 및 복구</li>
                      <li><strong>보유 및 이용기간:</strong> 회원탈퇴 시 또는 위탁계약 종료 시까지</li>
                    </ul>
                  </Typography>
                </Box>
                <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1, mb: 2 }}>
                  <Typography variant="body2" paragraph>
                    <strong>2. 이메일 발송 서비스</strong>
                  </Typography>
                  <Typography variant="body2" component="div">
                    <ul>
                      <li><strong>수탁업체:</strong> (실제 사용중인 이메일 서비스 제공자)</li>
                      <li><strong>위탁업무 내용:</strong> 이메일 발송 대행</li>
                      <li><strong>보유 및 이용기간:</strong> 이메일 발송 완료 후 즉시 파기</li>
                    </ul>
                  </Typography>
                </Box>
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                ② 회사는 위탁계약 체결 시 「개인정보 보호법」 제26조에 따라 위탁업무 수행목적 외 개인정보 처리금지,
                기술적·관리적 보호조치, 재위탁 제한, 수탁자에 대한 관리·감독, 손해배상 등 책임에 관한 사항을
                계약서 등 문서에 명시하고, 수탁자가 개인정보를 안전하게 처리하는지를 감독하고 있습니다.
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                ③ 위탁업무의 내용이나 수탁자가 변경될 경우에는 지체 없이 본 개인정보 처리방침을 통하여 공개하도록 하겠습니다.
              </Typography>
            </Box>

            <Divider />

            {/* 섹션 6 */}
            <Box>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                제6조 (정보주체의 권리·의무 및 행사방법)
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                ① 정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다:
              </Typography>
              <Typography variant="body1" component="div" sx={{ pl: 2 }}>
                <ol>
                  <li>개인정보 열람 요구</li>
                  <li>오류 등이 있을 경우 정정 요구</li>
                  <li>삭제 요구</li>
                  <li>처리정지 요구</li>
                </ol>
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, mt: 2 }}>
                ② 제1항에 따른 권리 행사는 회사에 대해 「개인정보 보호법」 시행령 제41조 제1항에 따라 서면,
                전자우편, 모사전송(FAX) 등을 통하여 하실 수 있으며, 회사는 이에 대해 지체 없이 조치하겠습니다.
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                ③ 제1항에 따른 권리 행사는 정보주체의 법정대리인이나 위임을 받은 자 등 대리인을 통하여
                하실 수 있습니다. 이 경우 「개인정보 보호법」 시행규칙 별지 제11호 서식에 따른 위임장을 제출하셔야 합니다.
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                ④ 개인정보 열람 및 처리정지 요구는 「개인정보 보호법」 제35조 제4항, 제37조 제2항에 의하여
                정보주체의 권리가 제한될 수 있습니다.
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                ⑤ 개인정보의 정정 및 삭제 요구는 다른 법령에서 그 개인정보가 수집 대상으로 명시되어 있는 경우에는
                그 삭제를 요구할 수 없습니다.
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                ⑥ 회사는 정보주체 권리에 따른 열람의 요구, 정정·삭제의 요구, 처리정지의 요구 시 열람 등 요구를 한 자가
                본인이거나 정당한 대리인인지를 확인합니다.
              </Typography>
            </Box>

            <Divider />

            {/* 섹션 7 */}
            <Box>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                제7조 (개인정보의 파기)
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                ① 회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는
                지체 없이 해당 개인정보를 파기합니다.
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                ② 정보주체로부터 동의받은 개인정보 보유기간이 경과하거나 처리목적이 달성되었음에도 불구하고
                다른 법령에 따라 개인정보를 계속 보존하여야 하는 경우에는, 해당 개인정보를 별도의 데이터베이스(DB)로
                옮기거나 보관장소를 달리하여 보존합니다.
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                ③ 개인정보 파기의 절차 및 방법은 다음과 같습니다:
              </Typography>
              <Typography variant="body1" component="div" sx={{ pl: 2 }}>
                <ol>
                  <li>
                    <strong>파기절차</strong>
                    <ul style={{ marginTop: '8px' }}>
                      <li>회사는 파기 사유가 발생한 개인정보를 선정하고, 회사의 개인정보 보호책임자의 승인을 받아
                        개인정보를 파기합니다.</li>
                    </ul>
                  </li>
                  <li>
                    <strong>파기방법</strong>
                    <ul style={{ marginTop: '8px' }}>
                      <li>전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용합니다.</li>
                      <li>종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각을 통하여 파기합니다.</li>
                    </ul>
                  </li>
                </ol>
              </Typography>
            </Box>

            <Divider />

            {/* 섹션 8 */}
            <Box>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                제8조 (개인정보의 안전성 확보조치)
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                회사는 「개인정보 보호법」 제29조에 따라 다음과 같이 안전성 확보에 필요한 기술적/관리적 및
                물리적 조치를 하고 있습니다:
              </Typography>
              <Typography variant="body1" component="div" sx={{ pl: 2 }}>
                <ol>
                  <li>
                    <strong>내부관리계획의 수립 및 시행</strong>
                    <ul style={{ marginTop: '8px' }}>
                      <li>개인정보의 안전한 처리를 위하여 내부관리계획을 수립하고 시행하고 있습니다.</li>
                    </ul>
                  </li>
                  <li>
                    <strong>개인정보 취급 직원의 최소화 및 교육</strong>
                    <ul style={{ marginTop: '8px' }}>
                      <li>개인정보를 취급하는 직원을 지정하고 담당자에 한정시켜 최소화하여 개인정보를 관리하는 대책을 시행하고 있습니다.</li>
                      <li>개인정보 취급 직원에 대한 정기적인 교육을 실시하고 있습니다.</li>
                    </ul>
                  </li>
                  <li>
                    <strong>개인정보의 암호화</strong>
                    <ul style={{ marginTop: '8px' }}>
                      <li>이용자의 개인정보는 비밀번호는 암호화되어 저장 및 관리되고 있어, 본인만이 알 수 있으며
                        중요한 데이터는 파일 및 전송 데이터를 암호화하거나 파일 잠금 기능을 사용하는 등의 별도
                        보안기능을 사용하고 있습니다.</li>
                    </ul>
                  </li>
                  <li>
                    <strong>해킹 등에 대비한 기술적 대책</strong>
                    <ul style={{ marginTop: '8px' }}>
                      <li>회사는 해킹이나 컴퓨터 바이러스 등에 의한 개인정보 유출 및 훼손을 막기 위하여
                        보안프로그램을 설치하고 주기적인 갱신·점검을 하며 외부로부터 접근이 통제된 구역에
                        시스템을 설치하고 기술적/물리적으로 감시 및 차단하고 있습니다.</li>
                    </ul>
                  </li>
                  <li>
                    <strong>개인정보에 대한 접근 제한</strong>
                    <ul style={{ marginTop: '8px' }}>
                      <li>개인정보를 처리하는 데이터베이스시스템에 대한 접근권한의 부여, 변경, 말소를 통하여
                        개인정보에 대한 접근통제를 위하여 필요한 조치를 하고 있으며 침입차단시스템을 이용하여
                        외부로부터의 무단 접근을 통제하고 있습니다.</li>
                    </ul>
                  </li>
                  <li>
                    <strong>접속기록의 보관 및 위변조 방지</strong>
                    <ul style={{ marginTop: '8px' }}>
                      <li>개인정보처리시스템에 접속한 기록을 최소 1년 이상 보관, 관리하고 있으며, 다만, 5만명 이상의
                        정보주체에 관하여 개인정보를 추가하거나, 고유식별정보 또는 민감정보를 처리하는 경우에는
                        2년 이상 보관, 관리하고 있습니다.</li>
                      <li>또한, 접속기록이 위변조 및 도난, 분실되지 않도록 보안기능을 사용하고 있습니다.</li>
                    </ul>
                  </li>
                  <li>
                    <strong>문서보안을 위한 잠금장치 사용</strong>
                    <ul style={{ marginTop: '8px' }}>
                      <li>개인정보가 포함된 서류, 보조저장매체 등을 잠금장치가 있는 안전한 장소에 보관하고 있습니다.</li>
                    </ul>
                  </li>
                  <li>
                    <strong>비인가자에 대한 출입 통제</strong>
                    <ul style={{ marginTop: '8px' }}>
                      <li>개인정보를 보관하고 있는 물리적 보관 장소를 별도로 두고 이에 대해 출입통제 절차를 수립, 운영하고 있습니다.</li>
                    </ul>
                  </li>
                </ol>
              </Typography>
            </Box>

            <Divider />

            {/* 섹션 9 */}
            <Box>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                제9조 (개인정보 자동 수집 장치의 설치·운영 및 거부에 관한 사항)
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                ① 회사는 이용자에게 개별적인 맞춤서비스를 제공하기 위해 이용정보를 저장하고 수시로 불러오는
                '쿠키(cookie)'를 사용합니다.
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                ② 쿠키는 웹사이트를 운영하는데 이용되는 서버(http)가 이용자의 컴퓨터 브라우저에게 보내는
                소량의 정보이며 이용자들의 PC 컴퓨터내의 하드디스크에 저장되기도 합니다.
              </Typography>
              <Typography variant="body1" component="div" sx={{ pl: 2 }}>
                <ul>
                  <li>
                    <strong>가. 쿠키의 사용 목적:</strong> 이용자가 방문한 각 서비스와 웹 사이트들에 대한 방문 및
                    이용형태, 인기 검색어, 보안접속 여부, 등을 파악하여 이용자에게 최적화된 정보 제공을 위해 사용됩니다.
                  </li>
                  <li>
                    <strong>나. 쿠키의 설치·운영 및 거부:</strong> 웹브라우저 상단의 도구 &gt; 인터넷 옵션 &gt;
                    개인정보 메뉴의 옵션 설정을 통해 쿠키 저장을 거부할 수 있습니다.
                  </li>
                  <li>
                    <strong>다. 쿠키 저장을 거부할 경우 맞춤형 서비스 이용에 어려움이 발생할 수 있습니다.</strong>
                  </li>
                </ul>
              </Typography>
            </Box>

            <Divider />

            {/* 섹션 10 */}
            <Box>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                제10조 (개인정보 보호책임자)
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                ① 회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의
                불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
              </Typography>
              <Box sx={{ bgcolor: 'grey.50', p: 3, borderRadius: 2, mb: 2 }}>
                <Typography variant="body1" gutterBottom>
                  <strong>▶ 개인정보 보호책임자</strong>
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  성명: Cube 개인정보보호책임자
                  <br />
                  직책: 정보보호최고책임자(CISO)
                  <br />
                  연락처: nunconnect1@gmail.com
                </Typography>
              </Box>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                ② 정보주체께서는 회사의 서비스(또는 사업)을 이용하시면서 발생한 모든 개인정보 보호 관련 문의,
                불만처리, 피해구제 등에 관한 사항을 개인정보 보호책임자 및 담당부서로 문의하실 수 있습니다.
                회사는 정보주체의 문의에 대해 지체 없이 답변 및 처리해드릴 것입니다.
              </Typography>
            </Box>

            <Divider />

            {/* 섹션 11 */}
            <Box>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                제11조 (권익침해 구제방법)
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                정보주체는 개인정보침해로 인한 구제를 받기 위하여 개인정보분쟁조정위원회, 한국인터넷진흥원
                개인정보침해신고센터 등에 분쟁해결이나 상담 등을 신청할 수 있습니다. 이 밖에 기타 개인정보침해의
                신고, 상담에 대하여는 아래의 기관에 문의하시기 바랍니다.
              </Typography>
              <Typography variant="body1" component="div" sx={{ pl: 2 }}>
                <ol>
                  <li>
                    개인정보분쟁조정위원회 : (국번없이) 1833-6972 (www.kopico.go.kr)
                  </li>
                  <li>
                    개인정보침해신고센터 : (국번없이) 118 (privacy.kisa.or.kr)
                  </li>
                  <li>
                    대검찰청 : (국번없이) 1301 (www.spo.go.kr)
                  </li>
                  <li>
                    경찰청 : (국번없이) 182 (ecrm.cyber.go.kr)
                  </li>
                </ol>
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, mt: 2 }}>
                「개인정보 보호법」 제35조(개인정보의 열람), 제36조(개인정보의 정정·삭제), 제37조(개인정보의
                처리정지 등)의 규정에 의한 요구에 대하여 공공기관의 장이 행한 처분 또는 부작위로 인하여 권리 또는
                이익의 침해를 받은 자는 행정심판법이 정하는 바에 따라 행정심판을 청구할 수 있습니다.
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                ※ 행정심판에 대해 자세한 사항은 중앙행정심판위원회(www.simpan.go.kr) 홈페이지를 참고하시기 바랍니다.
              </Typography>
            </Box>

            <Divider />

            {/* 섹션 12 */}
            <Box>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                제12조 (개인정보 처리방침의 변경)
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                ① 이 개인정보처리방침은 {lastUpdated}부터 적용됩니다.
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                ② 이전의 개인정보 처리방침은 아래에서 확인하실 수 있습니다.
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                ③ 본 개인정보처리방침의 내용 추가, 삭제 및 수정이 있을 시에는 개정 최소 7일 전에 '공지사항'을
                통해 사전 공지를 할 것입니다. 다만, 수집하는 개인정보의 항목, 이용목적의 변경 등과 같이 이용자
                권리의 중대한 변경이 발생할 때에는 최소 30일 전에 공지하며, 필요 시 이용자 동의를 다시 받을 수도 있습니다.
              </Typography>
            </Box>

            {/* 부칙 */}
            <Box sx={{ mt: 6, pt: 3, borderTop: '2px solid #000' }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                부칙
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                본 방침은 {lastUpdated}부터 시행됩니다.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                이전의 개인정보처리방침은 회사의 고객센터를 통해 열람하실 수 있습니다.
              </Typography>
            </Box>

            {/* 고객센터 안내 */}
            <Box sx={{ mt: 4, p: 3, backgroundColor: 'grey.50', borderRadius: 2 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                개인정보 관련 문의
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                개인정보 보호와 관련하여 문의사항이 있으신 경우 아래 연락처로 문의해주시기 바랍니다.
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>개인정보 보호책임자 이메일:</strong> nunconnect1@gmail.com
                </Typography>
                <Typography variant="body2">
                  <strong>고객센터 이메일:</strong> nunconnect1@gmail.com
                </Typography>
                <Typography variant="body2">
                  <strong>운영시간:</strong> 평일 09:00 - 18:00 (주말 및 공휴일 제외)
                </Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
    </MainLayout>
  );
};

export default PrivacyPolicyPage;
