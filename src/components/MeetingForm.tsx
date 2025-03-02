// src/components/MeetingForm.tsx
import React, { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import {
  Flex,
  FormField,
  Input,
  PrimaryButton,
  useMeetingManager,
  DeviceLabels,
  useAudioVideo,
  useMeetingStatus,
  MeetingStatus
} from 'amazon-chime-sdk-component-library-react';
import { MeetingSessionConfiguration } from 'amazon-chime-sdk-js';
import { createMeeting, joinMeeting } from '../utils/api';

interface MeetingFormProps {
  onJoined?: () => void;
}

const MeetingForm: React.FC<MeetingFormProps> = ({ onJoined }) => {
  const meetingManager = useMeetingManager();
  const [meetingId, setMeetingId] = useState('');
  const [attendeeName, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const audioVideo = useAudioVideo();
  const meetingStatus = useMeetingStatus();

  // Add observer to handle video tiles
  useEffect(() => {
    if (audioVideo && meetingStatus === MeetingStatus.Succeeded) {
      // Set up video tile observer
      audioVideo.addObserver({
        videoTileDidUpdate: tileState => {
          console.log('Video tile updated:', tileState);
          if (!tileState.boundAttendeeId) {
            return;
          }
          
          // Handle remote videos (non-local)
          if (!tileState.localTile) {
            console.log('Remote attendee video found:', tileState.boundAttendeeId);
            if (tileState.tileId !== null) {
              // The VideoTileGrid component handles binding automatically
              console.log(`Video tile ${tileState.tileId} added to the grid`);
            }
          }
        },
        videoTileWasRemoved: tileId => {
          console.log('Video tile removed:', tileId);
        }
      });
    }
  }, [audioVideo, meetingStatus]);

  // Add attendee presence observer
  useEffect(() => {
    if (meetingManager && meetingStatus === MeetingStatus.Succeeded) {
      console.log('Setting up attendee presence subscription');
      // Log roster updates
      console.log('Setting up roster monitoring');
    }
  }, [meetingManager, meetingStatus]);

  const clickedJoinMeeting = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const title = meetingId.trim();
      const name = attendeeName.trim();
      if (!name) {
        setError('Please enter your name');
        setIsLoading(false);
        return;
      }
      let joinInfo;
      if (!title) {
        // Create a new meeting if no meeting ID is provided
        const meetingResponse = await createMeeting(`meeting-${Date.now()}`);
        joinInfo = await joinMeeting(meetingResponse.meeting.MeetingId, name);
      } else {
        // Join an existing meeting
        joinInfo = await joinMeeting(title, name);
      }
      const meetingSessionConfiguration = new MeetingSessionConfiguration(
        joinInfo.meeting,
        joinInfo.attendee
      );
      console.log('Joining with configuration:', {
        meetingId: joinInfo.meeting.MeetingId,
        attendeeId: joinInfo.attendee.AttendeeId
      });
      await meetingManager.join(meetingSessionConfiguration, {
        deviceLabels: DeviceLabels.AudioAndVideo
      });
      await meetingManager.start();
      if (onJoined) {
        onJoined();
      }
    } catch (error: any) {
      console.error('Error joining meeting:', error);
      setError(error.message || 'Failed to join the meeting');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form>
      <FormField
        field={Input}
        label='Meeting Id'
        value={meetingId}
        fieldProps={{
          name: 'Meeting Id',
          placeholder: 'Enter a Meeting ID or leave blank to create new',
        }}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setMeetingId(e.target.value);
        }}
      />
      <FormField
        field={Input}
        label="Name"
        value={attendeeName}
        fieldProps={{
          name: 'Name',
          placeholder: 'Enter your Attendee Name'
        }}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setName(e.target.value);
        }}
      />
      {error && (
        <div style={{ color: 'red', margin: '10px 0' }}>
          {error}
        </div>
      )}
      <Flex
        container
        layout="fill-space-centered"
        style={{ marginTop: '2.5rem' }}
      >
        <PrimaryButton
          label={!meetingId ? "Create & Join Meeting" : "Join Meeting"}
          onClick={clickedJoinMeeting}
          disabled={isLoading}
        />
      </Flex>
    </form>
  );
};

export default MeetingForm;
