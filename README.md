Overview
This web application is designed for caregivers to manage and monitor patient activity and health-related logs, all in connection with the Pepper robot’s tablet interface. To run the application locally, open the terminal and type npm install or sudo npm install, to install dependencies after they are installed run npm start or sudo npm start, depending on your system setup and permissions,. The app will open in your browser on http://localhost:3000.

A test caregiver account has already been registered for demonstration purposes. You can sign in using the following credentials:
Email: test123@gmail.com
Password: test12345

After signing in, you can explore all the different pages and sections of the website. Some content has already been added (such as in the Tasks and Alerts pages) to provide visual examples and guidance. For a better understanding of how the system works, you can also try interacting with the tablet interface (from Pepper) for example, confirming medication for a specific patient, logging an exercise, or submitting a help request. These actions will appear in real-time on the website, making it easier to visualise how data flows between Pepper and the caregiver platform.

As a reminder, exercise logs and confirmed medication statuses are refreshed daily, since these are meant to be tracked on a daily basis. So, if you would like to test these features, you should log them from the HTML pages on Pepper’s tablet, then return to this website and refresh the page to view the updates.

Pages and Features
The Sign In and Register pages allow known caregivers to register or log in to the system. There is also a Forgot Password feature which is functional for users who need to reset their credentials.

After signing in, you are taken to the Main Page, which includes a navigation bar that lets you easily access all other sections of the application.

As explained in the FYP write-up, the following are the main pages:

Patients Page: Lists all patients along with their details. You can view their current medication list and see whether they’ve confirmed taking their medication, as logged via Pepper’s tablet interface. The confirmation resets to “No” every day so that daily monitoring remains accurate. Clicking on a patient opens the Patient Details Page, where you can view all personal and medical details of that patient. As a caregiver, you can also click the Edit button to update patient information or medication.

Tasks Page: A simple to-do list style page for caregivers to manage and keep track of daily tasks. A few example tasks have been added for visual reference.

Pepper Page: A help page designed to guide caregivers on how to use Pepper, including example voice commands and basic support.

Exercise Page: Displays logs of daily exercise activity completed by patients, pulled from Pepper's tablet. Like medication, these logs are refreshed daily, as exercises are intended to be done once per day.

Alerts Page: Displays all help requests submitted by patients from Pepper’s tablet interface. Caregivers can view, address, and delete alerts based on whether they’ve been handled.

Logout Button: Allows caregivers to safely sign out of their session when finished.

Style and Usability
All pages have corresponding CSS files that ensure the website remains clear, consistent, and easy to use. The design was intentionally kept simple to promote usability and reduce cognitive load for busy caregivers.
