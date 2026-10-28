# Development Tasks — Camp Booking App

## 1. Prepare Form and Data Handling

- [ ] Define the fields, input types, required status, and allowed values for each entity form.
- [ ] Generate a unique `id` automatically for every new record.
- [ ] Add reusable JavaScript helpers for reading form values, validating data, and reporting errors.

## 2. Add Child, Parent, and Camp Shift Forms

- [ ] Add a form for children with fields matching the `Child` entity.
- [ ] Add a form for parents or legal guardians with fields matching the `Parent` entity.
- [ ] Add a form for camp shifts with fields matching the `CampShift` entity.
- [ ] Use selection controls for child gender and parent relationship.
- [ ] Keep optional fields optional.

## 3. Add the Booking Form

- [ ] Add a form with selectors for existing children, parents or legal guardians, and camp shifts.
- [ ] Add selectors for booking status and payment status, plus an optional comment field.
- [ ] Store the selected records' IDs in `parentId`, `childId`, and `shiftId`.
- [ ] Refresh the selector options when the related entity records change.

## 4. Load and Initialize Data from `localStorage`

- [ ] Load the children, parents, camp shifts, and bookings arrays from `localStorage` on startup.
- [ ] When an entity has no saved data, initialize it from the existing sample records and save those records to `localStorage`.
- [ ] Handle unavailable or invalid saved data and provide a clear message if it cannot be recovered.

## 5. Validate and Add Records

- [ ] Validate required fields before adding a record.
- [ ] Validate that a camp shift's end date is not earlier than its start date.
- [ ] Validate that price and capacity are non-negative numbers.
- [ ] Do not add invalid records; show a clear error message to the user.
- [ ] After a successful submission, clear the form and provide appropriate feedback.

## 6. Persist Changes and Refresh Tables

- [ ] Add each valid record to the matching in-memory array.
- [ ] Save the updated entity array to `localStorage` after a successful addition.
- [ ] Refresh the corresponding table without reloading the page.
- [ ] Ensure booking tables display the names and shift details resolved from the selected IDs.

## 7. Verify the Main Scenarios

- [ ] Add one record of each entity type and confirm IDs are generated automatically.
- [ ] Confirm invalid or incomplete data is rejected.
- [ ] Reload the page and confirm added records are restored from `localStorage`.
- [ ] Confirm booking selectors and displayed relationships use the restored records correctly.
