import React from 'react';
import { Box, Typography, Card, CardContent, Divider, Container } from '@mui/material';
import { Description } from '@mui/icons-material';
import MainLayout from '../components/layout/MainLayout';

const TermsOfServicePage: React.FC = () => {
  const lastUpdated = '2025년 1월 1일';

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
                본 약관은 Cube(이하 "회사"라 함)가 운영하는 웹사이트 및 모바일 애플리케이션을 통해 제공하는 맛집 정보,
                리뷰, 커뮤니티 서비스 및 제반 서비스(이하 "서비스"라 함)의 이용과 관련하여 회사와 이용자 간의 권리,
                의무 및 책임사항, 서비스 이용조건 및 절차, 기타 필요한 사항을 규정함을 목적으로 합니다.
              </Typography>
            </Box>

            <Divider />

            {/* 섹션 2 */}
            <Box>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                제2조 (용어의 정의)
              </Typography>
              <Typography variant="body1" component="div" sx={{ lineHeight: 1.8 }}>
                본 약관에서 사용하는 용어의 정의는 다음과 같습니다:
                <ol style={{ marginTop: '12px' }}>
                  <li>
                    <strong>"서비스"</strong>란 회사가 제공하는 맛집 정보 검색, 리뷰 작성 및 조회, 즐겨찾기,
                    평점 부여, 이벤트 참여, 푸시 알림, 소셜 공유 등 회원이 이용 가능한 모든 부가 서비스를 포괄적으로 의미합니다.
                  </li>
                  <li>
                    <strong>"회원"</strong>이란 본 약관에 동의하고 회사와 서비스 이용계약을 체결한 자로서,
                    회사가 제공하는 서비스를 지속적으로 이용할 수 있는 자를 말합니다.
                  </li>
                  <li>
                    <strong>"비회원"</strong>이란 회원가입 절차를 거치지 않고 회사가 제공하는 일부 서비스를 이용하는 자를 말합니다.
                  </li>
                  <li>
                    <strong>"아이디(ID)"</strong>란 회원의 식별과 서비스 이용을 위하여 회원이 설정하고 회사가 승인한
                    이메일 주소 또는 소셜 로그인 계정을 말합니다.
                  </li>
                  <li>
                    <strong>"비밀번호(Password)"</strong>란 회원이 부여받은 아이디와 일치된 회원임을 확인하고
                    회원 자신의 비밀 보호를 위해 회원이 설정한 문자, 숫자 또는 특수문자의 조합을 말합니다.
                  </li>
                  <li>
                    <strong>"게시물"</strong>이란 회원이 서비스를 이용함에 있어 게시한 문자, 문서, 그림, 사진, 동영상,
                    링크 및 파일 등을 의미합니다.
                  </li>
                  <li>
                    <strong>"리뷰"</strong>란 회원이 맛집을 방문한 경험을 바탕으로 작성한 평가, 의견, 사진 등을 포함한
                    게시물을 말합니다.
                  </li>
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
                  <li>
                    본 약관은 서비스를 이용하고자 하는 모든 회원 및 비회원에 대하여 그 효력이 발생합니다.
                  </li>
                  <li>
                    본 약관의 내용은 서비스 화면에 게시하거나 기타의 방법으로 공지하고, 이에 동의한 회원이
                    서비스에 가입함으로써 효력이 발생합니다.
                  </li>
                  <li>
                    회사는 필요하다고 인정되는 경우 「약관의 규제에 관한 법률」, 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」,
                    「전자상거래 등에서의 소비자보호에 관한 법률」 등 관련 법령을 위배하지 않는 범위 내에서 본 약관을 변경할 수 있으며,
                    회사가 약관을 변경할 경우에는 적용일자 및 변경사유를 명시하여 현행약관과 함께 서비스 초기화면에
                    그 적용일자 7일 전부터 적용일자 전일까지 공지합니다. 다만, 회원에게 불리한 약관의 변경인 경우에는
                    30일 전부터 공지하며, 회원의 이메일 주소로 개별 통지합니다.
                  </li>
                  <li>
                    회사가 전항에 따라 변경약관을 공지 또는 통지하면서 회원에게 약관 변경 적용일까지 거부 의사를
                    표시하지 않으면 약관의 변경에 동의한 것으로 간주한다는 내용을 공지 또는 통지하였음에도 회원이
                    명시적으로 약관 변경에 대한 거부 의사를 표시하지 아니하면, 회원이 변경약관에 동의한 것으로 간주합니다.
                  </li>
                  <li>
                    회원이 변경약관의 내용에 동의하지 않는 경우 회원은 서비스 이용을 중단하고 이용계약을 해지할 수 있습니다.
                  </li>
                </ol>
              </Typography>
            </Box>

            <Divider />

            {/* 섹션 4 */}
            <Box>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                제4조 (약관 외 준칙)
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                본 약관에 명시되지 않은 사항에 대해서는 「약관의 규제에 관한 법률」, 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」,
                「전자상거래 등에서의 소비자보호에 관한 법률」, 「개인정보보호법」 등 관련 법령 또는 상관례에 따릅니다.
              </Typography>
            </Box>

            <Divider />

            {/* 섹션 5 */}
            <Box>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                제5조 (회원가입)
              </Typography>
              <Typography variant="body1" component="div" sx={{ lineHeight: 1.8 }}>
                <ol>
                  <li>
                    이용자는 회사가 정한 가입 양식에 따라 회원정보를 기입한 후 본 약관 및 개인정보처리방침에
                    동의한다는 의사표시를 함으로써 회원가입을 신청합니다.
                  </li>
                  <li>
                    회사는 제1항과 같이 회원으로 가입할 것을 신청한 이용자 중 다음 각 호에 해당하지 않는 한
                    회원으로 등록합니다:
                    <ul style={{ marginTop: '8px' }}>
                      <li>가입신청자가 본 약관 제6조 제3항에 의하여 이전에 회원자격을 상실한 적이 있는 경우
                        (다만, 회원자격 상실 후 3년이 경과한 자로서 회사의 회원 재가입 승낙을 얻은 경우는 예외로 함)</li>
                      <li>등록 내용에 허위, 기재누락, 오기가 있는 경우</li>
                      <li>타인의 명의를 도용한 경우</li>
                      <li>만 14세 미만의 아동이 법정대리인의 동의를 얻지 않은 경우</li>
                      <li>사회의 안녕질서 또는 미풍양속을 저해할 목적으로 신청한 경우</li>
                      <li>부정한 용도 또는 영리를 추구할 목적으로 본 서비스를 이용하고자 하는 경우</li>
                      <li>기타 회사가 정한 이용신청 요건이 충족되지 않았을 경우</li>
                    </ul>
                  </li>
                  <li>
                    제1항에 따른 신청에 있어 회사는 전문기관을 통한 실명확인 및 본인인증을 요청할 수 있습니다.
                  </li>
                  <li>
                    회사는 서비스 관련 설비의 여유가 없거나, 기술상 또는 업무상 문제가 있는 경우에는 승낙을
                    유보할 수 있습니다.
                  </li>
                  <li>
                    회원가입계약의 성립 시기는 회사의 승낙이 회원에게 도달한 시점으로 합니다.
                  </li>
                  <li>
                    회원은 회원가입 시 등록한 사항에 변경이 있는 경우, 상당한 기간 이내에 회사에 대하여
                    회원정보 수정 등의 방법으로 그 변경사항을 알려야 합니다.
                  </li>
                </ol>
              </Typography>
            </Box>

            <Divider />

            {/* 섹션 6 */}
            <Box>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                제6조 (회원탈퇴 및 자격 상실 등)
              </Typography>
              <Typography variant="body1" component="div" sx={{ lineHeight: 1.8 }}>
                <ol>
                  <li>
                    회원은 회사에 언제든지 탈퇴를 요청할 수 있으며, 회사는 즉시 회원탈퇴를 처리합니다.
                  </li>
                  <li>
                    회원이 다음 각 호의 사유에 해당하는 경우, 회사는 회원자격을 제한 및 정지시킬 수 있습니다:
                    <ul style={{ marginTop: '8px' }}>
                      <li>가입 신청 시에 허위 내용을 등록한 경우</li>
                      <li>다른 사람의 서비스 이용을 방해하거나 그 정보를 도용하는 등 전자상거래 질서를 위협하는 경우</li>
                      <li>서비스를 이용하여 법령 또는 본 약관이 금지하거나 공서양속에 반하는 행위를 하는 경우</li>
                      <li>타인의 명예를 손상시키거나 불이익을 주는 행위를 한 경우</li>
                      <li>서비스의 안정적 운영을 방해할 목적으로 다량의 정보를 전송하거나 광고성 정보를 전송하는 경우</li>
                      <li>정보통신설비의 오작동이나 정보 등의 파괴를 유발시키는 컴퓨터 바이러스 프로그램 등을 유포하는 경우</li>
                      <li>회사, 다른 회원 또는 제3자의 지적재산권을 침해하는 경우</li>
                      <li>회사의 서비스 정보를 이용하여 얻은 정보를 회사의 사전 승낙 없이 복제 또는 유통시키거나
                        상업적으로 이용하는 경우</li>
                      <li>회원이 자신의 홈페이지와 게시판에 음란물을 게재하거나 음란사이트를 링크하는 경우</li>
                    </ul>
                  </li>
                  <li>
                    회사가 회원 자격을 제한·정지시킨 후, 동일한 행위가 2회 이상 반복되거나 30일 이내에
                    그 사유가 시정되지 아니하는 경우 회사는 회원자격을 상실시킬 수 있습니다.
                  </li>
                  <li>
                    회사가 회원자격을 상실시키는 경우에는 회원등록을 말소합니다. 이 경우 회원에게 이를 통지하고,
                    회원등록 말소 전에 최소한 30일 이상의 기간을 정하여 소명할 기회를 부여합니다.
                  </li>
                </ol>
              </Typography>
            </Box>

            <Divider />

            {/* 섹션 7 */}
            <Box>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                제7조 (회원에 대한 통지)
              </Typography>
              <Typography variant="body1" component="div" sx={{ lineHeight: 1.8 }}>
                <ol>
                  <li>
                    회사가 회원에 대한 통지를 하는 경우, 회원이 회사와 미리 약정하여 지정한 전자우편 주소로 할 수 있습니다.
                  </li>
                  <li>
                    회사는 불특정다수 회원에 대한 통지의 경우 1주일 이상 서비스 게시판에 게시함으로써
                    개별 통지에 갈음할 수 있습니다. 다만, 회원 본인의 거래와 관련하여 중대한 영향을 미치는
                    사항에 대하여는 개별통지를 합니다.
                  </li>
                </ol>
              </Typography>
            </Box>

            <Divider />

            {/* 섹션 8 */}
            <Box>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                제8조 (서비스의 제공 및 변경)
              </Typography>
              <Typography variant="body1" component="div" sx={{ lineHeight: 1.8 }}>
                <ol>
                  <li>
                    회사는 다음과 같은 업무를 수행합니다:
                    <ul style={{ marginTop: '8px' }}>
                      <li>맛집 정보의 제공 및 검색 서비스</li>
                      <li>맛집 리뷰 작성, 수정, 삭제 및 조회 서비스</li>
                      <li>맛집 평점 부여 서비스</li>
                      <li>맛집 즐겨찾기 및 위시리스트 관리 서비스</li>
                      <li>맛집 추천 알고리즘 및 개인화 서비스</li>
                      <li>이벤트 및 프로모션 정보 제공</li>
                      <li>푸시 알림 및 소셜 공유 서비스</li>
                      <li>커뮤니티 및 게시판 서비스</li>
                      <li>기타 회사가 추가 개발하거나 다른 회사와의 제휴계약 등을 통해 회원에게 제공하는 일체의 서비스</li>
                    </ul>
                  </li>
                  <li>
                    회사는 서비스를 일정범위로 분할하여 각 범위별로 이용가능시간을 별도로 지정할 수 있습니다.
                    다만, 이러한 경우에는 그 내용을 사전에 공지합니다.
                  </li>
                  <li>
                    서비스는 연중무휴, 1일 24시간 제공함을 원칙으로 합니다. 다만, 회사는 서비스를 일정범위로
                    분할하여 각 범위별로 이용가능 시간을 별도로 정할 수 있으며, 이 경우 그 내용을 사전에 공지합니다.
                  </li>
                  <li>
                    회사는 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신두절 또는 운영상 상당한 이유가 있는 경우
                    서비스의 제공을 일시적으로 중단할 수 있습니다. 이 경우 회사는 제7조(회원에 대한 통지)에 정한 방법으로
                    회원에게 통지합니다. 다만, 회사가 사전에 통지할 수 없는 부득이한 사유가 있는 경우 사후에 통지할 수 있습니다.
                  </li>
                  <li>
                    회사는 서비스의 제공에 필요한 경우 정기점검을 실시할 수 있으며, 정기점검시간은 서비스 제공화면에
                    공지한 바에 따릅니다.
                  </li>
                  <li>
                    회사는 상당한 이유가 있는 경우 운영상, 기술상의 필요에 따라 제공하고 있는 전부 또는 일부 서비스를
                    변경할 수 있으며, 변경 전 해당 서비스 초기화면에 관련 사항을 게시합니다.
                  </li>
                </ol>
              </Typography>
            </Box>

            <Divider />

            {/* 섹션 9 */}
            <Box>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                제9조 (서비스의 중단)
              </Typography>
              <Typography variant="body1" component="div" sx={{ lineHeight: 1.8 }}>
                <ol>
                  <li>
                    회사는 다음 각 호에 해당하는 경우 서비스 제공을 중단할 수 있습니다:
                    <ul style={{ marginTop: '8px' }}>
                      <li>서비스용 설비의 보수, 정기점검, 교체 및 고장, 통신의 두절 등의 사유가 발생한 경우</li>
                      <li>「전기통신사업법」에 규정된 기간통신사업자가 전기통신 서비스를 중지했을 경우</li>
                      <li>국가비상사태, 정전, 서비스 설비의 장애 또는 서비스 이용의 폭주 등으로 서비스 이용에 지장이 있는 경우</li>
                      <li>기타 중대한 사유로 인하여 회사가 서비스 제공을 지속하는 것이 부적당하다고 인정하는 경우</li>
                    </ul>
                  </li>
                  <li>
                    회사는 제1항의 사유로 서비스의 제공이 일시적으로 중단됨으로 인하여 회원 또는 제3자가 입은
                    손해에 대하여는 배상하지 않습니다. 다만, 회사의 고의 또는 중과실에 의한 경우에는 그러하지 아니합니다.
                  </li>
                  <li>
                    사업종목의 전환, 사업의 포기, 업체 간의 통합 등의 이유로 서비스를 제공할 수 없게 되는 경우에는
                    회사는 제7조에 정한 방법으로 회원에게 통지하고 당초 회사에서 제시한 조건에 따라 소비자에게 보상합니다.
                  </li>
                </ol>
              </Typography>
            </Box>

            <Divider />

            {/* 섹션 10 */}
            <Box>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                제10조 (회원의 의무)
              </Typography>
              <Typography variant="body1" component="div" sx={{ lineHeight: 1.8 }}>
                <ol>
                  <li>
                    회원은 다음 행위를 하여서는 안 됩니다:
                    <ul style={{ marginTop: '8px' }}>
                      <li>신청 또는 변경 시 허위내용의 등록</li>
                      <li>타인의 정보 도용</li>
                      <li>회사에 게시된 정보의 변경</li>
                      <li>회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시</li>
                      <li>회사와 기타 제3자의 저작권 등 지적재산권에 대한 침해</li>
                      <li>회사 및 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
                      <li>외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 서비스에 공개 또는 게시하는 행위</li>
                      <li>회사의 동의 없이 영리를 목적으로 서비스를 사용하는 행위</li>
                      <li>허위 또는 과장된 리뷰를 작성하는 행위</li>
                      <li>금전적 대가를 받고 리뷰를 작성하거나, 특정 업체를 홍보할 목적으로 리뷰를 작성하는 행위</li>
                      <li>타인을 사칭하여 리뷰를 작성하는 행위</li>
                      <li>동일한 맛집에 대해 다수의 계정으로 중복 리뷰를 작성하는 행위</li>
                      <li>자동화된 수단을 통해 서비스에 접근하거나 데이터를 수집하는 행위</li>
                    </ul>
                  </li>
                  <li>
                    회원은 관계 법령, 본 약관의 규정, 이용안내 및 서비스와 관련하여 공지한 주의사항,
                    회사가 통지하는 사항 등을 준수하여야 하며, 기타 회사의 업무에 방해되는 행위를 하여서는 안 됩니다.
                  </li>
                  <li>
                    회원은 아이디 및 비밀번호를 관리할 책임이 있으며, 본인의 아이디 및 비밀번호를 제3자가
                    이용하도록 하여서는 안 됩니다.
                  </li>
                  <li>
                    회원은 자신의 아이디 및 비밀번호가 도용되거나 제3자가 사용하고 있음을 인지한 경우에는
                    이를 즉시 회사에 통지하고 회사의 안내에 따라야 합니다.
                  </li>
                </ol>
              </Typography>
            </Box>

            <Divider />

            {/* 섹션 11 */}
            <Box>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                제11조 (회사의 의무)
              </Typography>
              <Typography variant="body1" component="div" sx={{ lineHeight: 1.8 }}>
                <ol>
                  <li>
                    회사는 법령과 본 약관이 금지하거나 공서양속에 반하는 행위를 하지 않으며,
                    계속적이고 안정적으로 서비스를 제공하기 위하여 최선을 다하여 노력합니다.
                  </li>
                  <li>
                    회사는 회원이 안전하게 서비스를 이용할 수 있도록 개인정보(신용정보 포함)보호를 위해
                    보안시스템을 갖추어야 하며 개인정보처리방침을 공시하고 준수합니다.
                  </li>
                  <li>
                    회사는 서비스 이용과 관련하여 회원으로부터 제기된 의견이나 불만이 정당하다고 인정할 경우에는
                    이를 처리하여야 합니다. 회원이 제기한 의견이나 불만사항에 대해서는 게시판을 활용하거나
                    전자우편 등을 통하여 회원에게 처리과정 및 결과를 전달합니다.
                  </li>
                  <li>
                    회사는 정보통신망 이용촉진 및 정보보호에 관한 법률, 통신비밀보호법, 전기통신사업법 등
                    서비스의 운영, 유지와 관련 있는 법규를 준수합니다.
                  </li>
                </ol>
              </Typography>
            </Box>

            <Divider />

            {/* 섹션 12 */}
            <Box>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                제12조 (개인정보보호)
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                회사는 회원의 개인정보를 보호하기 위하여 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」,
                「개인정보보호법」 등 관계 법령에서 정하는 바를 준수하며, 회사의 개인정보처리방침은 서비스
                초기화면에서 확인할 수 있습니다.
              </Typography>
            </Box>

            <Divider />

            {/* 섹션 13 */}
            <Box>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                제13조 (저작권의 귀속 및 이용제한)
              </Typography>
              <Typography variant="body1" component="div" sx={{ lineHeight: 1.8 }}>
                <ol>
                  <li>
                    회사가 작성한 저작물에 대한 저작권 및 기타 지적재산권은 회사에 귀속됩니다.
                  </li>
                  <li>
                    회원은 회사가 제공하는 서비스를 이용함으로써 얻은 정보 중 회사 또는 제공업체에 지적재산권이
                    귀속된 정보를 회사 또는 제공업체의 사전 승낙 없이 복제, 송신, 출판, 배포, 방송 기타 방법에
                    의하여 영리목적으로 이용하거나 제3자에게 이용하게 하여서는 안 됩니다.
                  </li>
                  <li>
                    회원이 서비스 내에 게시한 게시물의 저작권은 해당 게시물의 저작자에게 귀속됩니다.
                  </li>
                  <li>
                    회원이 서비스 내에 게시하는 게시물은 검색결과 내지 서비스 및 관련 프로모션 등에 노출될 수 있으며,
                    해당 노출을 위해 필요한 범위 내에서는 일부 수정, 복제, 편집되어 게시될 수 있습니다.
                    이 경우, 회사는 저작권법 규정을 준수하며, 회원은 언제든지 고객센터 또는 서비스 내 관리기능을 통해
                    해당 게시물에 대해 삭제, 검색결과 제외, 비공개 등의 조치를 취할 수 있습니다.
                  </li>
                  <li>
                    회사는 제4항 이외의 방법으로 회원의 게시물을 이용하고자 하는 경우에는 전화, 팩스,
                    전자우편 등을 통해 사전에 회원의 동의를 얻어야 합니다.
                  </li>
                </ol>
              </Typography>
            </Box>

            <Divider />

            {/* 섹션 14 */}
            <Box>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                제14조 (게시물의 관리)
              </Typography>
              <Typography variant="body1" component="div" sx={{ lineHeight: 1.8 }}>
                <ol>
                  <li>
                    회원의 게시물이 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 및 「저작권법」 등
                    관련 법령에 위반되는 내용을 포함하는 경우, 권리자는 관련 법령이 정한 절차에 따라
                    해당 게시물의 게시중단 및 삭제 등을 요청할 수 있으며, 회사는 관련 법령에 따라 조치를 취하여야 합니다.
                  </li>
                  <li>
                    회사는 전항에 따른 권리자의 요청이 없는 경우라도 권리침해가 인정될 만한 사유가 있거나
                    기타 회사 정책 및 관련 법령에 위반되는 경우에는 관련 법령에 따라 해당 게시물에 대해
                    임시조치 등을 취할 수 있습니다.
                  </li>
                  <li>
                    본 조에 따른 세부절차는 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 및
                    「저작권법」이 규정한 범위 내에서 회사가 정한 게시중단요청서비스에 따릅니다.
                  </li>
                </ol>
              </Typography>
            </Box>

            <Divider />

            {/* 섹션 15 */}
            <Box>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                제15조 (분쟁해결)
              </Typography>
              <Typography variant="body1" component="div" sx={{ lineHeight: 1.8 }}>
                <ol>
                  <li>
                    회사는 이용자가 제기하는 정당한 의견이나 불만을 반영하고 그 피해를 보상처리하기 위하여
                    피해보상처리기구를 설치·운영합니다.
                  </li>
                  <li>
                    회사는 이용자로부터 제출되는 불만사항 및 의견은 우선적으로 그 사항을 처리합니다.
                    다만, 신속한 처리가 곤란한 경우에는 이용자에게 그 사유와 처리일정을 즉시 통보해 드립니다.
                  </li>
                  <li>
                    회사와 이용자 간에 발생한 전자상거래 분쟁과 관련하여 이용자의 피해구제신청이 있는 경우에는
                    공정거래위원회 또는 시·도지사가 의뢰하는 분쟁조정기관의 조정에 따를 수 있습니다.
                  </li>
                </ol>
              </Typography>
            </Box>

            <Divider />

            {/* 섹션 16 */}
            <Box>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                제16조 (재판권 및 준거법)
              </Typography>
              <Typography variant="body1" component="div" sx={{ lineHeight: 1.8 }}>
                <ol>
                  <li>
                    회사와 회원 간에 발생한 전자상거래 분쟁에 관한 소송은 제소 당시의 회원의 주소에 의하고,
                    주소가 없는 경우에는 거소를 관할하는 지방법원의 전속관할로 합니다. 다만, 제소 당시
                    회원의 주소 또는 거소가 분명하지 않거나 외국 거주자의 경우에는 민사소송법상의 관할법원에 제기합니다.
                  </li>
                  <li>
                    회사와 회원 간에 제기된 전자상거래 소송에는 대한민국 법을 적용합니다.
                  </li>
                </ol>
              </Typography>
            </Box>

            {/* 부칙 */}
            <Box sx={{ mt: 6, pt: 3, borderTop: '2px solid #000' }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                부칙
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                본 약관은 {lastUpdated}부터 시행됩니다.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                본 약관의 이전 버전은 회사의 고객센터를 통해 열람하실 수 있습니다.
              </Typography>
            </Box>

            {/* 고객센터 안내 */}
            <Box sx={{ mt: 4, p: 3, backgroundColor: 'grey.50', borderRadius: 2 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                고객센터 안내
              </Typography>
              <Typography variant="body2" color="text.secondary">
                서비스 이용 중 문의사항이 있으신 경우 아래 연락처로 문의해주시기 바랍니다.
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>이메일:</strong> support@cube.com
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

export default TermsOfServicePage;
