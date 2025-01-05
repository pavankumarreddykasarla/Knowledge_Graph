const express = require("express");
const axios = require("axios");
const cors = require('cors');
const bodyParser = require("body-parser");
const { GoogleGenerativeAI } = require("@google/generative-ai");
// require("dotenv").config(); // To load the API key from .env file

// Neo4j connection details
const neo4j = require("neo4j-driver");
const neo4jDriver = neo4j.driver(
  "neo4j+s://9b5dd396.databases.neo4j.io",
  neo4j.auth.basic("neo4j", "JLfBkBIbD922-tJSay0jHoAQ7VmzYyldJZmXMTUnl7I")
);

const app = express();

// Configure CORS middleware
app.use(cors({
  origin: "http://localhost:4200",
  methods: ["GET", "POST"],        
  allowedHeaders: ["Content-Type"] 
}));

app.use(bodyParser.json());

const configuration = new GoogleGenerativeAI("AIzaSyA3pwBGMv0fV2zyT0rGlWvMblU0F1iKyXY");

const model = configuration.getGenerativeModel({ model: "gemini-1.5-flash" });


// ========================
// UTILITY FUNCTIONS
// ========================

/**
 * Generate a Cypher query prompt based on the question
 * @param {string} question
 * @returns {string}
 */
const generateCypherPrompt = (question) => {
  schema =  `
  I have a Neo4j database schema with the following structure:
  - **Node**: Employee (Attributes: EmpID, FirstName, LastName, StartDate, EmployeeStatus, Email, Title)
  - **Node**: Supervisor (Attributes: Name)
  - **Node**: Department (Attributes: Type)
  - **Node**: JobFunction (Attributes: Function)
  - **Node**: Performance (Attributes: Score)
  - **Node**: EmployeeRating (Attributes: Rating)
  - **Node**: BusinessUnit (Attributes: Name)
  - **Node**: State (Attributes: Name)
  - **Node**: EmployeeType (Attributes: Type)

  **Relationships**:
  - (Employee)-[:REPORTS_TO]->(Supervisor)
  - (Employee)-[:WORKS_IN]->(Department)
  - (Employee)-[:HAS_JOB_FUNCTION]->(JobFunction)
  - (Employee)-[:EVALUATED_BY]->(Performance)
  - (Employee)-[:UNDERGOES]->(EmployeeRating)
  - (Employee)-[:ASSIGNED_TO]->(BusinessUnit)
  - (Employee)-[:IS_IN]->(State)
  - (Employee)-[:BELONGS_TO]->(EmployeeType)

  Based on the above schema, generate a **valid Cypher query** that answers the following question: **${question}**

  ### Key Requirements:
  1. Ensure the query structure matches the schema provided.
  2. Use single quotes for strings in Cypher queries. Avoid escaping single quotes unnecessarily.
  3. Include appropriate filtering of nodes and relationships based on the question.
  4. Include explicit relationship names (e.g., \`REPORTS_TO\`, \`WORKS_IN\`, etc.) in the query where applicable.
  5. Ensure that all node and relationship labels are consistent with the schema.
  6. The Cypher query should return nodes and relationships with clarity.

  ### Example Question:
  If the question is: "Find the names of all supervisors who manage employees in the 'Sales' department with a performance score of at least 4," the query should look like this:

  \`\`\`cypher
  MATCH (e:Employee)-[r:REPORTS_TO]->(s:Supervisor)
  MATCH (e)-[r2:WORKS_IN]->(d:Department {Type: 'Sales'})
  MATCH (e)-[r3:EVALUATED_BY]->(p:Performance)
  WHERE p.Score >= 4
  RETURN s.Name AS SupervisorName, collect(e.FirstName + ' ' + e.LastName) AS EmployeesManaged, 
         r AS ReportsToRelationship, r2 AS WorksInRelationship, r3 AS EvaluatedByRelationship
  \`\`\`
    `
    return schema
};

/**
 * Execute a Cypher query in Neo4j
 * @param {string} cypherQuery
 * @returns {Promise<object>}
 */
const executeCypherQuery = async (cypherQuery) => {
  const session = neo4jDriver.session();
  try {
    const result = await session.run(cypherQuery);
    // Convert the result to JSON format
    const output = result.records.map((record) => record.toObject());

    const outputString = JSON.stringify(output);

    return outputString;
  } catch (error) {
    throw error;
  } finally {
    await session.close();
  }
};

/**
 * Generate conversational reasoning
 * @param {string} question
 * @param {Array} queryResult
 * @returns {string}
 */
const generateConversationalResponse = async (question, queryResult) => {
  const prompt = `
  Based on the following question and query result, generate a conversational response:

  Question: "${question}"

  Query Result: ${JSON.stringify(queryResult)}

  The response should be a well-structured sentence or paragraph that directly answers the question based on the query result.
  `;

  // Requesting Google's Generative AI API via REST
  try {
    response = await model.generateContentStream(prompt)
    let fullText = '';
    for await (const chunk of response.stream) {
        fullText += chunk.text();
    }

    return fullText
  } catch (error) {
    console.error("Error generating response:", error.response?.data || error.message);
    throw new Error("Failed to generate response.");
  }
};

// ========================
// ROUTES
// ========================

app.post("/api/question", async (req, res) => {
  const { question } = req.body;

  try {
    // Generate the Cypher query
    const prompt = generateCypherPrompt(question);
    response = await model.generateContentStream(prompt)
    let fullText = '';
    for await (const chunk of response.stream) {
        fullText += chunk.text();
    }

    let cypherQuery = fullText.trim();
    cypherQuery = cypherQuery.replace(/```cypher\s*/g, '');
    cypherQuery = cypherQuery.replace(/```/g, '');          
    cypherQuery = cypherQuery.trim();

    const queryResult = await executeCypherQuery(cypherQuery);

    // Generate a conversational response
    const conversationalResponse = await generateConversationalResponse(
      question,
      queryResult
    )
    res.json({
        cypherQuery,
        queryResult,
        conversationalResponse,
      });

  } catch (error) {
    console.error("Error processing question:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/graph", async (req, res) => {
  try {
    console.log("Received request body:", req.body);

    // Extract necessary fields from the request body
    const { cypherQuery, queryResult } = req.body;

    // Construct the prompt
    const prompt = `
      Based on the provided schema, Cypher query, and query result, generate a well-structured conversational response that explains the identified relationships and nodes. Also, format the nodes and relationships in the following structure for visualization as a graph:

      Schema:
      Nodes:
      - Employee (Attributes: EmpID, FirstName, LastName, StartDate, EmployeeStatus, Email, Title)
      - Supervisor (Attributes: Name)
      - Department (Attributes: Type)
      - JobFunction (Attributes: Function)
      - Performance (Attributes: Score)
      - EmployeeRating (Attributes: Rating)
      - BusinessUnit (Attributes: Name)
      - State (Attributes: Name)
      - EmployeeType (Attributes: Type)

      Relationships:
      - (Employee)-[:REPORTS_TO]->(Supervisor)
      - (Employee)-[:WORKS_IN]->(Department)
      - (Employee)-[:HAS_JOB_FUNCTION]->(JobFunction)
      - (Employee)-[:EVALUATED_BY]->(Performance)
      - (Employee)-[:UNDERGOES]->(EmployeeRating)
      - (Employee)-[:ASSIGNED_TO]->(BusinessUnit)
      - (Employee)-[:IS_IN]->(State)
      - (Employee)-[:BELONGS_TO]->(EmployeeType)

      Cypher Query:
      ${cypherQuery}

      Query Result:
      ${JSON.stringify(queryResult)}

      The response should include:
      1. A well-structured conversational answer to the query result.
      2. Nodes and relationships in the following format for visualization:

      Nodes:
      [
        { id: 'E1', name: 'Employee 1', type: 'Employee' },
        { id: 'D1', name: 'Sales Department', type: 'Department' },
        { id: 'S1', name: 'Supervisor 1', type: 'Supervisor' }
      ]

      Relationships:
      [
        { source: 'E1', target: 'D1', relationship: 'WORKS_IN' },
        { source: 'E1', target: 'S1', relationship: 'REPORTS_TO' }
      ]
    `;

    // Call the AI model API
    let fullText = '';
    const response = await model.generateContentStream(prompt);

    // Collect response chunks from the AI model
    for await (const chunk of response.stream) {
      fullText += chunk.text;
    }

    console.log("Generated response:", fullText);

    // Send the generated response back to the client
    res.status(200).json({ message: fullText });
  } catch (error) {
    console.error("Error processing request:", error);

    // Return error response
    res.status(500).json({ error: error.message });
  }
});


// ========================
// START SERVER
// ========================

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

