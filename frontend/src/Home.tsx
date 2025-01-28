/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react';
import { Fragment } from 'react';

export default function Home() {
    return (
        <Fragment>
            <div css={{
                width: '100%',
                backgroundColor: '#256b6e',
                position: 'relative',
            }}>
                <div css={{
                    width: '100%',
                    height: 'calc(100vh - 75px)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: 'linear-gradient(160deg, #ffffff00, #ffffff33, #ffffff55, #ffffff77,  #ffffff99)',
                    flexDirection: 'column',
                    color: '#112021',
                }}>
                    <div css={{
                        fontSize: '52px',
                    }}>Credit Card Fraud Detection</div>
                    <div css={{
                        fontSize: '24px',
                        textAlign: 'center',
                        padding: '10px 80px 120px 80px'
                    }}>Empowering secure transactions with real-time fraud detection and analytics for smarter decision-making.</div>
                </div>
            </div>
        </Fragment>
    )
}