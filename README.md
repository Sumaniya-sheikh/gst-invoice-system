# GST-Invoice-Compliance-and-Anomaly-Detection
The GST Invoice Compliance & Anomaly Detection System — a web-based platform for businesses and accounting staff to upload invoices and automatically catch GST errors (CGST/SGST/IGST mismatches), duplicate entries, missing/inconsistent data, and invalid GSTINs, with clear explanations for every flagged issue.

#1.	Problem Statement
Businesses and accounting personnel manually examine large numbers of invoices for GST-related correctness, including CGST, SGST, and IGST, as well as other invoice anomalies such as incorrect data and duplicate entries. As the volume of invoices increases, this process becomes time-consuming and prone to human error, making it difficult to consistently identify incorrect GST calculations, duplicate invoices, and other invoice inconsistencies.
-	For whom: Businesses and accounting personnel.
-	What they do: Manually examine and verify business invoices.
-	Why it becomes difficult: A large volume of invoices makes the process time-consuming and error-prone.
-	Consequences: Incorrect GST calculations, duplicate invoices, and other inconsistencies may be missed.

#2. Proposed Solution
The proposed solution is a web-based invoice verification system that analyses uploaded business invoices for GST-related errors, duplicate entries, missing information, and inconsistent invoice data. The system will validate invoice information against predefined GST rules, identify potential anomalies, assign risk levels, and provide clear explanations for the identified issues.

#3. Objectives
The main objectives of the system are Efficiency, Accuracy and Consistency, Explainability, and GST Compliance Validation.
- Efficiency: Reduce the time and manual effort required to verify large volumes of business invoices.
- Accuracy and Consistency: Improve the reliability and consistency of invoice verification by reducing errors and missed issues during manual examination.
- Explainability: Provide clear and understandable explanations for each flagged issue so that accounting personnel can quickly understand, verify, and act upon identified problems.
- GST Compliance Validation: Ensure that invoices are evaluated against applicable GST requirements, including GSTIN validity, tax calculations, and the correct applicability of CGST, SGST, and IGST.


#4. Users

4.1 Business User
A Business User is an accounting personnel or authorized employee responsible for submitting and reviewing business invoices.

Capabilities:
-	Upload business invoices for verification.
-	View information extracted or parsed from uploaded invoices.
-	View GST compliance results.
-	View identified invoice anomalies and risk results.
-	Download invoice verification reports.

4.2 Admin
An Admin is an authorized user responsible for managing Business Users and overseeing invoice verification activities across the system.

Capabilities:
-	Create, update, deactivate, and manage Business User accounts.
-	View invoices submitted by Business Users.
-	View invoice verification and compliance results.
-	View anomaly and risk results.
-	Monitor invoice processing activities.
-	Access and generate system reports.
#5. In Scope
-	The following functionalities are included within the scope of the system:
-	Ingestion of business invoice data through CSV files and text-based PDF files.
-	Extraction and presentation of relevant invoice information from uploaded files.
-	Validation of GSTINs and applicable GST-related information.
-	Validation of CGST, SGST, and IGST calculations and applicability.
-	Detection of invoice anomalies using rule-based and predefined statistical approaches.
-	Detection of duplicate and near-duplicate invoices.
-	Assignment of risk scores based on identified anomalies and compliance issues.
-	Role-based access for Business Users and Admins.
-	Dashboard for viewing invoice verification and analysis results.
-	Generation and downloading of invoice verification reports.
-	Recording of relevant user activities through an audit trail.

#6. Out of Scope
The following functionalities are excluded from the current version of the system:
-	OCR-based processing of scanned or image-based invoices.
-	Machine-learning-based anomaly detection, including Isolation Forest.
-	An Auditor role or separate Auditor portal.
-	Real-time integration with government GST APIs for online verification.
-	Multi-company or multi-tenant support.
-	Configuration or modification of GST validation rules through a user-facing interface.
-	Automated submission of invoices or GST returns to government systems.


 #7. Functional Requirement
 #8. Non Functional Requirement
