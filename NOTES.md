# NOTES.md

## Thought Process and Assumptions

- **Report Creation:**
  - I assumed that each report requires a unique `issueId` generated on the fly (using a 24-character hexadecimal string similar to MongoDB's ObjectId).
  - For the `user` field, I used a generated ObjectId as a placeholder while we determine how to authenticate or identify the actual user.

- **File Upload (Dropzone):**
  - The file dropzone works to accept image and video files and resize them when necessary using the Pica library.
  - However, the current implementation does not store the resulting file URLs to a cloud storage service. Instead, the resized file objects are simply stored locally in the report object.
  - There is a potential enhancement to integrate with a cloud storage provider (such as AWS S3, Google Cloud Storage, etc.) to upload files and store their public URLs in the database.

- **Error Handling and Data Validation:**
  - Error handling is currently basic. I added console logs and alert messages, but more robust error management (e.g., user-friendly error messages, error boundaries, logging to external monitoring services) would be ideal.
  - Validation of data in both the frontend forms and backend endpoints is minimal. More strict validation (e.g., using libraries like Yup or Joi) would ensure data integrity.

## What Else Could Have Been Done (But Was Not Completed Due to Time Constraints)

- **User Authentication:**
  - Implement a proper user authentication mechanism so that the `user` field accurately reflects the authenticated user’s ID rather than a randomly generated placeholder.
  
- **File Upload and Storage:**
  - Integrate cloud storage (for example, using AWS S3) to store uploaded files and save their public URLs in the report document.
  - Implement a service to handle file uploads separately and update the report data with the resulting URLs.

- **Enhanced Error Handling and Data Validation:**
  - Improve error handling on both the frontend and backend with more detailed user feedback and error logging.
  - Add stricter data validation for the forms (for example, using Yup on the client side and Joi on the server side).

- **UI/UX Improvements:**
  - Enhance the UI design to create a more visually appealing and user-friendly interface.
  - Add loading spinners, tooltips, and animations to improve the overall user experience.

- **Additional Features:**
  - Implement pagination, sorting, and filtering on the reports table to handle large datasets more efficiently.
  - Introduce a dashboard or summary view that provides insights or metrics about the reports.

## Next Steps to Complete the Task and Feature

1. **User Management:**
   - Integrate a user authentication system (e.g., JWT, OAuth) and modify the report creation logic to use the authenticated user's ID.
  
2. **Cloud File Storage:**
   - Set up an account with a cloud storage provider.
   - Update the file uploader to upload files to the cloud and then store the returned file URL in the report.
  
3. **Improved Validation and Error Handling:**
   - Use libraries such as Yup (for frontend) and Joi (for backend) to perform robust validation of report data.
   - Implement error boundaries in React to gracefully handle and display errors to the user.
  
4. **UI Enhancements:**
   - Redesign the forms and table to be more modern and visually appealing.
   - Consider using Material-UI themes and custom styles to match a desired branding style.

## Suggestions on Best Approaches to Build the Feature

- **Modular Design:**
  - Keep the UI components modular and reusable. This makes it easier to update or extend functionality later.
  
- **State Management:**
  - For more complex state management, consider using React Context or a state management library such as Redux, especially if the application grows.
  
- **API Integration:**
  - Use Axios interceptors for handling API errors globally.
  - Separate API calls into a dedicated service layer to decouple the UI from backend communication.

- **Testing:**
  - Write unit tests and integration tests for components and API endpoints to ensure code reliability.