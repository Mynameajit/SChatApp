import React, { useEffect, useRef } from 'react'
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useParams } from 'react-router-dom';
import { Stack } from '@mui/material';
import { auth } from '../firebase';


const VideoCallSystem = () => {
    const roomID = "myroom"
    const elementRef = useRef(null);


    useEffect(() => {

        const initializeCall = async (element) => {
            const userUid = auth.currentUser?.uid
            const userEmail = auth.currentUser?.email

            // const callID = 4525555
            const appID = 858345620
            const serverSecret = "e83d608ed2c75c54ef0ed77d4ebe47e4"


            try {
                const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
                    appID,
                    serverSecret,
                    roomID,
                    userUid.toString(),
                    userEmail
                );

                const zc = ZegoUIKitPrebuilt.create(kitToken);

                zc.joinRoom({
                    container: elementRef.current,
                    scenario: {
                        mode: ZegoUIKitPrebuilt.OneONoneCall,
                    },
                    showPreJoinView: false, // Disable pre-join view for simplicity
                });

                // Handle connection state changes
                zc.on('roomStateChanged', (state) => {
                    console.log('Room State Changed:', state);
                    if (state === 'DISCONNECTED') {
                        console.error('Disconnected from the room. Attempting to reconnect...');
                        initializeCall(); // Retry connection
                    }
                });

                // Handle errors
                zc.on('error', (error) => {
                    console.error('ZegoCloud Error:', error);
                    if (error.code === 1103027) {
                        console.error('Network issue detected. Retrying connection...');
                        initializeCall(); // Retry connection
                    }
                });
            } catch (error) {
                console.error('Failed to initialize call:', error);
            }
        };

        initializeCall();
    }, [roomID]);





    return (

        <Stack>

            <div ref={elementRef} style={{ width: '100%', height: '100vh' }} />

        </Stack>
    )
}

export default VideoCallSystem  