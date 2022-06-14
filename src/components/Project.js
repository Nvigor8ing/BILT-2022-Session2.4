
import React, { useEffect, useState } from 'react'
import { utils } from 'near-api-js';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import Slider from '@mui/material/Slider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { createTheme, ThemeProvider } from '@mui/material/styles';


export default function Project({ project }) {

  const [expandedLead, setExpandedLead] = React.useState(false);
  const [expandedTeam, setExpandedTeam] = React.useState(false);

  const handleExpandLeadClick = () => {
    setExpandedLead(!expandedLead);
  };

  const handleExpandTeamClick = () => {
    setExpandedTeam(!expandedTeam);
  };

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

  const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
  })(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  }));

  const formatNearAmount = (amount) => {
    let formatted = amount.toLocaleString('fullwide', { useGrouping: false })
    formatted = utils.format.formatNearAmount(formatted)
    return Math.floor(formatted * 100) / 100
  }

  const formatPercentageAmount = (amount) => {
    return (amount / 10000) * 100 + "%"
  }

  function maxV(obj) {
    let output = Object.entries(obj).reduce(
      (max, [key, val]) =>
        max[1] > val ? max : [key, val], [null, -1]
    )
    return output;
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minWidth: 275 }}>
        <Card variant="outlined">
          <React.Fragment>
            <CardContent>
              <Typography variant="h5">
                {project.metadata.title}
              </Typography>
              <Typography style={{ fontWeight: 600 }} variant="body2" component="div">
                Description:
              </Typography>
              <Typography variant="body2">
                {project.metadata.description}
              </Typography>
              <Typography style={{ fontWeight: 600 }} variant="body2">
                Owner:
              </Typography>
              <Typography variant="body2">
                {project.owner_id}
              </Typography>
              <Typography style={{ fontWeight: 600 }} variant="body2">
                Address:
              </Typography>
              <Typography variant="body2">
                {project.metadata.street_address}
              </Typography>
              <Typography style={{ fontWeight: 600 }} variant="body2">
                Funding Total:
              </Typography>
              <Typography variant="body2">
                {project.metadata.funding_total + " N"}
              </Typography>
              {project.metadata.phase &&
                <Typography style={{ fontWeight: 600 }} variant="h6" component="div">
                  Current Project Phase:
                </Typography>}
              {project.metadata.phase && <Typography variant="h6" component="div">
                {project.metadata.phase[0].name}
                {project.metadata.phase && <Typography style={{ fontWeight: 600 }} variant="h6">
                {project.metadata.phase[0].scope} %
              </Typography>}
                {project.metadata.phase && <Typography style={{ fontWeight: 600 }} variant="body2">
                Start Date:
              </Typography>}
              {project.metadata.phase && <Typography variant="body2"> 
                {project.metadata.phase[0].start_date}
              </Typography>}
              {project.metadata.phase && <Typography style={{ fontWeight: 600 }} variant="body2">
                Due Date:
              </Typography>}
              {project.metadata.phase && <Typography variant="body2">
                {project.metadata.phase[0].due_date}
              </Typography>}
              </Typography>}
              {project.metadata.phase && <Typography style={{ fontWeight: 600 }} variant="body2">
                Architect:
              </Typography>}
              {project.metadata.phase && <Typography variant="body2">
                {project.metadata.phase[0].lead}
              </Typography>}
              {project.metadata.phase && <Typography style={{ fontWeight: 600 }} variant="body2">
                Sub-Consultants:
              </Typography>}
              {<Typography variant="body2">
                {Object.entries(project.subconsultants).map(([key, value]) => (
                  <div className="item" key={key}>
                    {key}:  {formatPercentageAmount(value)}
                  </div>
                )
                )}
              </Typography>}
              <Stack spacing={1}>
                {project.metadata.phase && <Typography style={{ fontWeight: 600 }} variant="body2">
                  BIM File:
                </Typography>}
                {project.metadata.phase && <a href={project.metadata.media}>
                  <img src={project.metadata.media} >
                  </img>
                </a>}
                <Grid container spacing={1}>
                  {project.owner_id == window.accountId && <Grid item xs={8}>
                    {project.owner_id == window.accountId && <Typography variant="h6">
                      Create New Phase
                    </Typography>}
                  </Grid>}
                  {project.owner_id == window.accountId && <Grid item xs={4}>
                    <ExpandMore
                      expand={expandedLead}
                      onClick={handleExpandLeadClick}
                      aria-expanded={expandedLead}
                      aria-label="show more"
                    >
                      <ExpandMoreIcon />
                    </ExpandMore>
                  </Grid>}
                </Grid>
                <Collapse in={expandedLead} timeout="auto" unmountOnExit>
                  {project.owner_id == window.accountId && AppointProjectLead(project.token_id)}
                </Collapse>
                <Grid container spacing={1}>
                  {project.metadata.phase && project.metadata.phase[0].lead == window.accountId && <Grid item xs={8}>
                    {project.metadata.phase && project.metadata.phase[0].lead == window.accountId && <Typography variant="h6">
                      Create Team For Phase
                    </Typography>}
                  </Grid>}
                  {project.metadata.phase && project.metadata.phase[0].lead == window.accountId && <Grid item xs={4}>
                    <ExpandMore
                      expand={expandedTeam}
                      onClick={handleExpandTeamClick}
                      aria-expanded={expandedTeam}
                      aria-label="show more"
                    >
                      <ExpandMoreIcon />
                    </ExpandMore>
                  </Grid>}
                </Grid>
                <Collapse in={expandedTeam} timeout="auto" unmountOnExit>
                  {AppointProjectTeam(project.token_id, project.metadata.funding_min_deposit)}
                </Collapse>
                {project.metadata.reference == "Team" && project.metadata.phase[0].lead == window.accountId && PayTeam(project.token_id, project.metadata.phase[0].lead, project.metadata.funding_total, project.metadata.phase[0].scope, project.subconsultants)}
              </Stack>
            </CardContent>
          </React.Fragment>
        </Card>
      </Box>
    </ThemeProvider>
  );
}


const AppointProjectLead = (token) => {

  const [phase, setPhase] = React.useState("Sketch Design");
  const [scope, setScope] = React.useState(30);
  const [lead, setLead] = React.useState("sp02.testnet");
  const [startDateValue, setStartDateValue] = React.useState(null);
  const [dueDateValue, setDueDateValue] = React.useState(null);

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

  const appointLead = async (token) => {

    let phaseGroup = {}
    if (lead) {
      phaseGroup["lead"] = lead
    }
    if (phase) {
      phaseGroup["name"] = phase
    }
    if (scope) {
      phaseGroup["scope"] = scope
    }
    if (startDateValue) {
      phaseGroup["start_date"] = startDateValue
    }
    if (dueDateValue) {
      phaseGroup["due_date"] = dueDateValue
    }

    let phasejson = JSON.stringify(phaseGroup)

    const supportProposal = await contract.nft_approve({
      token_id: `${token}`,
      account_id: `${lead}`,
      phase: phasejson
    },
      "300000000000000", "1000000000000000000000000"
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Stack spacing={3}>
        <ThemeProvider theme={theme}>
          <TextField
            helperText="Type in Phase of Project"
            id="demo-helper-text-misaligned"
            label="Sketch Design etc"
            default="Sketch Design"
            onChange={(e) => setPhase(e.target.value)}
          />
          <Box>
            <Slider
              color="secondary"
              aria-label="Min. Deposit"
              defaultValue={30}
              valueLabelDisplay="on"
              step={5}
              min={5}
              max={100}
              onChange={(e) => setScope(e.target.value)}
            />
            <Typography variant="caption" gutterBottom component="div">
              % of overall project funding
            </Typography>
          </Box>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DatePicker
              label="Start Date"
              value={startDateValue}
              onChange={(newValue) => {
                setStartDateValue(newValue);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
            <DatePicker
              label="Due Date"
              value={dueDateValue}
              onChange={(newValue) => {
                setDueDateValue(newValue);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          <TextField
            helperText="Name of Project Lead"
            id="demo-helper-text-misaligned"
            label="architect.testnet"
            default="sp02.testnet"
            onChange={(e) => setLead(e.target.value)}
          />
          <Button color="secondary" variant="outlined" onClick={() => appointLead(token)}>Create Phase</Button>
        </ThemeProvider>
      </Stack>
    </Box>
  )
}

const AppointProjectTeam = (token, funding_min) => {

  const [firstsub, setFirstSub] = React.useState();
  const [firstsubamt, setFirstSubAmt] = React.useState(1000);
  const [secondsub, setSecondSub] = React.useState();
  const [secondsubamt, setSecondSubAmt] = React.useState(2000);
  const [thirdsub, setThirdSub] = React.useState();
  const [thirdsubamt, setThirdSubAmt] = React.useState(500);

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

  const appointTeam = async (token) => {

    let subGroup = {}
    if (firstsub) {
      subGroup[firstsub] = firstsubamt
    }
    if (secondsub) {
      subGroup[secondsub] = secondsubamt
    }
    if (thirdsub) {
      subGroup[thirdsub] = thirdsubamt
    }

    const teamProject = await contract.nft_consultants({
      token_id: `${token}`,
      subconsultants_funds: subGroup,
      bim_file: "https://gateway.pinata.cloud/ipfs/QmUw6rr1AyApS8qFyo3FYS2Sc4Y4iVrPN6LevFgoUmdrsL"
    },
      "300000000000000", "1000000000000000000000000"
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Stack spacing={4}>
        <ThemeProvider theme={theme}>
          <Grid container spacing={2} paddingLeft={-1} paddingRight={2}>
            <Grid item xs={6}>
              <TextField
                helperText="Consultant Name"
                id="outlined-size-small"
                label="civil.testnet etc."
                default="civil.testnet"
                onChange={(e) => setFirstSub(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <Slider
                color="secondary"
                aria-label="Min. Deposit"
                defaultValue={0}
                valueLabelDisplay="on"
                step={5}
                min={0}
                max={100}
                onChange={(e) => setFirstSubAmt(e.target.value * 100)}
              />
              <Typography variant="caption" gutterBottom component="div">
                % amount
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <TextField
                helperText="Consultant Name"
                id="outlined-size-small"
                label="structural.testnet etc."
                default="structural.testnet"
                onChange={(e) => setSecondSub(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <Slider
                color="secondary"
                aria-label="Min. Deposit"
                defaultValue={0}
                valueLabelDisplay="on"
                step={5}
                min={0}
                max={100}
                onChange={(e) => setSecondSubAmt(e.target.value * 100)}
              />
              <Typography variant="caption" gutterBottom component="div">
                % amount
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <TextField
                helperText="Consultant Name"
                id="outlined-size-small"
                label="mep.testnet etc."
                default="mep.testnet"
                onChange={(e) => setThirdSub(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <Slider
                color="secondary"
                aria-label="Min. Deposit"
                defaultValue={0}
                valueLabelDisplay="on"
                step={5}
                min={0}
                max={100}
                onChange={(e) => setThirdSubAmt(e.target.value * 100)}
              />
              <Typography variant="caption" gutterBottom component="div">
                % amount
              </Typography>
            </Grid>
          </Grid>
          <Button color="secondary" variant="outlined" onClick={() => appointTeam(token)}>Create Team</Button>
        </ThemeProvider>
      </Stack>
    </Box>
  )
}

const PayTeam = (token, receiver, totalfunds, phaseScope, subAmounts) => {

  const [phase, setPhase] = React.useState("Sketch Design");
  const [lead, setLead] = React.useState("sp02.testnet");

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

  const formatNearAmount = (amount) => {
    let formatted = amount.toLocaleString('fullwide', { useGrouping: false })
    formatted = utils.format.formatNearAmount(formatted)
    return Math.floor(formatted * 100) / 100
  }

  const makePayout = async (token, receiver, funds, scope, subAmounts) => {

    let subtotal = 0
    let percentLead = 0
    let percentTeam = 0
    let parsed_balance_payment = 0
    let balanceNear = 0
    let parsed_total_funds = 0
    let scopefunds = 0
    for (const [key, value] of Object.entries(subAmounts)) {
      subtotal += value
    }

    if(scope) {
      scopefunds = (scope / 100 ) * funds
      parsed_balance_payment = utils.format.parseNearAmount(scopefunds.toString())
      
    }

    const supportProposal = await contract.nft_phase_payout({
      token_id: `${token}`,
      balance: `${parsed_balance_payment}`,
      max_len_payout: 100
    },
      "300000000000000", "1"
    );

    console.log(funds)
    console.log(scopefunds)
    console.log(percentLead)
    console.log(percentTeam)
    console.log(balanceNear)
    console.log(parsed_total_funds)
    console.log(parsed_balance_payment)
   
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Stack spacing={2}>
        <ThemeProvider theme={theme}>
          <Button color="secondary" variant="outlined" onClick={() => makePayout(token, receiver, totalfunds, phaseScope, subAmounts)}>Pay The Team</Button>
        </ThemeProvider>
      </Stack>
    </Box>
  )
}
