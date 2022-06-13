import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import { utils } from 'near-api-js';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { Stack } from '@mui/material';
import Slider from '@mui/material/Slider';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';

function valuetext(value) {
    return `${value}Yocto`;
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

const NewProposal = (props) => {

    const [value, setValue] = React.useState(new Date('2022-08-18T21:11:54'));
    const [nextToken, setNextToken] = React.useState(1);

    const [title, setTitle] = React.useState('Skate Park');
    const [description, setDescription] = React.useState('Skate park for everybody to enjoy');
    const [address, setAddress] = React.useState('1234 Pueblo Lane, Build City');
    const [fundingMin, setFundingMin] = React.useState("5000000000000000000000000");
    const [funding, setFunding] = React.useState("30000000000000000000000000");

    const handleChange = (newValue) => {
      setValue(newValue);
    };

    const newProposal = async () => {
        const supply = await contract.nft_total_supply({
            from_index: "0",
            limit: 1000
          })

        const newProposal = await contract.nft_mint({
            token_id: `token-${supply}`,
            metadata: {
              title: `${title}`,
              description: `${description}`,
              street_address: `${address}`,
              funding_min_deposit: (fundingMin),
              funding_goal: (funding),
            },
            receiver_id: `${window.accountId}`
          },
          "300000000000000", "3000000000000000000000000"
          );
      }
  
    return (
        <Box sx={{ width: '100%' }}>
            <Stack padding={2} spacing={1}>
            <ThemeProvider theme={theme}>
                <TextField
                    helperText="Name your proposal"
                    id="demo-helper-text-misaligned"
                    label="Skate Park etc."
                    onChange={(e) => setTitle(e.target.value)}
                />
                <TextField
                    helperText="Describe the proposal"
                    id="demo-helper-text-misaligned"
                    label="Skate park for everybody to enjoy etc."
                    onChange={(e) => setDescription(e.target.value)}
                />
                <TextField
                    helperText="Street Address"
                    id="demo-helper-text-misaligned"
                    label="1234 Pueblo Lane, Build City"
                    onChange={(e) => setAddress(e.target.value)}
                />
            <Stack padding={2} spacing={2}>
                <Box>
                    <Slider
                        color="secondary"
                        aria-label="Min. Deposit"
                        defaultValue={5}
                        getAriaValueText={valuetext}
                        valueLabelDisplay="on"
                        step={1}
                        marks
                        min={1}
                        max={10}
                        onChange={(e) => setFundingMin(utils.format.parseNearAmount(e.target.value.toString()))}
                    />
                    <Typography variant="caption" gutterBottom component="div">
                        Select a minimum deposit
                    </Typography>
                </Box>
                <Box>
                    <Slider
                        color="secondary"
                        aria-label="Funding Goal"
                        defaultValue={30}
                        getAriaValueText={valuetext}
                        valueLabelDisplay="on"
                        step={5}
                        marks
                        min={5}
                        max={50}
                        onChange={(e) => setFunding(utils.format.parseNearAmount(e.target.value.toString()))}
                    />
                    <Typography variant="caption" gutterBottom component="div">
                        Select funding goal
                    </Typography>
                </Box>
                </Stack>
                <Button color="secondary" onClick= {() => newProposal()} variant="outlined">Create Proposal!</Button>
                </ThemeProvider>
            </Stack>
        </Box>
    )
}

export default NewProposal;