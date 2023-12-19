import React, { useState, useEffect } from 'react';
import { useTable, useSortBy, useGlobalFilter } from 'react-table';
import { TextField, Button, Paper } from '@mui/material';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const Header = () => (
  <header>
    <h1>Attempting a test website</h1>
  </header>
);

// Table component
const DataTable = ({ columns, data }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    setGlobalFilter,
  } = useTable({ columns, data }, useGlobalFilter, useSortBy);

  return (
    <>
      <TextField
        id="search"
        label="Search"
        variant="outlined"
        value={state.globalFilter || ''}
        onChange={e => setGlobalFilter(e.target.value || undefined)}
      />
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  <span>
                    {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};


function App() {
  const [data, setData] = useState([]);
  const [url, setUrl] = useState('');
  const [user, setUser] = useState([]);
  const [profile, setProfile] = useState([]);

  const columns = [
    {
      Header: 'ISIN',
      accessor: 'isin',
      filter: 'text',
    },
    {
      Header: 'Symbol',
      accessor: 'symbol',
      filter: 'text',
      Cell: ({ row }) => {
        if (row.original.hasOwnProperty('bse_scrip')) {
          return row.original.bse_scrip;
        }
        return row.values.symbol;
      }
    },
    {
      Header: 'Coupon',
      accessor: 'coupon',
      filter: 'numeric',
      Cell: ({ value }) => {
        return `${(value * 100).toFixed(2)}%`;
      }
    },
    {
      Header: 'Yield',
      accessor: 'ytm',
      filter: 'numeric',
      Cell: ({ value }) => {
        return `${(value).toFixed(2)}%`;
      }
    },
    {
      Header: 'Face value',
      accessor: 'face_value',
      filter: 'numeric',
    },
    {
      Header: 'Dirty price',
      accessor: 'dirty_price',
      filter: 'numeric',
    },
    {
      Header: 'Clean price',
      accessor: 'clean_price',
      filter: 'numeric',
    },
    {
      Header: 'Payment frequency',
      accessor: 'payment_frequency',
      filter: 'numeric',
    },
    {
      Header: 'Time to maturity',
      accessor: 'time_to_maturity',
      filter: 'numeric',
      Cell: ({ row }) => {
        const otherDate = new Date(row.values.maturity_date);
        const today = new Date();
        const diffTime = Math.abs(otherDate - today);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
      }
    },
    {
      Header: 'Issue date',
      accessor: 'issue_date',
      filter: 'date',
    },
    {
      Header: 'Maturity date',
      accessor: 'maturity_date',
      filter: 'date',
    },
    {
      Header: 'Last interest payment date',
      accessor: 'last_interest_payment_date',
      filter: 'date',
    },
    {
      Header: 'Next interest payment date',
      accessor: 'next_interest_payment_date',
      filter: 'date',
    },
  ];

  const Dropdown = () => {
    const urlOptions = {
      '...': '...',
      'nse gsec': 'https://test-7agc.onrender.com/get-nse-gsec-data/',
      'nse corp bonds': 'https://test-7agc.onrender.com/get-nse-corp-bond-data/',
      'nse sgb': 'https://test-7agc.onrender.com/get-nse-sgb-data/',
      'bse gsec': 'https://test-7agc.onrender.com/get-bse-gsec-data/',
      'bse corp bonds': 'https://test-7agc.onrender.com/get-bse-corp-bond-data/',
      'bse sgb': 'https://test-7agc.onrender.com/get-bse-sgb-data/',
    };

    const [selectedValue, setSelectedValue] = useState('...');

    const handleChange = (event) => {
      setSelectedValue(event.target.value);
      if (event.target.value !== '...') {
        setUrl(urlOptions[event.target.value]);
      }
    };

    return (
      <select value={selectedValue} onChange={handleChange}>
        {Object.keys(urlOptions).map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  };


  const fetchData = async (url) => {
    const headers = { 'access_token': `${user.access_token}` }
    const response = await axios.get(url, { headers });
    setData(response.data);
  };

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => console.log('Login Failed:', error)
  });

  useEffect(
    () => {
      if (user) {
        axios
          .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: 'application/json'
            }
          })
          .then((res) => {
            setProfile(res.data);
          })
          .catch((err) => console.log(err));
      }
      if (url) {
        fetchData(url);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, url]
  );

  useEffect(
    () => {
      if (user) {
        axios
          .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: 'application/json'
            }
          })
          .then((res) => {
            setProfile(res.data);
          })
          .catch((err) => console.log(err));
      }
      if (url) {
        fetchData(url);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, url]
  );

  // log out function to log the user out of google and set the profile array to null
  const logOut = () => {
    googleLogout();
    setUser(null);
    setProfile(null);
    setUrl(null);
  };


  return (
    <div>
      {profile ? (
        <button onClick={logOut}>Log out</button>
      ) : (
        <button onClick={() => login()}>Sign in with Google 🚀 </button>
      )}
      <Paper>
        <Header />
        <Dropdown />
        <Button variant="contained" color="primary" onClick={fetchData}>
          Refresh
        </Button>
        <DataTable columns={columns} data={data} />
      </Paper>
    </div>
  );
}
export default App;