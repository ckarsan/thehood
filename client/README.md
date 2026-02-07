# thehood - Community Reporting Platform

thehood is a modern, AI-powered community reporting application that bridges the gap between citizens and local councils. It allows residents to report issues like potholes, graffiti, or public safety concerns, while providing councils with a powerful dashboard to manage and resolve these issues efficiently.



## 👤 Perspective 1: Reporting an Issue (Citizen)

Reporting an issue in your city is designed to be simple and transparent.

### Submitting a Report
- **City Selection**: Choose your city (e.g., Gotham, Smallville) to see localized reporting.
- **Describe & Locate**: Provide a detailed description of the issue and its location.
- **Visual Proof**: Optionally upload up to 3 images to help the council understand the severity.
- **Contact Details**: Providing your contact info allows the council to reach out if clarification is needed.

### AI 
Once you submit, our system uses AI to:
- **Clean and Categorize**: Automatically determine the correct department (Roads, Sanitation, Public Safety, etc.).
- **Assess Severity**: Flag urgent issues for faster processing.
- **Detect Duplicates**: Identify if the same issue has already been reported, preventing redundant work.

### Stay Informed
- **My Reports**: Track the status of your reported issues from your dashboard.
- **Real-time Updates**: See when your report moves from "Submitted" to "In Progress" and finally "Resolved".

---

## 🏛️ Perspective 2: Managing Reports (Council)

The Council Dashboard provides a high-level view and granular control over city issues.

### Kanban Workflow
Manage reports through a structured lifecycle:
1.  **Submitted**: New reports arriving from citizens.
2.  **In Review**: Initial assessment phase to verify the issue.
3.  **Assigned**: Send the report to the relevant department.
4.  **In Progress**: Active work being performed by city crews.
5.  **Resolved/Cancelled**: Final state after completion or rejection.

### AI Insights
- **Thought Process**: View the AI's reasoning for why a report was categorized or prioritized a certain way.
- **Department Suggestions**: Let the AI suggest the best department to handle the task.
- **Severity Highlighting**: Focus on "High" severity items first.

### Powerful Tools
- **Duplicate Detection**: View details of potential duplicates in a slide-out drawer to verify if reports are linked.
- **Lifecycle History**: Track every stage of the report, including notes added during review, assignment, and work phases.
- **ETA Badges**: Keep citizens informed by setting expected completion dates.

---

## 🛠️ Tech Stack

- **Frontend**: React with Vite
- **UI Components**: Ant Design (AntD)
- **Data Management**: Apollo Client (GraphQL)
- **Styling**: Vanilla CSS with a centralized Design System
