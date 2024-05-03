import axios from 'axios';
import { apiBaseUrl } from './api-url';

export const initToken = async (data) => {
  return axios.post(`${apiBaseUrl}/start`, data);
};

export const submitDetails = async (data) => {
  const token = localStorage.getItem('unlock_access_token');

  return axios.post(`${apiBaseUrl}/company-search`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const submitVerification = async (data) => {
  const token = localStorage.getItem('unlock_access_token');

  return axios.post(`${apiBaseUrl}/verification`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const submitAdditionalInfo = async (data) => {
  const token = localStorage.getItem('unlock_access_token');

  return axios.post(`${apiBaseUrl}/additional-info`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const submitPrivacy = async (data) => {
  const token = localStorage.getItem('unlock_access_token');

  return axios.post(`${apiBaseUrl}/terms`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const submitTerms = async (data) => {
  const token = localStorage.getItem('unlock_access_token');

  return axios.post(`${apiBaseUrl}/company-search`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const searchCompanies = async (data) => {
  const token = localStorage.getItem('unlock_access_token');

  return axios.post(`${apiBaseUrl}/company-search-results`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const confirmCompany = async (data) => {
  const token = localStorage.getItem('unlock_access_token');

  return axios.post(`${apiBaseUrl}/confirm-company`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const selectCompany = async (data) => {
  const token = localStorage.getItem('unlock_access_token');

  return axios.post(`${apiBaseUrl}/credit-report`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const completeForm = async (data) => {
  const token = localStorage.getItem('unlock_access_token');

  return axios.post(`${apiBaseUrl}/completion`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getDirectors = async (data) => {
  const token = localStorage.getItem('unlock_access_token');

  return axios.post(`${apiBaseUrl}/directors`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const idCheck = async (data) => {
  const token = localStorage.getItem('unlock_access_token');

  return axios.post(`${apiBaseUrl}/id-check`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postBankAccount = async (data) => {
  const token = localStorage.getItem('unlock_access_token');

  return axios.post(`${apiBaseUrl}/bank-account`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const unlockCard = async (data) => {
  const token = localStorage.getItem('unlock_access_token');

  return axios.post(`${apiBaseUrl}/unlock-card`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const bankStatement = async (data) => {
  const token = localStorage.getItem('unlock_access_token');

  return axios.post(`${apiBaseUrl}/bank-statement`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postConfirmation = async (data) => {
  const token = localStorage.getItem('unlock_access_token');

  return axios.post(`${apiBaseUrl}/confirmation`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postCompletion = async (data) => {
  const token = localStorage.getItem('unlock_access_token');

  return axios.post(`${apiBaseUrl}/completion`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const extraOptions = async (data) => {
  const token = localStorage.getItem('unlock_access_token');

  return axios.post(`${apiBaseUrl}/extra-options`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postAbandon = async (data) => {
  const token = localStorage.getItem('unlock_access_token');

  return axios.post(`${apiBaseUrl}/abandon`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
