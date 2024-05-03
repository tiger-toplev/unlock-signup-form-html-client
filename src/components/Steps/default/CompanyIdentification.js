import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import jwt_decode from 'jwt-decode';

import StepButtons from '../../common/StepButtons';

import { UserContext } from '../../../context/UserContext';

/** services */
import { searchCompanies, selectCompany } from '../../../service/api';

const DesktopTable = ({ results, setSelectedCompany }) => {
  return (
    <table className="companies-table" style={{ fontSize: 'x-small' }}>
      <thead>
        <tr>
          <td className="select-col">&nbsp;&nbsp;</td>
          <td>Name</td>
          <td>ABN</td>
          <td>ACN</td>
          <td>Status</td>
          <td>Type</td>
          <td>Registered Date</td>
          <td>Trading Names</td>
          <td>Address</td>
        </tr>
      </thead>
      <tbody>
        {results.map((row, index) => {
          return (
            <tr key={row.ACN + index}>
              <td className="select-col">
                {/* {row.FailMessage ? <span data-tip={row.FailMessage}>unfit</span> : ''} */}
                <input
                  id={row.ACN}
                  name={'selectedCompany'}
                  type="radio"
                  value={row.ACN}
                  onClick={() => setSelectedCompany(row)}
                />
              </td>
              <td>{row.Name}</td>
              <td>{row.ABN}</td>
              <td>{row.ACN}</td>
              <td>{row.Status}</td>
              <td>{row.Type}</td>
              <td>{row.AsicRegistrationDate}</td>
              <td>{row.TradingNames}</td>
              <td>{row.Address}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const MobileTable = ({ results, setSelectedCompany }) => {
  return (
    <div className="mobile-table-result-container">
      {results.map((row, index) => {
        return (
          <div className="table-result-parent" key={row.ACN + index}>
            <div className="table-result-item row-name">
              <div className="result-key">
                <input
                  id={row.ACN}
                  name={'selectedCompany'}
                  type="radio"
                  value={row.ACN}
                  onClick={() => setSelectedCompany(row)}
                />
                <p>
                  <strong>Name</strong>
                </p>
              </div>
              <div className="result-value">
                <p>{row.Name}</p>
              </div>
            </div>

            <div className="table-result-item">
              <div className="result-key">
                <p>
                  <strong> ABN</strong>
                </p>
              </div>
              <div className="result-value">
                <p>{row.ABN}</p>
              </div>
            </div>

            <div className="table-result-item">
              <div className="result-key">
                <p>
                  <strong> ACN</strong>
                </p>
              </div>
              <div className="result-value">
                <p>{row.ACN}</p>
              </div>
            </div>

            <div className="table-result-item">
              <div className="result-key">
                <p>
                  <strong>Status</strong>
                </p>
              </div>
              <div className="result-value">
                <p>{row.Status}</p>
              </div>
            </div>

            <div className="table-result-item">
              <div className="result-key">
                <p>
                  <strong>Type</strong>
                </p>
              </div>
              <div className="result-value">
                <p>{row.Type}</p>
              </div>
            </div>

            <div className="table-result-item">
              <div className="result-key">
                <p>
                  <strong>Registered Date</strong>
                </p>
              </div>

              <div className="result-value">
                <p>{row.AsicRegistrationDate}</p>
              </div>
            </div>

            <div className="table-result-item">
              <div className="result-key">
                <p>
                  <strong>Trading Names</strong>
                </p>
              </div>
              <div className="result-value">
                <p>{row.TradingNames}</p>
              </div>
            </div>

            <div className="table-result-item">
              <div className="result-key">
                <p>
                  <strong>Address</strong>
                </p>
              </div>
              <div className="result-value">
                <p>{row.Address}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const CompanyIdentification = ({ handleGotoPrev, handleGotoNext }) => {
  const history = useHistory();
  const [results, setResults] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState();
  const [search, setSearch] = useState('');
  const [searchCounter, setSearchCounter] = useState(0);
  const { error, width, updateContext, activeIndexPage, renderPixel } = useContext(UserContext);

  useEffect(() => {
    ReactTooltip.rebuild();
  });

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSearch = async () => {
    updateContext({
      loading: true,
      customLoadingText: 'Searching for your business...',
      error: '',
    });
    // setResults( []);
    setSearchCounter(0);
    try {
      const res = await searchCompanies({
        name: search,
      });

      if (res && res.data) {
        setResults(res.data.Data ? res.data.Data : []);
        updateContext({
          content: res.data.Content,
          token: res.data.Token,
        });
        setSearchCounter(searchCounter + 1);
      }
    } catch (error) {
      console.log(error);
      if (error.response.data && error.response.data.error) {
        updateContext({ error: error.response.data.error });
        history.push('/error');
      }

      // setResults([
      //   {
      //     ABN: '',
      //     ACN: '550335469',
      //     Address: '28 BRIDLE RD MORWELL VIC 3840',
      //     AsicRegistrationDate: '',
      //     JsonString:
      //       '{"xero_contact_id":"","account_name":"COCA COLA SHOES PTY LTD","customer_id":"","abn":"","address":{"address_line_1":"28 BRIDLE RD","city":"MORWELL","region":"VIC","postal_code":"3840","country":"Australia"}}',
      //     Name: 'COCA COLA SHOES PTY LTD',
      //     Status: 'Registered',
      //     TradingNames: '',
      //     Type: 'Australian Proprietary Company',
      //     VedaBusinessNameID: '',
      //   },
      // ]);
    }
    updateContext({
      loading: false,
      customLoadingText: '',
    });
  };

  const handleContinue = async () => {
    console.log('handleContinue', selectedCompany);
    updateContext({
      companyData: selectedCompany,
    });
    if (!selectedCompany) {
      return false;
    }
    updateContext({
      loading: true,
      customLoadingText: 'Your UnLock Account Application is being processed...',
      error: '',
    });
    try {
      const res = await selectCompany({
        ACN: selectedCompany.ACN,
        VedaBusinessNameID: selectedCompany.VedaBusinessNameID,
        FullJson: JSON.stringify(selectedCompany),
      });

      if (res && res.data) {
        const isNextAdditionalStep = jwt_decode(res.data.Token)?.step == 'additional-info';
        updateContext({
          token: res.data.Token,
          content: res.data.Content,
          formPath: isNextAdditionalStep ? 'additionals' : 'default',
          activeIndexPage: isNextAdditionalStep ? 0 : activeIndexPage + 1,
          hasAdditionalStep: isNextAdditionalStep,
        });
      }
    } catch (error) {
      if (error.response.data && error.response.data.error) {
        updateContext({ error: error.response.data.error });
      }
    }
    updateContext({
      loading: false,
      customLoadingText: '',
    });
  };

  const renderPixelcodes = () => {
    return (
      <>
        <script
          language="JavaScript1.1"
          async
          src="//pixel.mathtag.com/event/js?mt_id=1611849&mt_adid=257068&mt_exem=&mt_excl=&v1=&v2=&v3=&s1=&s2=&s3="
        ></script>
      </>
    );
  };

  return (
    <div className="custom-steps company-identification">
      <div className="search-group">
        <input
          placeholder="Enter Company Name, ABN or ACN"
          id={'company'}
          name={'company'}
          value={search}
          onChange={(e) => handleChange(e)}
        />
        <button onClick={handleSearch} className="primary-btn">
          Search
        </button>
      </div>

      {searchCounter > 0 ? (
        <div className="search-results">
          <h3>Select your business from the results below</h3>

          {results.length > 0 ? (
            <>
              {width > 768 ? (
                <DesktopTable results={results} setSelectedCompany={setSelectedCompany} />
              ) : (
                <MobileTable results={results} setSelectedCompany={setSelectedCompany} />
              )}
            </>
          ) : (
            'We could not find any companies that match the search values. Please try another search.'
          )}
        </div>
      ) : (
        ''
      )}

      {error && <div className="error-section">{error}</div>}
      {results.length > 0 && (
        <StepButtons nextBtnText="Confirm" handleGotoNext={handleContinue} isNextDisabled={!selectedCompany} />
      )}
      <ReactTooltip
        className="tooltip"
        place="bottom"
        textColor="#fcfcfaff"
        backgroundColor="#423176ff"
        effect="solid"
        html={true}
      />
      {renderPixel && renderPixelcodes()}
    </div>
  );
};

export default CompanyIdentification;
