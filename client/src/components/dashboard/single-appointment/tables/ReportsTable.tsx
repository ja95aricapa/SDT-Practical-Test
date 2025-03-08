import React from 'react';
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
  Box
} from '@mui/material';
import { RouterLink } from '@/components/core/link';

export interface ReportData {
  _id: string;
  title: string;
  createdAt: string;
  type: string;
  // Puedes agregar más campos según lo necesites.
}

interface ReportsTableProps {
  reports: ReportData[];
  onDelete: (id: string) => void;
}

export const ReportsTable: React.FC<ReportsTableProps> = ({ reports, onDelete }) => {
  const [page, setPage] = React.useState<number>(0);
  const rowsPerPage = 10;

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const displayedReports = reports.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Type</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedReports.map((report) => (
              <TableRow key={report._id}>
                <TableCell>{report.title}</TableCell>
                <TableCell>{new Date(report.createdAt).toLocaleString()}</TableCell>
                <TableCell>{report.type}</TableCell>
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
        count={reports.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[rowsPerPage]}
      />
    </Paper>
  );
};