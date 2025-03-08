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
  InputAdornment
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

  // Ordena los reportes de mayor a menor (por createdAt)
  const sortedReports = useMemo(() => {
    return [...reports].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [reports]);

  // Filtra por título (puedes ampliar este filtro según necesites)
  const filteredReports = useMemo(() => {
    if (!filterText.trim()) return sortedReports;
    return sortedReports.filter(report =>
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
            )
          }}
        />
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Created At</TableCell>
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