
import React, { useEffect, useState } from 'react'
import { utils } from 'near-api-js';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import { createTheme, ThemeProvider } from '@mui/material/styles';


export default function Proposal({ proposal }) {

  const [selectedToken, setSelectedToken] = React.useState();
  const [hideSupport, sethideSupport] = React.useState(false);

  const formatNearAmount = (amount) => {
    let formatted = amount.toLocaleString('fullwide', { useGrouping: false })
    formatted = utils.format.formatNearAmount(formatted)
    return Math.floor(formatted * 100) / 100 + " N"
  }

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

  return (
    <ThemeProvider theme={theme}>
    <Box sx={{ minWidth: 275 }}>
      <Card variant="outlined">
        <React.Fragment>
          <CardContent>
            <Typography variant="h5">
              {proposal.metadata.title}
            </Typography>
            <Typography variant="h6" component="div">
            {proposal.metadata.description}
            </Typography>
            <Typography variant="body2">
            Token: {proposal.token_id}
            </Typography>
            <Typography variant="body2">
            Owner: {proposal.owner_id}
            </Typography>
            <Typography variant="body2">
            Address: {proposal.metadata.street_address}
            </Typography>
            <Typography variant="body2">
            Funding: {(proposal.metadata.funding_total) + " N"}
            </Typography>
            <Typography variant="body2">
            Funding Goal: {(proposal.metadata.funding_goal) + " N"}
            </Typography>
            <Typography variant="body2">
            Funding Min: {(proposal.metadata.funding_min_deposit) + " N"}
            </Typography>
            <Stack spacing={4}>
            <Typography variant="body2">
              Current Funding: {Object.entries(proposal.supporters).map(([key, value]) => (
                <div className="item" key={key}>
                  {key}:  {formatNearAmount(value)}
                </div>
              )
              )}
            </Typography>
            {window.accountId && SupProposal(proposal.token_id, proposal.metadata.funding_min_deposit)}
            </Stack>
          </CardContent>
        </React.Fragment>
      </Card>
    </Box>
    </ThemeProvider>
  );
}

const SupProposal = (token, funding_min) => {

  const [support, setSupport] = React.useState("20000000000000000000000000");

  function valuetext(value) {
    return `${value}Yocto`;
  }

  const supportProposal = async () => {
    const supportProposal = await contract.donation({
        token_id: `${token}`,
        supporter_id: `${window.accountId}`
      },
      "300000000000000", `${support}`
      );
  }

    return (
                <Box>
                  <Stack spacing={2}>
                    <Slider
                        color="secondary"
                        aria-label="Funding Goal"
                        defaultValue={20}
                        getAriaValueText={valuetext}
                        valueLabelDisplay="on"
                        step={1}
                        min={funding_min}
                        max={50}
                        onChange={(e) => setSupport(utils.format.parseNearAmount(e.target.value.toString()))}
                    />
                    <Typography align="center" variant="caption" gutterBottom component="div">
                        Show your support {window.accountId} by selecting above how much NEAR you want to donate
                    </Typography>
                <Button color="secondary" variant="outlined" onClick= {() => supportProposal()}>Show your Support</Button>
                </Stack>
                </Box>
    )
}
