import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Project from './project';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';


const Projects = ({ props }) => {

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
    console.log('project items', props)
  }, [props])

return (
  <ThemeProvider theme={theme}> 
  <Stack padding={1} spacing={4}>
  {!window.accountId && 
  <Typography color="secondary" variant="h6" align="center">
              Login above to join the Block Party!
  </Typography>
  }
    {window.accountId && 
  <Typography color="secondary" variant="h6" align="center">
              Welcome {window.accountId}! Projects that are fully funded are below. Otherwise Proposals yet to reach their funding goal are under Proposals. Show them your support!
  </Typography>
  }
    <Grid>
       {props.map(proposal => (
        <Project key={proposal.token_id} project={proposal} />
      ))}  
    </Grid>
    </Stack>
  </ThemeProvider>
) 
}

export default Projects