# The Hood - Application Overview & Workflow

## Overview

**The Hood** is a civic engagement platform that bridges the communication gap between residents and their local city councils. It provides a streamlined system for citizens to report local issues (infrastructure problems, safety concerns, community needs) and enables city council members to efficiently manage, track, and resolve these reports.

## Core Value Proposition

- **For Citizens**: Easy-to-use reporting system with transparency and accountability
- **For City Councils**: Centralized issue management, departmental routing, and resolution tracking
- **For Communities**: Better communication, faster issue resolution, data-driven city planning

## Technology Stack

### Frontend
- **Framework**: React + Vite
- **Styling**: Modern responsive design
- **State Management**: Context API (ThemeContext)
- **Routing**: React Router with protected routes
- **Key Pages**:
  - AuthPage (Login/Signup)
  - CitySelection
  - UserDashboard (Civilian view)
  - CouncilDashboard (Council member view)
  - ReportForm

### Backend
- **Server**: Node.js + Express
- **API**: GraphQL (Apollo Server)
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT tokens
- **AI Integration**: Opik for LLM traceability and evaluation

### Key Features
- Role-based access control (Civilian vs. Council)
- Image upload for reports
- AI-powered report analysis and cleaning
- City-based multi-tenancy
- Real-time status tracking
- Notes and collaboration system
- Reference number generation for tracking

## Data Model

### User
- Authentication credentials
- Role (civilian/council)
- City affiliation
- Contact information

### Report
- Reference number (unique identifier)
- Original description + AI-cleaned version
- Location and city
- Images (array)
- Civilian contact info (optional)
- Status (submitted, in-review, assigned, resolved)
- Department assignment
- AI analysis (severity, duplicate detection, cleaned text)
- Resolution details
- Notes thread
- Timestamps

## Real-World Workflow

### Scenario: Pothole Report on Main Street

#### 1. **Citizen Submits Report**

**User**: Sarah, a resident of Springfield

**Action**:
1. Opens The Hood app/website
2. Logs in or creates account (provides name, email, city)
3. Clicks "Submit Report"
4. Fills out form:
   - **Issue**: "There's a huge pothole on Main Street near the library. It's been getting bigger and almost caused an accident yesterday."
   - **Location**: "Main Street & 5th Ave, Springfield"
   - **Images**: Uploads 2 photos of the pothole
   - **Contact** (optional): Provides phone number for follow-up
5. Submits report

**Backend Processing**:
- System generates reference number: `SPR-2026-0234`
- AI analysis via Opik:
  - **Cleaned text**: Removes profanity, standardizes format
  - **Severity**: "High" (mentions near-accident)
  - **Duplicate confidence**: Checks against existing reports
  - **Department suggestion**: "Public Works - Road Maintenance"
- Report status: `submitted`
- Sarah receives confirmation with reference number

---

#### 2. **Council Member Reviews**

**User**: Mike, Springfield City Council member (Public Works)

**Action**:
1. Logs into Council Dashboard
2. Sees new report notification
3. Opens report `SPR-2026-0234`
4. Reviews:
   - Original description
   - AI-cleaned version
   - Photos showing pothole size
   - Location on map
   - AI severity: "High"
   - AI suggested department: "Public Works"
5. Confirms department assignment
6. Updates status to `in-review`
7. Adds internal note: "Confirmed via photos. Will schedule repair crew for this week."

---

#### 3. **Department Assignment & Action**

**User**: Mike (Council) assigns to Public Works crew

**Action**:
1. Updates status to `assigned`
2. Adds note: "Assigned to Crew #3. Scheduled for Thursday 10 AM"
3. Public Works receives notification
4. Crew goes out, fills pothole
5. Takes "after" photos

---

#### 4. **Resolution & Citizen Notification**

**User**: Mike marks report resolved

**Action**:
1. Changes status to `resolved`
2. Adds resolution notes: "Pothole filled on January 30th by Crew #3. Road surface restored."
3. Uploads "after" photos to report
4. System timestamps resolution

**Citizen Experience**:
- Sarah receives notification/email
- Can view report status: `resolved`
- Can see before/after photos
- Reference number `SPR-2026-0234` shows complete history

---

### Alternative Scenarios

#### Scenario 2: Street Light Outage (Low Severity)

1. **Citizen reports**: "Street light on Oak Ave is out"
2. **AI analysis**: Severity "Low", Department "Electrical/Utilities"
3. **Council review**: Confirms, adds to maintenance queue
4. **Resolution**: Scheduled for next routine maintenance round

#### Scenario 3: Duplicate Report Detection

1. **Citizen reports**: Graffiti on community center
2. **AI detects**: 85% match with report from 2 days ago
3. **Council review**: Merges reports, notes both citizens
4. **Single resolution**: Addresses both reporters when resolved

#### Scenario 4: Emergency Issue

1. **Citizen reports**: "Tree fell on power lines after storm"
2. **AI analysis**: Severity "Critical", immediate safety hazard
3. **Council dashboard**: Flagged as priority/urgent
4. **Immediate action**: Emergency services contacted
5. **Fast-track resolution**: Real-time updates to citizen

---

## User Journeys

### Civilian Journey
```
Sign Up → Select City → Dashboard →
Create Report → Upload Evidence → Submit →
Track Status → Receive Updates →
View Resolution
```

### Council Member Journey
```
Sign Up (Council Role) → Verify City Assignment →
Dashboard View → Filter Reports by Status/Department →
Review New Reports → Assign Department →
Add Notes/Updates → Collaborate with Team →
Mark Resolved → Generate Analytics
```

---

## Key Workflows

### Report Lifecycle States

1. **Submitted**: Citizen creates report, AI processing complete
2. **In Review**: Council member actively reviewing
3. **Assigned**: Routed to specific department with action plan
4. **Resolved**: Issue fixed, resolution documented

### Communication Flow

```
Citizen → Report → AI Analysis → Council Dashboard →
Department Assignment → Action → Resolution →
Citizen Notification
```

### Collaboration Features

- **Notes system**: Internal communication between council members
- **Status updates**: Transparent progress tracking
- **Reference numbers**: Easy tracking and citizen inquiries
- **Image evidence**: Before/after documentation

---

## Benefits & Impact

### For Citizens
- **Transparency**: Track report status in real-time
- **Accountability**: City officials must respond and document actions
- **Easy reporting**: Simple interface, mobile-friendly
- **Evidence-based**: Photo uploads strengthen reports

### For City Councils
- **Centralized management**: All reports in one system
- **Prioritization**: AI-assisted severity scoring
- **Efficiency**: Auto-routing to correct departments
- **Data insights**: Identify patterns and recurring issues
- **Reduced redundancy**: Duplicate detection prevents wasted effort

### For Cities
- **Engaged communities**: Lower barrier to civic participation
- **Data-driven planning**: Trend analysis informs infrastructure budgets
- **Faster response times**: Streamlined workflows
- **Public trust**: Demonstrated responsiveness to citizen needs

---

## Future Enhancements

- Mobile native apps (iOS/Android)
- SMS notifications
- Multi-language support
- Public report map view
- Voting/upvoting on reports
- Council response time analytics
- Integration with city work order systems
- Scheduled maintenance tracking
- Community feedback on resolutions
