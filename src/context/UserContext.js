import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import axios from 'axios';

/**
 * @typedef {object} DecodedToken
 * @property {string} dealId
 * @property {string} FailMessage
 */

/**
 * @typedef {object} SelectedCompany
 * @property {string} ACN
 * @property {string} VedaBusinessNameID
 */

/**
 * @typedef {('default' | 'businessCheckFailed' | 'creditCheckFailed')} FormPath
 */

/**
 * @typedef {object} Director
 * @property {string} Name
 * @property {string} DateOfBirth
 * @property {string} Address
 */

/**
 * @callback UpdateContext
 * @param {UserContextUpdate} data
 * @returns void
 */

/**
 * @typedef {object} UserContext
 * @property {FormPath} formPath
 * @property {boolean} loading
 * @property {string} customLoadingText
 * @property {string} token
 * @property {(DecodedToken | null)} decodedToken
 * @property {number} width
 * @property {SelectedCompany} companyData
 * @property {Director[]} directors
 * @property {string} content
 * @property {string} dealId
 * @property {string} error
 * @property {(number | null)} activeIndexPage
 * @property {UpdateContext} updateContext
 * @property {boolean} isReferred
 * @property {boolean} renderPixel
 */

/**
  @type {UserContext}
 */
const defaultContext = {
  formPath: 'default',
  loading: false,
  customLoadingText: '',
  token: '',
  decodedToken: null,
  width: window.innerWidth,
  companyData: {},
  directors: [
    {
      Name: 'JOANNE  SANTOS',
      DateOfBirth: '1972-06-22',
      Address: 'MINTO NSW 2566',
    },
    {
      Name: 'JOANNE  SANTOS 2',
      DateOfBirth: '1942-06-22',
      Address: 'MINTO NSW 2566',
    },
  ],
  content: '',
  dealId: '',
  error: '',
  activeIndexPage: null,
  hasAdditionalStep: false,
  formData: {},
  isReferred: false,
  renderPixel: false,
  updateContext: (update) => undefined,
};

export const UserContext = React.createContext(defaultContext);

export default function UserProvider({ children }) {
  const [context, setContext] = useState({
    ...defaultContext,
    /** @type {(update: UserContextUpdate) => void } */
    updateContext: (update) => setContext((c) => ({ ...c, ...update })),
  });
  const { updateContext } = context;

  const history = useHistory();

  useEffect(() => {
    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        updateContext({ loading: false });
        console.log(error, error.response);
        if (!error.response) {
          history.push('/server-error');
        }
        return Promise.reject(error);
      }
    );
  }, []);

  /** For Rendering different components based on breakpoint */
  useEffect(() => {
    function handleResize() {
      updateContext({ width: window.innerWidth });
    }

    window.addEventListener('resize', handleResize);

    return (_) => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    // Store current token to local storage
    localStorage.setItem('unlock_access_token', context.token);
  }, [context.token]);

  return <UserContext.Provider value={context}>{children}</UserContext.Provider>;
}
