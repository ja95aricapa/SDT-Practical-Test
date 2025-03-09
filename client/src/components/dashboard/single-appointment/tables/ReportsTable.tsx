/**
 * ReportsTable component displays reports in a table format with pagination,
 * filtering, and sortable columns. Users can click on column headers to change sorting.
 */
import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Button,
  Box,
  TextField,
  InputAdornment,
} from '@mui/material';
import { RouterLink } from '@/components/core/link';

export interface ReportData {
  _id: string;
  title: string;
  createdAt: string;
  type: string;
  user: string;
}

interface ReportsTableProps {
  reports: ReportData[];
  onDelete: (id: string) => void;
}

export const ReportsTable: React.FC<ReportsTableProps> = ({ reports, onDelete }) => {
  const [page, setPage] = useState<number>(0);
  const rowsPerPage = 10;
  const [filterText, setFilterText] = useState<string>('');
  const [orderBy, setOrderBy] = useState<keyof ReportData>('createdAt');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');

  // Sort reports based on selected column and order
  const sortedReports = useMemo(() => {
    return [...reports].sort((a, b) => {
      const aVal = a[orderBy];
      const bVal = b[orderBy];
      let comparison = 0;
      if (orderBy === 'createdAt') {
        comparison = new Date(aVal).getTime() - new Date(bVal).getTime();
      } else {
        comparison = aVal.localeCompare(bVal);
      }
      return order === 'asc' ? comparison : -comparison;
    });
  }, [reports, orderBy, order]);

  // Filter reports by title
  const filteredReports = useMemo(() => {
    if (!filterText.trim()) return sortedReports;
    return sortedReports.filter((report) =>
      report.title.toLowerCase().includes(filterText.toLowerCase())
    );
  }, [filterText, sortedReports]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const displayedReports = filteredReports.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Toggle sorting for a column
  const handleSort = (column: keyof ReportData) => {
    if (orderBy === column) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setOrderBy(column);
      setOrder('asc');
    }
  };

  return (
    <Paper>
      <Box p={2}>
        <TextField
          label="Filter by Title"
          variant="outlined"
          fullWidth
          value={filterText}
          onChange={(e) => {
            setFilterText(e.target.value);
            setPage(0);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                🔍
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {/* Clicking headers changes sorting */}
              <TableCell onClick={() => handleSort('_id')} style={{ cursor: 'pointer' }}>
                Id {orderBy === '_id' ? (order === 'asc' ? '▲' : '▼') : ''}
              </TableCell>
              <TableCell onClick={() => handleSort('user')} style={{ cursor: 'pointer' }}>
                User {orderBy === 'user' ? (order === 'asc' ? '▲' : '▼') : ''}
              </TableCell>
              <TableCell onClick={() => handleSort('title')} style={{ cursor: 'pointer' }}>
                Title {orderBy === 'title' ? (order === 'asc' ? '▲' : '▼') : ''}
              </TableCell>
              <TableCell onClick={() => handleSort('type')} style={{ cursor: 'pointer' }}>
                Type {orderBy === 'type' ? (order === 'asc' ? '▲' : '▼') : ''}
              </TableCell>
              <TableCell onClick={() => handleSort('createdAt')} style={{ cursor: 'pointer' }}>
                Created At {orderBy === 'createdAt' ? (order === 'asc' ? '▲' : '▼') : ''}
              </TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedReports.map((report) => (
              <TableRow key={report._id}>
                <TableCell>{report._id}</TableCell>
                <TableCell>{report.user}</TableCell>
                <TableCell>{report.title}</TableCell>
                <TableCell>{report.type}</TableCell>
                <TableCell>{new Date(report.createdAt).toLocaleString()}</TableCell>
                <TableCell align="center">
                  <Box display="flex" justifyContent="center" gap={1}>
                    <Button component={RouterLink} href={`/report/${report._id}`} variant="outlined">
                      View / Edit
                    </Button>
                    <Button variant="contained" color="error" onClick={() => onDelete(report._id)}>
                      Delete
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={filteredReports.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[rowsPerPage]}
      />
    </Paper>
  );
};