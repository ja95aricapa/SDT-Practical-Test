/**
 * Reports service for API calls related to reports.
 */
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api/reports';

export const createReport = async (report: any) => {
  return axios.post(API_BASE_URL, report);
};

export const getReports = async () => {
  return axios.get(API_BASE_URL);
};

export const getReportById = async (id: string) => {
  return axios.get(`${API_BASE_URL}/${id}`);
};

export const updateReport = async (id: string, report: any) => {
  return axios.put(`${API_BASE_URL}/${id}`, report);
};

export const deleteReport = async (id: string) => {
  return axios.delete(`${API_BASE_URL}/${id}`);
};