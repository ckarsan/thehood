const typeDefs = `
  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
    city: String
    phone: String
    createdAt: String!
  }

  type Note {
    id: ID!
    text: String!
    author: User!
    createdAt: String!
  }

  type AIAnalysis {
    cleanedText: String
    severity: String
    duplicateConfidence: Float
    possibleDuplicates: [String]
    thoughts: String
  }

  type Resolution {
    completedBy: User
    notes: String
    timestamp: String
  }

  type Report {
    id: ID!
    referenceNumber: String!
    originalDescription: String!
    city: String!
    location: String!
    images: [String]
    civilianContact: CivilianContact
    createdBy: User
    status: String!
    department: String!
    aiAnalysis: AIAnalysis
    resolution: Resolution
    notes: [Note]
    createdAt: String!
    updatedAt: String!
  }

  type CivilianContact {
    name: String
    phone: String
    email: String
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    me: User
    reports(city: String, userId: ID): [Report!]!
    report(id: ID!): Report
    reportByReference(referenceNumber: String!): Report
  }

  type Mutation {
    signup(name: String!, email: String!, password: String!, role: String!, city: String): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    createReport(
      description: String!
      location: String!
      city: String!
      civilianContact: CivilianContactInput
      images: [String]
    ): Report!
    updateReportStatus(id: ID!, status: String!, department: String): Report!
    resolveReport(id: ID!, notes: String!): Report!
    addReportNote(reportId: ID!, text: String!): Report!
  }

  input CivilianContactInput {
    name: String
    phone: String
    email: String
  }
`

export default typeDefs
