## Patch Component

### 1. **Selection Process Overview**

- **Purpose:** The selection process guides the user through a series of dropdown menus to ensure accurate patching of fixtures.
- **Flow:**
  1.  **Select Manufacturer:** The first dropdown allows the user to select the manufacturer of the fixture.
  2.  **Select Fixture:** Based on the manufacturer selection, the user can then choose the specific fixture from a filtered list.
  3.  **Select Profile:** After the fixture is selected, the user chooses the appropriate profile, which defines the behavior and capabilities of the fixture.
  4.  **Select Channel Number:** The user selects the channel number to assign to the fixture.
  5.  **Address Suggestion:** An address is automatically suggested based on the selected profile. This address can be adjusted, but the size must always match the profile size.

### 2. **Technical Specifications**

- **Dropdown Menus:**
  - **Manufacturer Dropdown:**
    - A dynamic list populated with available manufacturers.
  - **Fixture Dropdown:**
    - Filtered based on the selected manufacturer.
  - **Profile Dropdown:**
    - Filtered based on the selected fixture.
  - **Channel Number Dropdown:**
    - May include options based on available channels or allow the user to input a custom number.
- **Address Handling:**
  - **Suggested Address:** The system calculates a default address based on the selected profile and other parameters.
  - **Manual Adjustment:** Users can manually adjust the suggested address, with a validation to ensure that the size equals the profile size.

### 3. **Implementation Details**

- **State Management:**
  - Each dropdown's state is managed to ensure that the options are filtered correctly based on previous selections.
- **Validation Rules:**
  - Ensure that the size of the adjusted address matches the profile size.
  - Check if channel is in use. _All scenes for a show share the same patch/channel/fixtureAssignments_
- **UI Feedback:**
  - Provide real-time feedback if the user attempts to select an invalid address size or channel number.
- **APIs:**
  - **Fetch Manufacturer Data:** Endpoint to retrieve available manufacturers.
  - **Fetch Fixture Data:** Endpoint to retrieve fixtures filtered by manufacturer.
  - **Fetch Profile Data:** Endpoint to retrieve profiles filtered by fixture.
  - **Address Suggestion Logic:** Backend logic to suggest an appropriate address based on profile and other parameters.

### 4. **Testing Plan**

- **Unit Tests:**
  - Test the dropdown filtering logic to ensure that each step in the selection process behaves correctly.
- **Integration Tests:**
  - Validate the interaction between the UI, state management, and backend to ensure smooth operation from manufacturer selection to address suggestion.
- **Validation Tests:**
  - Specifically test the address adjustment functionality to ensure that any manual changes adhere to the profile size rules.

### 5. **Known Issues and Limitations**

- **Bugs:**
  - Identify and document any known issues, such as potential delays in loading large lists of manufacturers or fixtures.
- **Limitations:**
  - Note any limitations, such as the number of manufacturers or fixtures supported, or constraints in the UI that may impact usability.

### 6. **Future Enhancements**

- **Improved Address Suggestions:** Consider implementing more advanced logic for address suggestions based on additional parameters like existing patches.
- **Preset Profiles:** Allow users to save and reuse preset combinations of manufacturer, fixture, profile, and channels for quicker patching.
- **Fixture Search:** Allow search for fixtures, as a full library grows quite large.
