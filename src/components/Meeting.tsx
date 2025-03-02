// src/components/Meeting.tsx
import React, { useEffect } from 'react';
import {
  AudioInputControl,
  AudioOutputControl,
  ControlBar,
  ControlBarButton,
  Phone,
  useMeetingManager,
  MeetingStatus,
  useMeetingStatus,
  VideoInputControl,
  VideoTileGrid,
  ContentShareControl,
  useRemoteVideoTileState,
  RemoteVideo,
  useContentShareState,
  useLocalVideo
} from 'amazon-chime-sdk-component-library-react';

const Meeting: React.FC = () => {
  const meetingManager = useMeetingManager();
  const meetingStatus = useMeetingStatus();
  const { tiles } = useRemoteVideoTileState();
  const { isVideoEnabled } = useLocalVideo();
  const contentShareState = useContentShareState();
  
  // Log when remote tiles change
  useEffect(() => {
    console.log('Remote video tiles:', tiles);
  }, [tiles]);

  const handleEndMeeting = async () => {
    await meetingManager.leave();
    window.location.reload(); // Simple way to get back to the form
  };

  const handleCopyMeetingId = () => {
    const meetingId = meetingManager.meetingId;
    if (meetingId) {
      navigator.clipboard.writeText(meetingId);
      alert('Meeting ID copied to clipboard!');
    }
  };

  return (
    <div style={{
      marginTop: '2rem',
      height: '40rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {meetingStatus === MeetingStatus.Succeeded && (
        <div style={{ width: '100%', textAlign: 'center', marginBottom: '10px' }}>
          <span>Remote participants: {tiles.length}</span>
          <span style={{ marginLeft: '20px' }}>
            Local video: {isVideoEnabled ? 'On' : 'Off'}
          </span>
        </div>
      )}
      
      <VideoTileGrid />
      
      {meetingStatus === MeetingStatus.Succeeded ? (
        <ControlBar
          layout="undocked-horizontal"
          showLabels
        >
          <AudioInputControl />
          <VideoInputControl />
          <AudioOutputControl />
          <ContentShareControl />
          <ControlBarButton
            icon={<span>ID</span>}
            onClick={handleCopyMeetingId}
            label="Copy ID"
          />
          <ControlBarButton
            icon={<Phone />}
            onClick={handleEndMeeting}
            label="End"
          />
        </ControlBar>
      ) : (
        <div>Setting up meeting...</div>
      )}
    </div>
  );
};

export default Meeting;
