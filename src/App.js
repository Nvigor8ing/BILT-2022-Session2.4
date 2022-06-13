import 'regenerator-runtime/runtime'
import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { login, logout } from './utils'
import { utils } from 'near-api-js';
import './global.css'
import blockpartyLogo from './assets/logo-block-party32-white.svg'

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// components
import Projects from "./components/Projects";
import Proposals from "./components/proposals";
import NewProposal from "./components/NewProposal";

import getConfig from './config'
const { networkId } = getConfig(process.env.NODE_ENV || 'development')

const theme = createTheme({
  palette: {
    primary: {
      // This is pink
      main: '#11cb5f',
    },
    secondary: {
      // This is pink
      main: '#EC008C',
    },
  },
});

const App = () => {
	const [fetching, setFetching] = useState(false);
	const [proposals, setProposals] = useState([]);
  const [projects, setProjects] = useState([]);
	const [amount, setAmount] = useState('');
	const [filter, setFilter] = useState(1);

  const formatNearAmount = (amount) => {
    let formatted = amount.toLocaleString('fullwide', { useGrouping: false })
    formatted = utils.format.formatNearAmount(formatted)
    return Math.floor(formatted * 100) / 100
  }

  useEffect(() => {
    const recieveProposals = async () => {
      const supply = await contract.nft_total_supply({
          from_index: "0",
          limit: 100
        });
        if (supply >= 1) {
          const results = await contract.nft_tokens({
            from_index: "0",
            limit: parseInt(supply)});
            
            for(var i=0; i<results.length;++i) {
              results[i].metadata.funded = 0;
                for( let [key, value] of Object.entries (results[i].supporters)) {
                  let fund = formatNearAmount(value)
                  results[i].metadata.funded += fund
                }
            }
            const re = /(?:\"|\')(?<key>[\w\d]+)(?:\"|\')(?:\:\s*)(?:\"|\')?(?<value>[\w\s-]*)(?:\"|\')?/
            for (var i = 0; i < results.length; ++i) {
              if (re.exec(results[i].metadata.extra) !== null) {
                var parsed = [JSON.parse(results[i].metadata.extra)]
                results[i].metadata.extra = parsed
              }
            }
            for(var i=0; i<results.length;++i) {
              if (results[i].metadata.funded >= results[i].metadata.funding_goal) {
                setProjects(oldProjects => [...oldProjects, results[i]])
              } else {
                setProposals(oldProposals => [...oldProposals, results[i]])
              }
            }
          }
    }
    recieveProposals()
  }, [])

  return (
    <Router>
    <Box sx={{ flexGrow: 1 }}>
    <ThemeProvider theme={theme}>
      <AppBar position="static" color="secondary">
        <Toolbar>
          <Typography variant="h7" component="div" sx={{ flexGrow: 1 }}>
            <div className = "logo">
            <img src={blockpartyLogo} alt="Block Party Logo" width="88px"/>
          </div>
          </Typography>
          <Button disabled = {window.accountId === "" ? true : false} color="inherit" href='/'>Projects</Button>
          <Button disabled = {window.accountId === "" ? true : false} color="inherit" href='/Proposals'>Proposals</Button>
          <Button color="inherit" onClick={window.accountId === "" ? login : logout}>
           {window.accountId ==="" ? "Log In" : "Log Out"}
           </Button>
        </Toolbar>
      </AppBar>
      </ThemeProvider>
    </Box>
      <Routes>
        <Route path='/' element={<Projects props = {projects}/>}/>
        <Route path='/NewProposal' element={<NewProposal />}/>
        <Route path='/Proposals' element={<Proposals props = {proposals} />}/>
      </Routes>
    </Router>
  );
}
export default App
