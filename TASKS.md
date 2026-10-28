# TASKS.md — Camp Booking Management System

## General Rules

1. Read `SPEC.md` before starting each task.
2. Implement only the functionality described in the current task.
3. Follow the existing project structure and coding conventions.
4. Use plain HTML, CSS, and JavaScript without third-party libraries or frameworks.
5. Reuse existing functions and components whenever appropriate.
6. Do not introduce unrelated features or refactor unrelated code.
7. Preserve existing functionality unless the current task explicitly requires changing it.
8. Verify the implementation against the acceptance criteria before completing each task.
9. Use JavaScript arrays as the in-memory data source and `localStorage` for persistence.
10. Do not implement record editing or deletion unless explicitly requested in a future task.
11. Keep data initialization, validation, form handling, persistence, and UI rendering logically separated.
12. Update `SPEC.md` only when an implementation decision reveals a genuine mismatch with the agreed requirements.

---

## TASK-01. Implement Shared Form Utilities

### Goal

Create reusable JavaScript utilities for reading form values, validating input, and generating unique IDs for new records.

### Requirements

1. Implement reusable functions for retrieving values from form fields.
2. Support text, date, numeric, and select input fields.
3. Implement reusable validation helpers for required fields and basic input constraints.
4. Implement a function for generating unique IDs for new records.
5. Ensure generated IDs do not conflict with existing records in the corresponding entity array.
6. Keep the utilities independent of specific entity forms so they can be reused for children, parents, camp shifts, and bookings.
7. Avoid duplicating form-reading, validation, and ID-generation logic across entity-specific implementations.
8. Keep the utilities compatible with plain JavaScript and the existing project structure.

### Acceptance Criteria

- Reusable form utility functions are available in the project.
- Form values can be read consistently.
- Required-field validation can be reused across forms.
- New records receive unique IDs.
- Generated IDs do not conflict with existing IDs in the relevant entity array.
- The utilities do not depend on third-party libraries.
- Existing functionality remains operational.

---

## TASK-02. Load and Initialize Records from localStorage

### Goal

Load saved entity records from `localStorage` during application startup and initialize missing or invalid data safely.

### Requirements

1. Implement startup logic that loads `children`, `parents`, `campShifts`, and `bookings` from `localStorage`.
2. Use separate, clearly defined storage keys for each entity.
3. If a storage key does not exist, initialize that entity array from the sample records defined in the project.
4. Parse stored JSON safely and handle malformed data without crashing the application.
5. Validate that loaded data has the expected basic structure before using it.
6. Handle cases where `localStorage` is unavailable or access is denied.
7. Ensure that the application can still start using in-memory data if storage access fails.
8. Preserve valid stored records when initializing missing data for other entities.
9. Handle booking records that reference missing children, parents, or camp shifts without crashing the application.
10. Make the initialized arrays available before rendering tables or populating form selectors.
11. Keep data initialization separate from form submission and record creation logic.
12. Avoid overwriting valid stored data with sample records unnecessarily.

### Acceptance Criteria

- Existing valid records are loaded from `localStorage` on startup.
- Missing entity data is initialized from sample records.
- Initializing one missing entity does not overwrite other valid stored entities.
- Malformed or structurally invalid stored data does not crash the application.
- The application remains usable when `localStorage` is unavailable, with persistence disabled for that session.
- Tables and form selectors are initialized only after the entity arrays have been prepared.
- Valid stored records are not unnecessarily replaced by sample data.
- Existing tab navigation and table rendering continue to work.

---

## TASK-03. Validate Form Submissions

### Goal

Implement shared validation rules for all entity creation forms before implementing the individual forms.

### Requirements

1. Extend the shared utilities from TASK-01 where necessary to support the validation rules in this task.
2. Define reusable validation rules for the child, parent, camp shift, and booking entities.
3. Validate required fields according to `SPEC.md`.
4. Reject required text fields that are empty or contain only whitespace.
5. Validate date values and reject invalid date ranges.
6. Require a camp shift end date to be on or after its start date.
7. Reject negative prices and negative capacity values.
8. Require price and capacity to be valid numeric values.
9. Require capacity to be a positive whole number.
10. Ensure that booking selections reference existing child, parent, and camp shift records.
11. Ensure that booking and payment statuses belong to the allowed sets defined in `SPEC.md`.
12. Validate email format when an email address is required or provided.
13. Validate phone numbers sufficiently to reject empty or obviously malformed values, without assuming a single international format.
14. Return validation results in a consistent format that can be used by any form.
15. Provide useful validation messages that can be displayed near the relevant fields or in a form-level error area.
16. Keep validation separate from record creation and persistence.
17. Ensure that validation does not modify entity arrays or stored data.

### Acceptance Criteria

- Reusable validation rules are available for all four entity types.
- Required fields are validated consistently.
- Empty or whitespace-only required text fields are rejected.
- Invalid date ranges are rejected.
- Negative prices and capacities are rejected.
- Capacity must be a positive integer.
- Booking references must point to existing records.
- Booking and payment statuses must be valid.
- Invalid email addresses are rejected when provided.
- Validation results can be displayed by entity-specific forms.
- Invalid data is rejected before any record is created or persisted.

---

## TASK-04. Add Child Creation Form

### Goal

Implement a form that allows users to create new `Child` records using the shared utilities and validation rules.

### Requirements

1. Add a form for creating child records.
2. Include fields corresponding to the `Child` entity properties defined in `SPEC.md`.
3. Include first name, last name, date of birth, and gender fields.
4. Include a gender selector with predefined options consistent with the application's data model.
5. Include optional middle name and notes fields.
6. Use the shared form utilities from TASK-01.
7. Apply the validation rules established in TASK-03.
8. Generate a unique ID for each new child record.
9. Prepare the new record in the same structure as the existing objects in the `children` array.
10. Provide a clear submission control and a way to display validation errors.
11. Keep the form consistent with the existing application interface.
12. Do not duplicate persistence logic that belongs to TASK-08.

### Acceptance Criteria

- Users can enter the required child information.
- Gender can be selected from predefined options.
- Middle name and notes can be left empty.
- Required fields are validated.
- A unique ID is generated automatically.
- A valid submission produces a correctly structured child record for the application's creation flow.
- Invalid submissions do not create records.
- Validation errors are presented clearly.
- Existing tables and tab navigation continue to work.

---

## TASK-05. Add Parent Creation Form

### Goal

Implement a form that allows users to create new `Parent` records using the shared utilities and validation rules.

### Requirements

1. Add a form for creating parent or legal guardian records.
2. Include fields corresponding to the `Parent` entity properties defined in `SPEC.md`.
3. Include first name, last name, phone number, and email fields.
4. Include a relationship selector with predefined options, such as mother, father, and legal guardian.
5. Include an optional middle name field.
6. Use the shared form utilities from TASK-01.
7. Apply the validation rules established in TASK-03.
8. Generate a unique ID for each new parent record.
9. Prepare the new record in the same structure as the existing objects in the `parents` array.
10. Provide a clear submission control and a way to display validation errors.
11. Do not duplicate persistence logic that belongs to TASK-08.

### Acceptance Criteria

- Users can enter the required parent information.
- The relationship can be selected from predefined options.
- The middle name can be left empty.
- Required fields and provided email addresses are validated.
- A unique ID is generated automatically.
- A valid submission produces a correctly structured parent record for the application's creation flow.
- Invalid submissions do not create records.
- Validation errors are presented clearly.
- Existing tables and tab navigation continue to work.

---

## TASK-06. Add Camp Shift Creation Form

### Goal

Implement a form that allows users to create new `CampShift` records using the shared utilities and validation rules.

### Requirements

1. Add a form for creating camp shift records.
2. Include fields corresponding to the `CampShift` entity properties defined in `SPEC.md`.
3. Include shift name, start date, end date, price, capacity, and description fields.
4. Use appropriate input types for dates and numeric values.
5. Use the shared form utilities from TASK-01.
6. Apply the validation rules established in TASK-03.
7. Generate a unique ID for each new camp shift.
8. Prepare the new record in the same structure as the existing objects in the `campShifts` array.
9. Provide a clear submission control and a way to display validation errors.
10. Do not duplicate persistence logic that belongs to TASK-08.

### Acceptance Criteria

- Users can enter the required camp shift information.
- Start and end dates can be selected using date inputs.
- Invalid date ranges are rejected.
- Price accepts valid non-negative numeric input.
- Capacity must be a positive integer.
- A unique ID is generated automatically.
- A valid submission produces a correctly structured camp shift record for the application's creation flow.
- Invalid submissions do not create records.
- Validation errors are presented clearly.
- Existing tables and tab navigation continue to work.

---

## TASK-07. Add Booking Creation Form

### Goal

Implement a form that allows users to create new `Booking` records linked to existing children, parents, and camp shifts.

### Requirements

1. Add a form for creating booking records.
2. Include a child selector populated from the `children` array.
3. Include a parent or legal guardian selector populated from the `parents` array.
4. Include a camp shift selector populated from the `campShifts` array.
5. Display meaningful labels in the selectors, such as names and shift dates, rather than technical IDs alone.
6. Include the booking creation date where appropriate.
7. Include a booking status selector using the values defined in `SPEC.md`.
8. Include a payment status selector using the values defined in `SPEC.md`.
9. Include an optional comment field.
10. Use the shared form utilities from TASK-01.
11. Apply the validation rules established in TASK-03.
12. Generate a unique ID for each new booking.
13. Store the selected `childId`, `parentId`, and `shiftId` in the booking record.
14. Prepare the new record in the same structure as the existing objects in the `bookings` array.
15. Handle cases where no children, parents, or camp shifts are available for selection.
16. Prevent submission when required related records are unavailable.
17. Do not duplicate persistence logic that belongs to TASK-08.

### Acceptance Criteria

- Users can select existing children, parents, and camp shifts.
- Selectors display meaningful labels.
- Booking and payment statuses can be selected.
- The created booking stores the correct related record IDs.
- A unique ID is generated automatically.
- A valid submission produces a correctly structured booking record for the application's creation flow.
- The form handles empty entity arrays gracefully.
- Invalid submissions do not create records.
- Validation errors are presented clearly.
- Existing tables and tab navigation continue to work.

---

## TASK-08. Persist New Records and Refresh the UI

### Goal

Integrate the creation forms with in-memory data, `localStorage`, and the existing tables and selectors.

### Requirements

1. Implement a shared record-creation flow that accepts a validated new record and its target entity array.
2. Add successfully validated records to the appropriate in-memory array.
3. Persist the updated array to its corresponding `localStorage` key.
4. Handle persistence failures gracefully.
5. Ensure that a failed persistence operation does not leave the in-memory state and persisted state silently inconsistent.
6. Refresh the relevant table after a record is created.
7. Update the booking form selectors when a child, parent, or camp shift is created.
8. Ensure that newly created records appear in booking selectors without requiring a page reload.
9. Reset the submitted form after successful creation and persistence.
10. Display a clear success message only after the record has been saved successfully.
11. Display an appropriate error message when persistence fails.
12. Prevent duplicate records caused by accidental repeated submission.
13. Preserve the current active tab unless the interface design requires otherwise.
14. Keep record creation and persistence logic separate from the entity-specific form markup.
15. Ensure that the booking table displays related child, parent, and camp shift information using the existing relationship-resolution logic.

### Acceptance Criteria

- Valid new records are added to the appropriate entity arrays.
- Successfully saved records persist after a page reload.
- The relevant table updates without reloading the page.
- Booking selectors reflect newly created children, parents, and camp shifts.
- Forms reset after successful creation and persistence.
- Users receive appropriate success or error feedback.
- A failed persistence operation does not produce a misleading success message.
- Failed persistence does not silently leave the application's in-memory data inconsistent with the stored data.
- Repeated submissions do not unintentionally create duplicate records.
- Existing tab navigation and table rendering continue to work.

---

## TASK-09. Verify Record Creation and Persistence Flows

### Goal

Verify that all entity creation forms, validation rules, relationships, and persistence flows work correctly.

### Requirements

1. Verify creation of child records.
2. Verify creation of parent records.
3. Verify creation of camp shift records.
4. Verify creation of booking records.
5. Verify automatic ID generation for every entity.
6. Verify rejection of invalid form submissions.
7. Verify required-field validation, email validation, date range validation, and numeric constraints.
8. Verify that booking records store the correct `childId`, `parentId`, and `shiftId`.
9. Verify that newly created records appear in their corresponding tables.
10. Verify that newly created records appear in the relevant booking form selectors.
11. Reload the page and verify that successfully saved records remain available.
12. Verify startup behavior when storage keys are missing or contain malformed data.
13. Verify behavior when `localStorage` is unavailable or a write operation fails.
14. Verify that the application remains usable after validation and storage errors.
15. Check the browser console for errors.
16. Verify compliance with `SPEC.md` and confirm that no third-party libraries or frameworks have been introduced.

### Acceptance Criteria

- All four entity types can be created using their respective forms.
- IDs are generated automatically and do not conflict with existing IDs.
- Invalid submissions are rejected with useful error messages.
- Valid records are saved and remain available after page reload.
- Booking relationships are stored correctly and displayed using meaningful labels.
- Newly created records are reflected in tables and booking selectors.
- Missing, malformed, or unavailable storage is handled gracefully.
- Persistence failures do not produce misleading success messages or silently corrupt in-memory data.
- No critical JavaScript errors remain.
- The application meets the requirements defined in `SPEC.md`.

---

## Implementation Notes

- Complete the tasks in the order listed.
- TASK-01 establishes shared utilities.
- TASK-02 initializes application data before forms depend on it.
- TASK-03 establishes reusable validation rules before form implementation.
- TASK-04 through TASK-07 implement the individual entity forms.
- TASK-08 integrates validated record creation, persistence, and UI updates.
- TASK-09 verifies the complete application flow.
- Keep data initialization, validation, form handling, persistence, and UI rendering logically separated.
- Do not introduce a backend, database, record editing, or deletion functionality as part of these tasks.
- If an existing implementation conflicts with a requirement, identify the conflict and make only the changes necessary to satisfy the current task.

