import React from 'react';
import { Box, Container, Typography, Card, CardContent, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { Info, Policy, ContactSupport, Code, Palette, Security } from '@mui/icons-material';

interface InfoCubeFaceProps {
  onNavigate: (face: string) => void;
}

const InfoCubeFace: React.FC<InfoCubeFaceProps> = ({ onNavigate }) => {
  const infoSections = [
    {
      icon: <Info />,
      title: '서비스 소개',
      content: 'Cube는 3D 큐브 인터페이스로 맛집을 탐색하는 새로운 경험을 제공합니다.',
    },
    {
      icon: <Palette />,
      title: '사용 방법',
      content: '화면을 회전하며 카테고리, 맛집 목록, 프로필, 이벤트 등 다양한 페이지를 탐색하세요.',
    },
    {
      icon: <Policy />,
      title: '이용 약관',
      content: '서비스 이용 시 준수해야 할 약관 및 정책을 확인하세요.',
    },
    {
      icon: <Security />,
      title: '개인정보 처리방침',
      content: '사용자의 개인정보 수집 및 처리에 대한 정책입니다.',
    },
    {
      icon: <ContactSupport />,
      title: '고객 지원',
      content: '문의사항이 있으시면 언제든지 연락주세요.',
    },
  ];

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        overflow: 'auto',
        backgroundColor: '#fafafa',
      }}
    >
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* 헤더 */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h3" gutterBottom fontWeight={700}>
            Cube
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            3D 큐브 맛집 탐색 서비스
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Version 1.0.0
          </Typography>
        </Box>

        {/* 정보 카드 */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <List>
              {infoSections.map((section, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <Divider />}
                  <ListItem
                    sx={{
                      py: 3,
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                      '&:hover': {
                        backgroundColor: '#f5f5f5',
                      },
                    }}
                  >
                    <ListItemIcon sx={{ color: 'primary.main' }}>
                      {section.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="h6" fontWeight={600}>
                          {section.title}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          {section.content}
                        </Typography>
                      }
                    />
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>

        {/* 기술 스택 */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Code sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" fontWeight={600}>
                기술 스택
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {[
                'React',
                'TypeScript',
                'Material-UI',
                'Node.js',
                'Express',
                'Supabase',
                'PostgreSQL',
              ].map((tech) => (
                <Box
                  key={tech}
                  sx={{
                    px: 2,
                    py: 1,
                    backgroundColor: 'primary.light',
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="body2" fontWeight={500}>
                    {tech}
                  </Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>

        {/* 푸터 */}
        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Copyright 2025 Cube. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default InfoCubeFace;
