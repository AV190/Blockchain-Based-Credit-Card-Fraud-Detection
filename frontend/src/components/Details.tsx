/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react';
import { Fragment, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import "./CreditCardFraudDetection/index.scss"
import { cities, genders, categories, jobs, states } from "./Constants";
import axios from 'axios';

interface DetailsProps {
    getCard: () => Promise<any>,
    addCard: (
        card: string,
        gender: string,
        city: string,
        state: string,
        lat: string,
        long: string,
        city_pop: string,
        job: string,
    ) => Promise<void>,
    getCardTransactions: (card: string) => Promise<any>,
}

export default function Details(props: DetailsProps) {
    const navigate = useNavigate();

    const [card, setCard] = useState({});
    const [createCard, setCreateCard] = useState(false);
    const [transactions, setTransactions] = useState([]);

    const [gender, setGender] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [lat, setLat] = useState('');
    const [long, setLong] = useState('');
    const [cityPop, setCityPop] = useState('');
    const [job, setJob] = useState('');

    const [dialogOpen, setDialogOpen] = useState(false);
    const [category, setCategory] = useState('');
    const [amt, setAmt] = useState('');
    const [merchLat, setMerchLat] = useState('');
    const [merchLong, setMerchLong] = useState('');
    const [showBackDrop, setShowBackDrop] = useState(false);

    useEffect(() => {
        async function getData() {
            try {
                let data = await props.getCard()
                setCard(data);

                console.log(data)
                if (data['cardOwner'] === '0x0000000000000000000000000000000000000000') {
                    setCreateCard(true);
                    return;
                }

                let transactions = await props.getCardTransactions(data['card']);
                setTransactions(transactions);
            } catch (e) {
                setCreateCard(true);
            }
        }
        getData();
    }, [props, setCard, setCreateCard, setTransactions]);

    return (
        <div css={{ padding: "10px" }}>
            {createCard ?
                <Fragment>
                    <div css={{
                        margin: '20px 0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                        <div css={{
                            fontSize: '28px',
                            fontWeight: '600px',
                        }}>
                            Create Card
                        </div>
                    </div>
                    <div className="creditCardFraudDetectionContent">
                        <div className="creditCardFraudDetectionInputSelectDiv">
                            <Select
                                label="Gender"
                                value={gender}
                                onChange={(e) => {
                                    setGender(e.target.value);
                                }}
                                className="creditCardFraudDetectionSelect left"
                                variant="standard"
                                fullWidth
                            >
                                {genders.map((_gender) => {
                                    return <MenuItem key={_gender} value={_gender}>{_gender}</MenuItem>
                                })}
                            </Select>
                        </div>
                        <div className="creditCardFraudDetectionInputSelectDiv">
                            <Select
                                label="City"
                                value={city}
                                onChange={(e) => {
                                    setCity(e.target.value);
                                }}
                                className="creditCardFraudDetectionSelect left"
                                variant="standard"
                                fullWidth
                            >
                                {cities.map((_city) => {
                                    return <MenuItem key={_city} value={_city}>{_city}</MenuItem>
                                })}
                            </Select>
                            <Select
                                label="State"
                                value={state}
                                onChange={(e) => {
                                    setState(e.target.value);
                                }}
                                className="creditCardFraudDetectionSelect left"
                                variant="standard"
                                fullWidth
                            >
                                {states.map((_state) => {
                                    return <MenuItem key={_state} value={_state}>{_state}</MenuItem>
                                })}
                            </Select>
                        </div>
                        <div className="creditCardFraudDetectionInputSelectDiv">
                            <TextField
                                className="creditCardFraudDetectionNameInput"
                                label="Lat"
                                value={lat}
                                variant="standard"
                                fullWidth
                                type="number"
                                onChange={(e) => {
                                    setLat(e.target.value);
                                }}
                            />
                            <TextField
                                className="creditCardFraudDetectionNameInput"
                                label="Long"
                                value={long}
                                variant="standard"
                                fullWidth
                                type="number"
                                onChange={(e) => {
                                    setLong(e.target.value);
                                }}
                            />
                        </div>
                        <div className="creditCardFraudDetectionInputSelectDiv">
                            <TextField
                                className="creditCardFraudDetectionNameInput"
                                label="City population"
                                value={cityPop}
                                variant="standard"
                                fullWidth
                                type="number"
                                onChange={(e) => {
                                    setCityPop(e.target.value);
                                }}
                            />
                            <Select
                                label="Job"
                                value={job}
                                onChange={(e) => {
                                    setJob(e.target.value);
                                }}
                                className="creditCardFraudDetectionSelect left"
                                variant="standard"
                                fullWidth
                            >
                                {jobs.map((_job) => {
                                    return <MenuItem key={_job} value={_job}>{_job}</MenuItem>
                                })}
                            </Select>
                        </div>
                        <Button
                            className="creditCardFraudDetectionInput"
                            variant="outlined"
                            fullWidth
                            onClick={() => {
                                if (
                                    gender === '' ||
                                    city === '' ||
                                    state === '' ||
                                    lat === '' ||
                                    long === '' ||
                                    cityPop === '' ||
                                    job === ''
                                ) {
                                    return;
                                }
                                props.addCard(
                                    Math.floor(Math.random() * 1E16).toString(),
                                    gender,
                                    city,
                                    state,
                                    lat,
                                    long,
                                    cityPop,
                                    job
                                );
                                navigate("/");
                            }}
                        >Create card</Button>
                    </div>
                </Fragment>
                :
                <Fragment>
                    <div css={{
                        margin: '20px 0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                        <div css={{
                            fontSize: '28px',
                            fontWeight: '600px',
                        }}>
                            Details
                        </div>
                    </div>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Card</TableCell>
                                    <TableCell align="right">Transaction date</TableCell>
                                    <TableCell align="right">Category</TableCell>
                                    <TableCell align="right">Amount</TableCell>
                                    <TableCell align="right">Gender</TableCell>
                                    <TableCell align="right">Place</TableCell>
                                    <TableCell align="right">Lat/Long</TableCell>
                                    <TableCell align="right">Population</TableCell>
                                    <TableCell align="right">Job</TableCell>
                                    <TableCell align="right">Merch lat/long</TableCell>
                                    <TableCell align="right">Result</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {transactions.map((row) => (
                                    <TableRow
                                        key={row['id']}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {row['card']}
                                        </TableCell>
                                        <TableCell align="right">{row['trans_date_time']}</TableCell>
                                        <TableCell align="right">{row['category']}</TableCell>
                                        <TableCell align="right">{row['amt']}</TableCell>
                                        <TableCell align="right">{
                                            // @ts-ignore
                                            card['gender']
                                        }</TableCell>
                                        <TableCell align="right">{
                                            // @ts-ignore
                                            card['city'] + ", " + card['state']
                                        }</TableCell>
                                        <TableCell align="right">{
                                            // @ts-ignore
                                            card['lat'] + ", " + card['long']
                                        }</TableCell>
                                        <TableCell align="right">{
                                            // @ts-ignore
                                            card['city_pop']
                                        }</TableCell>
                                        <TableCell align="right">{
                                            // @ts-ignore
                                            card['job']
                                        }</TableCell>
                                        <TableCell align="right">{row['merch_lat'] + ", " + row['merch_long']}</TableCell>
                                        <TableCell align="right">{row['result']}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Dialog onClose={() => setDialogOpen(false)} open={dialogOpen}>
                        <DialogTitle>Transact</DialogTitle>
                        <DialogContent>
                            <div className="creditCardFraudDetectionContent">
                                <div className="creditCardFraudDetectionInputSelectDiv">
                                    <Select
                                        label="Category"
                                        value={category}
                                        onChange={(e) => {
                                            setCategory(e.target.value);
                                        }}
                                        className="creditCardFraudDetectionSelect left"
                                        variant="standard"
                                        fullWidth
                                    >
                                        {categories.map((_category) => {
                                            return <MenuItem key={_category} value={_category}>{_category}</MenuItem>
                                        })}
                                    </Select>
                                    <TextField
                                        className="creditCardFraudDetectionNameInput"
                                        label="Amount"
                                        value={amt}
                                        variant="standard"
                                        fullWidth
                                        type="number"
                                        onChange={(e) => {
                                            setAmt(e.target.value);
                                        }}
                                    />
                                </div>
                                <div className="creditCardFraudDetectionInputSelectDiv">
                                    <TextField
                                        className="creditCardFraudDetectionNameInput"
                                        label="Merch Lat"
                                        value={merchLat}
                                        variant="standard"
                                        fullWidth
                                        type="number"
                                        onChange={(e) => {
                                            setMerchLat(e.target.value);
                                        }}
                                    />
                                    <TextField
                                        className="creditCardFraudDetectionNameInput"
                                        label="merchLong"
                                        value={merchLong}
                                        variant="standard"
                                        fullWidth
                                        type="number"
                                        onChange={(e) => {
                                            setMerchLong(e.target.value);
                                        }}
                                    />
                                </div>
                            </div>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                className="creditCardFraudDetectionInput"
                                variant="outlined"
                                onClick={() => {
                                    setDialogOpen(false);
                                }}
                            >Cancel</Button>
                            <Button
                                className="creditCardFraudDetectionInput"
                                variant="outlined"
                                onClick={() => {
                                    if (
                                        category === '' ||
                                        amt === '' ||
                                        merchLat === '' ||
                                        merchLong === ''
                                    ) {
                                        return;
                                    }

                                    setShowBackDrop(true);
                                    let url = 'http://localhost:8080/transact';
                                    let data = new FormData();
                                    // @ts-ignore
                                    data.append('card', card['card']);
                                    data.append('trans_date_trans_time', (new Date()).toISOString());
                                    data.append('category', category);
                                    data.append('amt', amt);
                                    data.append('merch_lat', merchLat);
                                    data.append('merch_long', merchLong);

                                    // @ts-ignore
                                    data.append('gender', card['gender']);
                                    // @ts-ignore
                                    data.append('city', card['city']);
                                    // @ts-ignore
                                    data.append('state', card['state']);
                                    // @ts-ignore
                                    data.append('lat', card['lat']);
                                    // @ts-ignore
                                    data.append('long', card['long']);
                                    // @ts-ignore
                                    data.append('city_pop', card['city_pop']);
                                    // @ts-ignore
                                    data.append('job', card['job']);
                                    const config = {
                                        headers: {
                                            'content-type': 'multipart/form-data',
                                            'Access-Control-Allow-Origin': '*',
                                            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                                        }
                                    }

                                    axios.post(
                                        url,
                                        data,
                                        config
                                    ).then((res) => {
                                        setShowBackDrop(false);
                                    }).catch((err) => {
                                        alert(err);
                                        setShowBackDrop(false);
                                    });

                                    setDialogOpen(false);
                                }}
                            >Save</Button>
                        </DialogActions>
                    </Dialog>
                </Fragment>
            }
            <Backdrop
                sx={{ color: '#fff', zIndex: 5 }}
                open={showBackDrop}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </div >
    );
}