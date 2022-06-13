import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Proposal from './proposal';
import Stack from '@mui/material/Stack';
import { createTheme, ThemeProvider } from '@mui/material/styles';


const Proposals = ({ props }) => {

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

  useEffect(() => {
    console.log('proposal items', props)
  }, [props])

return (
  <ThemeProvider theme={theme}> 
  <Stack padding={1} spacing={4}>
    {window.accountId && <Button variant="contained" color="secondary" href='/NewProposal'>Create A New Proposal</Button>}
    <Grid>
       {props.map(proposal => (
        <Proposal key={proposal.token_id} proposal={proposal} />
      ))}  
    </Grid>
    </Stack>
  </ThemeProvider>
) 
}

export default Proposals