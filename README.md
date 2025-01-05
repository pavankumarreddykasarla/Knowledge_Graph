# Knowledge_Graph
Project Title: Intelligent Chatbot with Neo4j Integration and Visualization
Table of Contents
Overview
Dataset
Data Preprocessing
Structured and Unstructured Data Generation
Entity and Relationship Extraction
Neo4j Database Schema Design
API Development
Chatbot Development
Graph Visualization
Technologies Used
How to Run the Project
1. Overview
This project focuses on building an intelligent chatbot integrated with a Neo4j graph database. The chatbot can answer user queries by generating dynamic Cypher queries using OpenAI and visualizing results as interactive graph structures. Key features include:

Preprocessing structured and unstructured datasets.
Extracting entities and relationships using SpaCy and Gemini APIs.
Storing graph-based data in Neo4j.
Querying Neo4j with OpenAI for intelligent response generation.
Visualizing graph data with D3.js.
2. Dataset
Source: A sample dataset was collected from Kaggle.
Types: Structured and unstructured datasets were created to suit project requirements.
Size: 1,000 rows were processed to generate unstructured data.
3. Data Preprocessing
Initial preprocessing was performed using Python to clean and structure the dataset.
The clean dataset was saved in structured format.
Libraries used: Pandas, NumPy, etc.
4. Structured and Unstructured Data Generation
The structured data was transformed into unstructured format using an OpenAI-powered API.
The transformation was applied to 1,000 rows of structured data to generate realistic unstructured data.
5. Entity and Relationship Extraction
Entities and relationships were extracted from both structured and unstructured datasets using:
SpaCy: Provided initial entity and relationship extraction.
Gemini API: Enhanced the accuracy and relevance of entities and relationships.
The extracted data was then formatted for storage in a Neo4j graph database.
6. Neo4j Database Schema Design
A schema was designed to support both structured and unstructured datasets.
Nodes and relationships were defined to ensure efficient querying and visualization.
Data was pushed to the Neo4j database using Python drivers.
7. API Development
Developed APIs using Express.js to interact with the Neo4j database.
APIs handle:
Inserting new data.
Querying the database for chatbot responses.
8. Chatbot Development
The chatbot interface was built using Angular.
Features include:
Querying the Neo4j database dynamically using Cypher queries.
Generating Cypher queries with OpenAI based on the user's question and database schema.
Displaying answers in the chatbot interface.
9. Graph Visualization
Integrated D3.js to visualize entities and relationships.
Visualization features:
Interactive graph with draggable and zoomable nodes.
Clicking on a chatbot message displays the corresponding graph visualization.
10. Technologies Used
Languages: Python, JavaScript (Node.js, Express.js, Angular)
Frameworks: Angular, Express.js, D3.js
Graph Database: Neo4j
APIs: OpenAI, Gemini API
Libraries: SpaCy, Pandas, NumPy
Other Tools: OpenAI for Cypher query generation
11. How to Run the Project
Prerequisites
Node.js
Angular CLI
Python 3.x
Neo4j Community or Enterprise Edition
Steps
Clone the repository.
Install dependencies for Python and Node.js.
Start the Neo4j database and load the schema.
Run the backend APIs using Express.js.
Launch the chatbot interface with Angular.
Use the chatbot to query data and visualize graph results.
