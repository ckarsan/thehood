import { gql } from '@apollo/client'

export const SIGNUP_MUTATION = gql`
  mutation Signup(
    $name: String!
    $email: String!
    $password: String!
    $role: String!
    $city: String
  ) {
    signup(
      name: $name
      email: $email
      password: $password
      role: $role
      city: $city
    ) {
      token
      user {
        id
        name
        email
        role
        city
      }
    }
  }
`

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        name
        email
        role
        city
      }
    }
  }
`

export const GET_ME = gql`
  query GetMe {
    me {
      id
      name
      email
      role
      city
    }
  }
`

export const GET_REPORTS = gql`
  query GetReports($city: String, $userId: ID) {
    reports(city: $city, userId: $userId) {
      id
      referenceNumber
      originalDescription
      city
      location
      images
      createdBy {
        id
        name
        email
      }
      status
      department
      aiAnalysis {
        cleanedText
        severity
        duplicateConfidence
        possibleDuplicates
        thoughts
      }
      resolution {
        completedBy {
          id
          name
        }
        notes
        timestamp
      }
      notes {
        id
        text
        author {
          id
          name
        }
        createdAt
      }
      createdAt
      updatedAt
    }
  }
`

export const GET_REPORT = gql`
  query GetReport($id: ID!) {
    report(id: $id) {
      id
      referenceNumber
      originalDescription
      city
      location
      images
      createdBy {
        id
        name
        email
      }
      status
      department
      aiAnalysis {
        cleanedText
        severity
        duplicateConfidence
        possibleDuplicates
        thoughts
      }
      resolution {
        completedBy {
          id
          name
        }
        notes
        timestamp
      }
      notes {
        id
        text
        author {
          id
          name
        }
        createdAt
      }
      createdAt
      updatedAt
    }
  }
`

export const CREATE_REPORT_MUTATION = gql`
  mutation CreateReport(
    $description: String!
    $location: String!
    $city: String!
    $civilianContact: CivilianContactInput
    $images: [String]
  ) {
    createReport(
      description: $description
      location: $location
      city: $city
      civilianContact: $civilianContact
      images: $images
    ) {
      id
      referenceNumber
      originalDescription
      city
      location
      status
      department
      createdAt
    }
  }
`

export const UPDATE_REPORT_STATUS_MUTATION = gql`
  mutation UpdateReportStatus($id: ID!, $status: String!, $department: String) {
    updateReportStatus(id: $id, status: $status, department: $department) {
      id
      status
      department
    }
  }
`

export const RESOLVE_REPORT_MUTATION = gql`
  mutation ResolveReport($id: ID!, $notes: String!) {
    resolveReport(id: $id, notes: $notes) {
      id
      status
      resolution {
        completedBy {
          id
          name
        }
        notes
        timestamp
      }
    }
  }
`

export const ADD_REPORT_NOTE_MUTATION = gql`
  mutation AddReportNote($reportId: ID!, $text: String!) {
    addReportNote(reportId: $reportId, text: $text) {
      id
      notes {
        id
        text
        author {
          id
          name
        }
        createdAt
      }
    }
  }
`

export const GET_REPORT_BY_REFERENCE = gql`
  query GetReportByReference($referenceNumber: String!) {
    reportByReference(referenceNumber: $referenceNumber) {
      id
      referenceNumber
      originalDescription
      city
      location
      images
      createdBy {
        id
        name
        email
      }
      status
      department
      aiAnalysis {
        cleanedText
        severity
        duplicateConfidence
        possibleDuplicates
        thoughts
      }
      resolution {
        completedBy {
          id
          name
        }
        notes
        timestamp
      }
      notes {
        id
        text
        author {
          id
          name
        }
        createdAt
      }
      createdAt
      updatedAt
    }
  }
`
