/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react';
import { Fragment } from 'react';
import { useNavigate } from "react-router-dom";

interface HeaderProps {
    isConnected: boolean;
    connect: Function;
}

export default function Header(props: HeaderProps) {
    const navigate = useNavigate();

    function getLinks() {
        if (!props.isConnected)
            return (
                <div css={{ cursor: 'pointer' }}
                    onClick={() => props.connect && props.connect()}
                >
                    Connect
                </div>
            );
        return (
            <Fragment>
                <div css={{ cursor: 'pointer' }}
                    onClick={() => { navigate('/details') }}>
                    Details
                </div>
                <div css={{ cursor: 'pointer' }}
                    onClick={() => { navigate('/predict') }}>
                    Predict
                </div>
            </Fragment>
        );
    }

    return (
        <Fragment>
            <div css={{
                height: '75px',
                backgroundColor: '#256b6e',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0 30px',
                color: 'white',
            }}>
                <div css={{
                    fontSize: '32px',
                    cursor: 'pointer'
                }}
                    onClick={(e) => navigate("/")}>
                    Credit Card Fraud Detection
                </div>
                <div css={{
                    display: 'flex',
                    gap: '20px'
                }}>
                    {getLinks()}
                </div>
            </div>
        </Fragment>
    )
}