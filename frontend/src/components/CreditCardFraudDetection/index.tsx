import React, { useEffect, useState } from "react";
import axios from 'axios';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import "./index.scss";
import { cities, genders, categories, jobs, states } from "./../Constants";

export default function Index(props: {
    getCard: () => Promise<any>,
}) {
    const [showBackDrop, setShowBackDrop] = useState(false);
    const [dateTime, setDateTime] = useState('');
    const [category, setCategory] = useState('');
    const [amt, setAmt] = useState('');
    const [gender, setGender] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [lat, setLat] = useState('');
    const [long, setLong] = useState('');
    const [cityPop, setCityPop] = useState('');
    const [job, setJob] = useState('');
    const [merchLat, setMerchLat] = useState('');
    const [merchLong, setMerchLong] = useState('');
    const [card, setCard] = useState('');
    const [output, setOutput] = useState('');

    useEffect(() => {
        async function getData() {
            try {
                let data = await props.getCard()
                setCard(data['card']);
            } catch (e) {
            }
        }
        getData();
    }, [props, setCard]);

    return (
        <div>
            <div className="creditCardFraudDetection">
                <div className="creditCardFraudDetectionTitle">Credit Card Fraud Detection</div>
                <div className="creditCardFraudDetectionContent">
                    <TextField
                        className="creditCardFraudDetectionNameInput"
                        label="Card"
                        value={card}
                        variant="standard"
                        fullWidth
                    />
                    <div className="creditCardFraudDetectionInputSelectDiv">
                        <TextField
                            className="creditCardFraudDetectionNameInput"
                            label="Date Time"
                            value={dateTime}
                            variant="standard"
                            fullWidth
                            type="datetime-local"
                            onChange={(e) => {
                                setDateTime(e.target.value);
                                setOutput('');
                            }}
                        />
                        <Select
                            label="Category"
                            value={category}
                            onChange={(e) => {
                                setCategory(e.target.value);
                                setOutput('');
                            }}
                            className="creditCardFraudDetectionSelect left"
                            variant="standard"
                            fullWidth
                        >
                            {categories.map((_category) => {
                                return <MenuItem key={_category} value={_category}>{_category}</MenuItem>
                            })}
                        </Select>
                    </div>
                    <div className="creditCardFraudDetectionInputSelectDiv">
                        <TextField
                            className="creditCardFraudDetectionNameInput"
                            label="Amount"
                            value={amt}
                            variant="standard"
                            fullWidth
                            type="number"
                            onChange={(e) => {
                                setAmt(e.target.value);
                                setOutput('');
                            }}
                        />
                        <Select
                            label="Gender"
                            value={gender}
                            onChange={(e) => {
                                setGender(e.target.value);
                                setOutput('');
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
                                setOutput('');
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
                                setOutput('');
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
                                setOutput('');
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
                                setOutput('');
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
                                setOutput('');
                            }}
                        />
                        <Select
                            label="Job"
                            value={job}
                            onChange={(e) => {
                                setJob(e.target.value);
                                setOutput('');
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
                    <div className="creditCardFraudDetectionInputSelectDiv">
                        <TextField
                            className="creditCardFraudDetectionNameInput"
                            label="Merchant Lat"
                            value={merchLat}
                            variant="standard"
                            fullWidth
                            type="number"
                            onChange={(e) => {
                                setMerchLat(e.target.value);
                                setOutput('');
                            }}
                        />
                        <TextField
                            className="creditCardFraudDetectionNameInput"
                            label="Merchant Long"
                            value={merchLong}
                            variant="standard"
                            fullWidth
                            type="number"
                            onChange={(e) => {
                                setMerchLong(e.target.value);
                                setOutput('');
                            }}
                        />
                    </div>
                    <Button
                        className="creditCardFraudDetectionInput"
                        variant="outlined"
                        fullWidth
                        onClick={() => {
                            setOutput('');
                            // setShowBackDrop(true);
                            let url = 'http://localhost:8080/predict';
                            let data = new FormData();
                            data.append('card', card);
                            data.append('trans_date_trans_time', dateTime);
                            data.append('category', category);
                            data.append('amt', amt);
                            data.append('gender', gender);
                            data.append('city', city);
                            data.append('state', state);
                            data.append('lat', lat);
                            data.append('long', long);
                            data.append('city_pop', cityPop);
                            data.append('job', job);
                            data.append('merch_lat', merchLat);
                            data.append('merch_long', merchLong);
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
                                setOutput(res.data['result']);
                                setShowBackDrop(false);
                            }).catch((err) => {
                                alert(err);
                                setOutput('');
                                setShowBackDrop(false);
                            });
                        }}
                    >Check</Button>
                    <div className="creditCardFraudDetectionOutput">Output: {output}</div>
                </div>
            </div>
            <Backdrop
                sx={{ color: '#fff', zIndex: 5 }}
                open={showBackDrop}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    )
}