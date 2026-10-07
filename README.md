## 1.	Problem Statement
Businesses and accounting personnel manually examine large numbers of invoices for GST-related correctness, including CGST, SGST, and IGST, as well as other invoice anomalies such as incorrect data and duplicate entries. As the volume of invoices increases, this process becomes time-consuming and prone to human error, making it difficult to consistently identify incorrect GST calculations, duplicate invoices, and other invoice inconsistencies.
-	For whom: Businesses and accounting personnel.
-	What they do: Manually examine and verify business invoices.
-	Why it becomes difficult: A large volume of invoices makes the process time-consuming and error-prone.
-	Consequences: Incorrect GST calculations, duplicate invoices, and other inconsistencies may be missed.

## 2. Proposed Solution
The proposed solution is a web-based invoice verification system that analyses uploaded business invoices for GST-related errors, duplicate entries, missing information, and inconsistent invoice data. The system will validate invoice information against predefined GST rules, identify potential anomalies, assign risk levels, and provide clear explanations for the identified issues.

## 3. Objectives
The main objectives of the system are Efficiency, Accuracy and Consistency, Explainability, and GST Compliance Validation.
Efficiency: Reduce the time and manual effort required to verify large volumes of business invoices.
Accuracy and Consistency: Improve the reliability and consistency of invoice verification by reducing errors and missed issues during manual examination.
Explainability: Provide clear and understandable explanations for each flagged issue so that accounting personnel can quickly understand, verify, and act upon identified problems.
GST Compliance Validation: Ensure that invoices are evaluated against applicable GST requirements, including GSTIN validity, tax calculations, and the correct applicability of CGST, SGST, and IGST.


## 4. Users
## 4.2 Admin
4.1 Business User
A Business User is an accounting personnel or authorized employee responsible for submitting and reviewing business invoices.
Capabilities:
## 4.2 Admin
-	Upload business invoices for verification.
-	View information extracted or parsed from uploaded invoices.
-	View GST compliance results.
-	View identified invoice anomalies and risk results.
-	Download invoice verification reports.
An Admin is an authorized user responsible for managing Business Users and overseeing invoice verification activities across the system.
Capabilities:
-	View invoices submitted by Business Users.
-	View invoice verification and compliance results.
-	View anomaly and risk results.
-	Monitor invoice processing activities.
-	Access and generate system reports.
5. In Scope
-	The following functionalities are included within the scope of the system:
-	Ingestion of business invoice data through CSV files.
-	Extraction and presentation of relevant invoice information from uploaded files.
-	Validation of GSTINs and applicable GST-related information.
-	Validation of CGST, SGST, and IGST calculations and applicability.
-	Detection of invoice anomalies using rule-based and predefined statistical approaches.
-	Detection of duplicate invoices.
-	Assignment of risk scores based on identified anomalies and compliance issues.
-	Role-based access for Business Users and ## Admins.
-	Dashboard for viewing invoice verification and analysis results.
-	Generation and downloading of invoice verification reports.
6. Out of Scope
The following functionalities are excluded from the current version of the system:
-	OCR-based processing of scanned or image-based invoices.
-	Machine-learning-based anomaly detection, including Isolation Forest.
-	An Auditor role or separate Auditor portal.
-	Real-time integration with government GST APIs for online verification.
-	Multi-company or multi-tenant support.
-	Configuration or modification of GST validation rules through a user-facing interface.
-	Automated submission of invoices or GST returns to government systems.

7. Functional Requirements
## FR-01: User Authentication and Authorization
-	The system shall allow users to log in securely.
-	The system shall support role-based access for Business Users and Admins.
-	The system shall restrict features and data according to the user's assigned role.
-	The system shall prevent unauthorized users from accessing invoice data and reports.
## FR-02: Invoice Upload
-	Business Users shall be able to upload invoices in CSV or text-based PDF format.
-	The system shall validate the uploaded file type, format, size, and required fields.
-	The system shall reject corrupted, unsupported, or image-based files with a clear error message.
-	The system shall support processing multiple invoice records where applicable.
-	The system shall provide the user with the upload and processing status.
## 4.2 Admin
FR-03: Invoice Data Extraction and Parsing
The system shall extract or parse relevant invoice information from uploaded files, including:
-	Invoice number and date.
-	Supplier details.
-	Recipient details.
-	Supplier GSTIN.
-	Recipient GSTIN.
-	Place of supply.
-	Taxable amount.
-	GST rate.
-	CGST amount.
-	SGST amount.
-	IGST amount.
-	Total invoice amount.
-	The system shall display the extracted or parsed information for user review.
## FR-04: GSTIN Validation
-	The system shall validate the format of GSTINs.
-	The system shall validate the GSTIN checksum.
-	The system shall verify the state code encoded in the GSTIN.
-	The system shall identify missing, invalid, or inconsistent GSTIN information.
-	The system shall perform GSTIN validation without depending on real-time government GST APIs.
## FR-05: GST Calculation Validation
-	The system shall recalculate GST based on the taxable value and applicable GST rate.
-	The system shall compare the calculated GST values with the values provided on the invoice.
-	The system shall identify incorrect CGST calculations.
-	The system shall identify incorrect SGST calculations.
-	The system shall identify incorrect IGST calculations.
-	The system shall identify incorrect GST rates.
-	The system shall identify incorrect invoice total calculations.
-	The system shall account for predefined rounding tolerances when comparing calculated and invoice values.
## FR-06: GST Applicability Validation
-	The system shall determine whether CGST and SGST or IGST should apply based on supplier state, recipient state, and place-of-supply information according to the predefined GST rules implemented by the system.
-	The system shall identify cases where the applied tax type is inconsistent with the applicable GST rule.
-	The system shall flag incorrectly applied CGST, SGST, or IGST.
## FR-07: Duplicate Invoice Detection
-	The system shall identify possible duplicate invoices using relevant attributes such as invoice number, GSTIN, date, and amount.
-	The system shall identify possible near-duplicate invoice records based on relevant matching attributes.
-	The system shall report detected duplicate records to the user.
-	The system shall provide the information used to identify a potential duplicate.
## FR-08: Anomaly Detection
-	The system shall detect missing mandatory invoice fields.
-	The system shall identify inconsistent invoice values and formats.
-	The system shall identify unusual tax rates.
-	The system shall identify unusual invoice amounts.
-	The system shall identify unusual invoice dates or patterns.
-	The system shall use predefined rule-based and statistical techniques for anomaly detection.
-	The system shall not use machine-learning-based anomaly detection.
## FR-09: Risk Scoring
-	The system shall assign a risk score to each processed invoice.
-	The risk score shall be based on identified GST errors, missing information, duplicate records, and other detected anomalies.
-	The system shall classify invoices into risk categories such as Low, Medium, and High.
-	The system shall provide the reasons contributing to each invoice's risk score.
-	The system shall display the risk category along with the identified issues.
## FR-10: Results Dashboard
-	The dashboard shall display GST compliance issues.
-	The dashboard shall display detected anomalies.
-	The dashboard shall display duplicate invoice results.
-	The dashboard shall display invoice risk scores and risk categories.
## FR-11: Reports
-	Business Users shall be able to download verification reports for their invoices.
-	Admins shall be able to generate reports covering invoices submitted by Business ## ## Users.
-	Reports shall include:
-	Invoice details
-	GST validation results
-	GST calculation results
-	GST applicability results
- Detected anomalies
-	Duplicate detection results
-	Risk scores
-	Risk categories
-	Explanations for flagged issues
## 4.2 Admin
FR-12: Administration
-	Admins shall be able to view all submitted invoices.
-	Admins shall be able to view invoice verification and compliance results.
-	Admins shall be able to view anomaly and risk results.
-	Admins shall be able to monitor invoice upload and processing activities.
8. Non-Functional Requirements
-	NFR-01: Performance
-	The system should provide normal page responses within 3 seconds under expected system load.
-	Invoice processing should complete within a reasonable time based on file size and invoice count.
-	The system should display processing status for operations that require extended processing time.
## NFR-02: Accuracy
-	GST calculations shall use predefined GST validation rules and appropriate rounding tolerances.
-	The system shall preserve extracted or parsed invoice values without unintended modification.
-	Validation results shall be reproducible when the same input data and validation rules are used.
-	The system shall clearly distinguish between verified values and values provided in the original invoice.
## NFR-03: Security
-	User passwords shall be securely hashed.
-	Access to invoices and reports shall be controlled according to user roles.
-	Uploaded files shall be validated before processing and safely stored.
-	Sensitive invoice and user data shall be protected during transmission and storage.
-	Unauthorized users shall not be permitted to access another user's invoice information.
NFR-04: Availability and Reliability
-	The system shall handle invalid files and processing failures without crashing.
-	Errors shall be logged for troubleshooting purposes.
-	Errors presented to users shall use understandable messages.
-	Successfully uploaded invoices shall not be lost during processing.
-	The system shall maintain the consistency of stored invoice and verification data.
## NFR-05: Usability
-	The interface shall be understandable to accounting personnel with limited technical knowledge.
-	Validation issues shall include clear explanations of the identified problem.
-	The system shall identify the affected invoice field or calculation wherever applicable.
-	The system shall provide confirmation messages for successful uploads and report downloads.
-	Error messages shall provide sufficient information for users to understand the problem and take appropriate action.
## 4.2 Admin
NFR-06: Scalability
-	The system should support increasing invoice volumes without requiring major architectural changes.
-	Invoice processing should be designed so that extended processing operations have minimal impact on unrelated user activities.
-	The system should support increasing stored invoice and verification records within configured storage limits.
NFR-07: Maintainability
-	GST validation rules shall be implemented in a modular and documented manner.
-	Anomaly detection rules shall be modular and documented.
-	Risk-scoring logic shall be modular and documented.
-	The system shall use consistent coding, logging, and error-handling practices.
-	Changes to GST rules should be implementable without requiring major changes to unrelated system components.
## NFR-08: Compatibility
-	The system shall support current versions of commonly used web browsers.
-	The system shall support standard CSV files following the defined input format.
-	The system shall not require OCR for supported invoice files.
## NFR-09: Explainability
-	Every flagged issue shall identify the affected invoice field, value, or calculation where applicable.
-	The system shall provide a human-readable explanation for each GST compliance issue.
-	The system shall provide a human-readable explanation for each detected anomaly.
-	The system shall explain the factors contributing to an invoice's risk score.
-	Users shall be able to understand why an invoice or field was flagged without inspecting the underlying system code.
9. Constraints
-	The development and operation of the system are subject to the following constraints:
-	Only CSV files are supported.
-	Scanned, image-based, handwritten, or OCR-dependent invoices are not supported.
-	The system shall not use real-time government GST API verification.
-	GST validation rules are predefined and cannot be modified through the user interface.
-	Machine-learning-based anomaly detection is excluded.
-	Only Business User and Admin roles are supported.
-	Multi-company and multi-tenant functionality is excluded.
-	GST rules may change due to legal or regulatory updates and may require system maintenance.
-	The quality of verification depends on the completeness and accuracy of the uploaded invoice data.
- 	The system may use predefined tolerances for tax rounding differences.
-	The system is intended to assist invoice verification and does not replace professional accounting or legal/compliance judgment.
-	The system will only validate GST scenarios covered by its predefined rules.

10. Assumptions
-	The system is developed under the following assumptions:
-	Users have valid credentials and appropriate authorization.
-	CSV files follow the supported template and contain the required columns.
-	Invoice data is provided in a supported format and currency.
-	Supplier GSTIN, recipient GSTIN, and place-of-supply information are available when required for validation.
-	The system has access to predefined GST rates and validation rules.
-	GSTIN validation is performed using format, checksum, and state-code rules rather than live government verification.
-	The predefined GST rules used by the system are maintained when relevant regulatory changes occur.
-	Users review flagged issues before taking accounting or compliance action.
-	The organization provides suitable storage and backup facilities for invoice data and reports.
-	The expected invoice volume and file sizes remain within the system's configured limits.
-	Only authorized personnel upload, review, and download invoice information.
-	Users provide sufficiently complete and accurate invoice data for meaningful verification
