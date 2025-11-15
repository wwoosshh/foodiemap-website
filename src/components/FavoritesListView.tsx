import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Stack,
  Tooltip,
  Rating,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  LocationOn as LocationIcon,
  ExpandMore as ExpandMoreIcon,
  Folder as FolderIcon,
  FolderOpen as FolderOpenIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  DriveFileMove as MoveIcon,
} from '@mui/icons-material';
import { HeartFilledIcon, RestaurantIcon } from './icons/CustomIcons';
import { DEFAULT_RESTAURANT_IMAGE } from '../constants/images';
import { ApiService } from '../services/api';

interface FavoritesListViewProps {
  favorites: any[];
  onRemoveFavorite?: (id: string) => void;
  onEditMemo?: (id: string, memo: string) => void;
  onRefresh?: () => void;
}

const FavoritesListView: React.FC<FavoritesListViewProps> = ({
  favorites,
  onRemoveFavorite,
  onEditMemo,
  onRefresh,
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [expandedFolders, setExpandedFolders] = useState<string[]>(['all']);

  // 폴더 관리 다이얼로그
  const [folderDialogOpen, setFolderDialogOpen] = useState(false);
  const [folderDialogMode, setFolderDialogMode] = useState<'create' | 'rename'>('create');
  const [selectedFolder, setSelectedFolder] = useState<string>('');
  const [newFolderName, setNewFolderName] = useState('');

  // 폴더 이동 메뉴
  const [moveMenuAnchor, setMoveMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedFavorite, setSelectedFavorite] = useState<any>(null);

  // 폴더 목록 추출
  const folders = useMemo(() => {
    const folderMap = new Map<string, number>();
    favorites.forEach(fav => {
      const folderName = fav.folder_name || '미분류';
      folderMap.set(folderName, (folderMap.get(folderName) || 0) + 1);
    });
    return Array.from(folderMap.entries()).map(([name, count]) => ({ name, count }));
  }, [favorites]);

  // 폴더별로 그룹화
  const favoritesByFolder = useMemo(() => {
    const grouped = new Map<string, any[]>();
    favorites.forEach(fav => {
      const folderName = fav.folder_name || '미분류';
      if (!grouped.has(folderName)) {
        grouped.set(folderName, []);
      }
      grouped.get(folderName)!.push(fav);
    });

    // 각 그룹 내에서 정렬
    grouped.forEach((items, folder) => {
      items.sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return (a.restaurant?.name || '').localeCompare(b.restaurant?.name || '');
          case 'rating':
            return (b.restaurant?.rating || 0) - (a.restaurant?.rating || 0);
          case 'created_at':
          default:
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
      });
    });

    return grouped;
  }, [favorites, sortBy]);

  // 검색 필터링
  const filteredFavoritesByFolder = useMemo(() => {
    if (!searchTerm) return favoritesByFolder;

    const filtered = new Map<string, any[]>();
    favoritesByFolder.forEach((items, folder) => {
      const filteredItems = items.filter(fav =>
        fav.restaurant?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fav.memo?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (filteredItems.length > 0) {
        filtered.set(folder, filteredItems);
      }
    });
    return filtered;
  }, [favoritesByFolder, searchTerm]);

  // 통계
  const averageRating = useMemo(() => {
    if (favorites.length === 0) return 0;
    const sum = favorites.reduce((acc, fav) => acc + (fav.restaurant?.rating || 0), 0);
    return sum / favorites.length;
  }, [favorites]);

  const categoryStats = useMemo(() => {
    const stats: { [key: string]: number } = {};
    favorites.forEach(fav => {
      const categoryName = fav.restaurant?.categories?.name || '기타';
      stats[categoryName] = (stats[categoryName] || 0) + 1;
    });
    return Object.entries(stats).sort((a, b) => b[1] - a[1]);
  }, [favorites]);

  // 폴더 생성
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      alert('폴더 이름을 입력하세요.');
      return;
    }
    if (folders.some(f => f.name === newFolderName)) {
      alert('이미 존재하는 폴더 이름입니다.');
      return;
    }
    setFolderDialogOpen(false);
    setNewFolderName('');
    alert('폴더가 생성되었습니다. 즐겨찾기를 이동하여 폴더를 사용하세요.');
  };

  // 폴더 이름 변경
  const handleRenameFolder = async () => {
    if (!newFolderName.trim()) {
      alert('새 폴더 이름을 입력하세요.');
      return;
    }
    try {
      const response = await ApiService.renameFolder(selectedFolder, newFolderName);
      if (response.success) {
        alert(response.message);
        setFolderDialogOpen(false);
        setNewFolderName('');
        setSelectedFolder('');
        if (onRefresh) onRefresh();
      }
    } catch (error: any) {
      alert(error.userMessage || '폴더 이름 변경에 실패했습니다.');
    }
  };

  // 폴더 삭제
  const handleDeleteFolder = async (folderName: string) => {
    if (folderName === '미분류') {
      alert('미분류 폴더는 삭제할 수 없습니다.');
      return;
    }
    if (!window.confirm(`"${folderName}" 폴더를 삭제하시겠습니까?\n(폴더 내 즐겨찾기는 미분류로 이동됩니다)`)) {
      return;
    }
    try {
      const response = await ApiService.deleteFolder(folderName);
      if (response.success) {
        alert(response.message);
        if (onRefresh) onRefresh();
      }
    } catch (error: any) {
      alert(error.userMessage || '폴더 삭제에 실패했습니다.');
    }
  };

  // 즐겨찾기 폴더 이동
  const handleMoveToFolder = async (targetFolder: string | null) => {
    if (!selectedFavorite) return;
    try {
      const response = await ApiService.updateFavoriteFolder(selectedFavorite.id, targetFolder);
      if (response.success) {
        setMoveMenuAnchor(null);
        setSelectedFavorite(null);
        if (onRefresh) onRefresh();
      }
    } catch (error: any) {
      alert(error.userMessage || '폴더 이동에 실패했습니다.');
    }
  };

  return (
    <Box>
      {/* 통계 대시보드 */}
      <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <Typography variant="h6" gutterBottom fontWeight={600}>
          즐겨찾기 통계
        </Typography>
        <Stack direction="row" spacing={4} sx={{ mt: 2 }}>
          <Box>
            <Typography variant="h3" fontWeight={800}>
              {favorites.length}
            </Typography>
            <Typography variant="body2">전체 맛집</Typography>
          </Box>
          <Box>
            <Typography variant="h3" fontWeight={800}>
              {averageRating.toFixed(1)}
            </Typography>
            <Typography variant="body2">평균 평점</Typography>
          </Box>
          <Box>
            <Typography variant="h3" fontWeight={800}>
              {folders.length}
            </Typography>
            <Typography variant="body2">폴더 수</Typography>
          </Box>
        </Stack>

        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" gutterBottom>
            선호 카테고리 TOP 3
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            {categoryStats.slice(0, 3).map(([name, count], index) => (
              <Chip
                key={name}
                label={`${index + 1}. ${name} (${count})`}
                size="small"
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
              />
            ))}
          </Stack>
        </Box>
      </Paper>

      {/* 필터 및 검색 */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
          <TextField
            label="검색"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="맛집 이름, 메모 검색..."
            sx={{ flex: 1 }}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>정렬</InputLabel>
            <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} label="정렬">
              <MenuItem value="created_at">추가 순</MenuItem>
              <MenuItem value="name">이름 순</MenuItem>
              <MenuItem value="rating">평점 순</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setFolderDialogMode('create');
              setFolderDialogOpen(true);
            }}
          >
            폴더 생성
          </Button>
        </Stack>
      </Paper>

      {/* 폴더별 그룹화된 즐겨찾기 */}
      {Array.from(filteredFavoritesByFolder.entries()).map(([folderName, items]) => (
        <Accordion
          key={folderName}
          expanded={expandedFolders.includes(folderName)}
          onChange={() => {
            setExpandedFolders(prev =>
              prev.includes(folderName)
                ? prev.filter(f => f !== folderName)
                : [...prev, folderName]
            );
          }}
          sx={{ mb: 2 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
              {expandedFolders.includes(folderName) ? (
                <FolderOpenIcon color="primary" />
              ) : (
                <FolderIcon color="action" />
              )}
              <Typography variant="h6" fontWeight={600}>
                {folderName}
              </Typography>
              <Chip label={`${items.length}개`} size="small" />
              {folderName !== '미분류' && (
                <Box sx={{ ml: 'auto' }}>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFolder(folderName);
                      setNewFolderName(folderName);
                      setFolderDialogMode('rename');
                      setFolderDialogOpen(true);
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteFolder(folderName);
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    <TableCell width="40%"><strong>맛집 정보</strong></TableCell>
                    <TableCell width="15%" align="center"><strong>평점</strong></TableCell>
                    <TableCell width="15%"><strong>카테고리</strong></TableCell>
                    <TableCell width="20%"><strong>메모</strong></TableCell>
                    <TableCell width="10%" align="center"><strong>관리</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((fav) => (
                    <TableRow
                      key={fav.id}
                      hover
                      sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                    >
                      <TableCell onClick={() => navigate(`/restaurants/${fav.restaurant_id}`)}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar
                            src={fav.restaurant?.images?.[0] || DEFAULT_RESTAURANT_IMAGE}
                            variant="rounded"
                            sx={{ width: 60, height: 60 }}
                          >
                            <RestaurantIcon />
                          </Avatar>
                          <Box>
                            <Typography variant="body1" fontWeight={600}>
                              {fav.restaurant?.name || '알 수 없음'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                              <LocationIcon sx={{ fontSize: 14 }} />
                              {fav.restaurant?.address || '-'}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <Rating value={fav.restaurant?.rating || 0} readOnly precision={0.1} size="small" />
                          <Typography variant="body2" fontWeight={600}>
                            {(fav.restaurant?.rating || 0).toFixed(1)}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={fav.restaurant?.categories?.name || '기타'}
                          size="small"
                          sx={{
                            bgcolor: fav.restaurant?.categories?.color || '#ccc',
                            color: 'white',
                            fontWeight: 600,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                          {fav.memo || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={0.5} justifyContent="center">
                          <Tooltip title="폴더 이동">
                            <IconButton size="small" onClick={(e) => {
                              e.stopPropagation();
                              setSelectedFavorite(fav);
                              setMoveMenuAnchor(e.currentTarget);
                            }}>
                              <MoveIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="메모 수정">
                            <IconButton size="small" onClick={(e) => {
                              e.stopPropagation();
                              const newMemo = prompt('메모를 입력하세요', fav.memo || '');
                              if (newMemo !== null && onEditMemo) {
                                onEditMemo(fav.id, newMemo);
                              }
                            }}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="삭제">
                            <IconButton size="small" color="error" onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm('즐겨찾기에서 제거하시겠습니까?') && onRemoveFavorite) {
                                onRemoveFavorite(fav.id);
                              }
                            }}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
      ))}

      {/* 폴더 생성/수정 다이얼로그 */}
      <Dialog open={folderDialogOpen} onClose={() => setFolderDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {folderDialogMode === 'create' ? '새 폴더 만들기' : '폴더 이름 변경'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="폴더 이름"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFolderDialogOpen(false)}>취소</Button>
          <Button
            variant="contained"
            onClick={folderDialogMode === 'create' ? handleCreateFolder : handleRenameFolder}
          >
            {folderDialogMode === 'create' ? '생성' : '변경'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 폴더 이동 메뉴 */}
      <Menu
        anchorEl={moveMenuAnchor}
        open={Boolean(moveMenuAnchor)}
        onClose={() => setMoveMenuAnchor(null)}
      >
        <MenuItem onClick={() => handleMoveToFolder(null)}>
          <FolderIcon sx={{ mr: 1 }} /> 미분류
        </MenuItem>
        {folders.filter(f => f.name !== '미분류').map(folder => (
          <MenuItem key={folder.name} onClick={() => handleMoveToFolder(folder.name)}>
            <FolderIcon sx={{ mr: 1 }} /> {folder.name}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default FavoritesListView;
