import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { UserContext } from '../../../context/UserContext';

function hasDuplicates(array) {
  return new Set(array).size !== array.length;
}

/** services */
import { postBankAccount } from '../../../service/api';

const DirectorsList = ({ handleGotoNext, validateEmail }) => {
  const history = useHistory();
  const { directors, hasAdditionalStep: readOnly, error, updateContext } = useContext(UserContext);
  const [ids, setIds] = useState(directors && directors.length <= 2 ? [...Array(directors.length).keys()] : []);

  const [data, setData] = useState(
    directors && directors.length
      ? new Array(directors.length).fill({
          email: readOnly ? directors[0].emailAddress : '',
        })
      : []
  );

  const [dataError, setDataError] = useState(
    new Array(directors.length).fill({
      email: '',
    })
  );

  const handleSubmit = async () => {
    if (directors.length > 1 && ids.length <= 1) {
      updateContext({ error: 'You must select at least 2 Directors to be sent the UnLock Credit Terms' });
      return;
    }

    updateContext({ error: '' });
    let isValid = true;
    ids.forEach((idx) => {
      const r = validateInput(data[idx]['email'], 'email', idx);
      if (!r) {
        isValid = false;
      }
    });
    if (!isValid) {
      // Validation error
      return;
    }

    if (hasDuplicates(ids.map((idx) => data[idx]?.email))) {
      // Check email duplicates
      updateContext({ error: 'There is duplicate email address' });
      return;
    }
    updateContext({ loading: true });
    try {
      const res = await postBankAccount({
        directors: ids,
        emails: ids.map((idx) => data[idx]?.email),
      });
      if (res && res.data) {
        updateContext({ token: res.data.Token, content: res.data.Content });
      }
    } catch (error) {
      if (error.response.data && error.response.data.error) {
        updateContext({ error: error.response.data.error });
        history.push('/error');
      }
    }
    updateContext({ loading: false });
    handleGotoNext();
  };

  const handleSelectDirector = (e) => {
    const index = parseInt(e.target.value);
    if (ids.includes(index)) {
      setIds(ids.filter((id) => id != index));
    } else {
      setIds([...ids, index]);
    }
  };

  // Handler for form field change
  const handleChange = (e, index) => {
    setData(
      data.map((d, i) => {
        return i == index
          ? {
              ...d,
              [e.target.name]: e.target.value,
            }
          : d;
      })
    );
  };

  // Checks form field input validation
  const validateInput = (value, name, index) => {
    if (!value || value == '') {
      setDataError((dataError) =>
        dataError.map((de, i) => {
          return i == index
            ? {
                ...de,
                [name]: 'This is a required field',
              }
            : de;
        })
      );

      return false;
    }
    const emailValid = validateEmail(value);
    if (!emailValid) {
      setDataError((dataError) =>
        dataError.map((de, i) => {
          return i == index
            ? {
                ...de,
                [name]: 'Invalid email address',
              }
            : de;
        })
      );
      return false;
    }
    setDataError((dataError) =>
      dataError.map((de, i) => {
        return i == index
          ? {
              ...de,
              [name]: '',
            }
          : de;
      })
    );
    return true;
  };

  return (
    <div className="custom-steps director-list">
      <div className="search-results">
        {directors.map((row, index) => {
          return (
            <div key={index} className="company-info director-detail">
              <input
                id={index}
                name={'selectedDirector'}
                type="checkbox"
                value={index}
                disabled={readOnly}
                checked={ids.includes(index)}
                onChange={handleSelectDirector}
              />
              <div className="director-info">
                <span className="name">
                  {readOnly ? row.GivenName + ' ' + row.FamilyName : row.Name}
                  <br />
                  {row.Address}
                </span>
                <input
                  value={data[index]['email']}
                  name={'email'}
                  autoComplete="off"
                  disabled={!ids.includes(index)}
                  onChange={(e) => handleChange(e, index)}
                  onBlur={(e) => validateInput(data[index]['email'], 'email', index)}
                  className="email-input"
                  placeholder="Email"
                />
                {dataError[index]['email'] && <p className="error-text">{dataError[index]['email']}</p>}
              </div>
            </div>
          );
        })}
      </div>
      {error && <p className="error-text">{error}</p>}
      <div className="bottom-section">
        <span className="please-nominate-block">
          A link is sent to sign UnLock Credit Terms.
        <br />
        <br />
        </span>

        <button onClick={handleSubmit} disabled={ids.length == 0} className="primary-btn">
          Submit
        </button>
      </div>
    </div>
  );
};

export default DirectorsList;
