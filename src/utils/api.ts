const API_URL = "YOUR_API_URL"; //replace with your API URL

export interface Meeting {
  MeetingId: string;
  MediaPlacement: {
    AudioHostUrl: string;
    ScreenDataUrl: string;
    ScreenSharingUrl: string;
    ScreenViewingUrl: string;
    SignalingUrl: string;
    TurnControlUrl: string;
  };
  MediaRegion: string;
}

export interface Attendee {
  AttendeeId: string;
  ExternalUserId: string;
  JoinToken: string;
}

export interface CreateMeetingResponse {
  meeting: Meeting;
}

export interface JoinMeetingResponse {
  meeting: Meeting;
  attendee: Attendee;
}

// Create a new meeting
export async function createMeeting(meetingId: string): Promise<CreateMeetingResponse> {
  try {
    const response = await fetch(`${API_URL}/create-meeting`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ meetingId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.details || 'Failed to create meeting');
    }

    return response.json();
  } catch (error) {
    console.error('Error creating meeting:', error);
    throw error;
  }
}

// Join an existing meeting
export async function joinMeeting(meetingId: string, attendeeName: string): Promise<JoinMeetingResponse> {
  try {
    const response = await fetch(`${API_URL}/join-meeting`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ meetingId, attendeeName }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.details || 'Failed to join meeting');
    }

    return response.json();
  } catch (error) {
    console.error('Error joining meeting:', error);
    throw error;
  }
}

// End meeting (not implemented in backend yet, but you can add it if needed)
export async function endMeeting(meetingId: string): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/end-meeting`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ meetingId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.details || 'Failed to end meeting');
    }
  } catch (error) {
    console.error('Error ending meeting:', error);
    throw error;
  }
}
