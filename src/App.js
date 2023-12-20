import React, { useState, useEffect } from 'react';
import { Button, Paper } from '@mui/material';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import DataTable from './components/DataTable';
import Dropdown from './components/Dropdown';
import { columns } from './components/DataTable';


function App() {
  const [data, setData] = useState([]);
  const [url, setUrl] = useState('');
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [selectedValue, setSelectedValue] = useState('');

  const fetchData = async () => {
    if (!!url && url !== '...') {
      const headers = { 'access_token': `${user.access_token}` }
      const response = await axios.get(url, { headers });
      setData(response.data);
    }
  };

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => console.log('Login Failed:', error)
  });

  useEffect(
    () => {
      if (user && (profile == null)) {
        axios
          .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: 'application/json'
            }
          })
          .then((res) => {
            console.log(res);
            setProfile(res.data);
          })
          .catch((err) => console.log(err));
      }
      if (url !== '...') {
        fetchData();
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
    setSelectedValue('');
  };


  return (
    <div className="App">
      <Paper>
        {profile ? (
          <button onClick={logOut}>Log out</button>
        ) : (
          <button onClick={() => login()}>Sign in with Google 🚀 </button>
        )}
        <Dropdown selectedValue={selectedValue} setSelectedValue={setSelectedValue} setUrl={setUrl} />
        <Button variant="contained" color="primary" onClick={fetchData} sx={{ m: '1rem' }} size='small'>
          Refresh
        </Button>
        <DataTable columns={columns} data={data} width="100%" />
      </Paper>
    </div>
  );
}

export default App;
