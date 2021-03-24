# [Socialites](https://socialites-karthikey.herokuapp.com/)
I built a Social Networking Web Application from scratch using the MERN tech stack. The website is responsive and can be used in mobile browser as well. Find the [live version here](https://socialites-karthikey.herokuapp.com/)

## Website Features:
* Users can create a post, add comments and reactions, see which other users commented and reacted on different posts, and also chat with other users or in a group.
* Images can also be added in posts or in chats. 
* Posts and reactions to posts and comments can be filtered according to different categories or based on any content searched by user.
* Post, comments or chat messages can be edited or deleted any time by the user.
* Each user has a profile page which can be customized easily as per the needs of user.
* The number of unread messages are available on top of site as well as besides each chat.
* Online and Offline users in a personal chat or a group chat can be viewed easily.

## Authentication Features:
* Users can login and register using their **email** and verifying it or they can also login with **Google**.
* For a quick look, Users can also take a tour of the website by logging in as a **Guest**.
* Users can check the **Remember Me** option to login once for a specific period of time.
* The password is stored in database in a hashed format using **BcryptJs**. 
* For **Authorization**, Sessions are used with cookies for storing unique **sessionID**. All major requests to the server, send response only after verifying the session ID of user, which gets assigned to the user on successful login.

## Technologies and APIs Used:

## FrontEnd
* The FrontEnd is built using **Reactjs, CSS/Bootstrap, HTML** and **Hooks API** for state management in React.
* **Axios** Library for API integration and making requests to backend.
* **Fusejs** for implementing fuzzy search, based on the Jaro-Winkler algorithm for searching content in the site.
* **Chartjs** charting library for creating a Pie chart based on reactions and comments on posts of a user.
* **Howlerjs** for adding various sound effects.
* **Count API** for maintaining the count of number of visits to the home page of the website.

## Backend
* The Backend is built using **Nodejs** with **Express** framework.
* For database, **MongoDB** Atlas is used for storing data and querying is done via **Mongoose** ORM.
* **Redis** for mapping sessionID to user data, for authentication and authorization.
* **Socket.io** library for real time chat between multiple users.
* **Google OAuth2 API** for adding authentication with google.
* **Cloudinary API** for uploading and storing images on the cloud.
* **Sendgrid API** for sending emails to the users from server for email verification or to reset the password.

## Other Features:
* Fully reusable react components have been created and used in the website.
* Extensive **Error Handling** has been used for handling corner cases.
* Code is **modularized** and **refactored**, all the buisness logic part is separated from the APIs, middlewares, models etc. 

The Website is deployed on **Heroku** platform.

Some snapshots of the website:

Home Page
![Home](https://user-images.githubusercontent.com/66271249/105611159-ad32b500-5dd9-11eb-9689-29163e097d40.PNG)

Login Page
![Login](https://user-images.githubusercontent.com/66271249/105693719-132c5300-5f26-11eb-8444-5f9fa5fc9880.PNG)

Register Page
![Register](https://user-images.githubusercontent.com/66271249/105693722-145d8000-5f26-11eb-9e7d-f8dfa3db7edd.PNG)

All Posts Page
![all posts](https://user-images.githubusercontent.com/66271249/107873215-e80aa300-6ed6-11eb-81eb-4187dc34d1ca.PNG)

Complete Post Page
![complete post](https://user-images.githubusercontent.com/66271249/107873213-e6d97600-6ed6-11eb-8083-d6729295a67e.PNG)

Complete Comment Page
![complete comment](https://user-images.githubusercontent.com/66271249/107873216-e9d46680-6ed6-11eb-9a9c-b32e8392b0b3.PNG)

Create Post Page
![Create](https://user-images.githubusercontent.com/66271249/105693979-69999180-5f26-11eb-92bf-017d31270c66.PNG)

About Page
![About](https://user-images.githubusercontent.com/66271249/105693982-6b635500-5f26-11eb-8253-78b3a6f070be.PNG)

Reactions Page
![complete](https://user-images.githubusercontent.com/66271249/107852061-6d894700-6e34-11eb-8b7d-3e4ce3b00161.PNG)

All Users Page
![allusers1](https://user-images.githubusercontent.com/66271249/107873408-60be2f00-6ed8-11eb-8c49-43ae17404141.PNG)
![allusers2](https://user-images.githubusercontent.com/66271249/107873409-61ef5c00-6ed8-11eb-92dd-0d55837e5731.PNG)

Chat Room Pages
![room](https://user-images.githubusercontent.com/66271249/105694835-6521a880-5f27-11eb-9621-aa762b4fefec.PNG)
![room1](https://user-images.githubusercontent.com/66271249/105694840-66eb6c00-5f27-11eb-88c3-86100a487c9d.PNG)
![Capture](https://user-images.githubusercontent.com/66271249/107851975-b68ccb80-6e33-11eb-8cac-64694e426aad.PNG)
![Capture1](https://user-images.githubusercontent.com/66271249/107851977-b7bdf880-6e33-11eb-9061-6c7e9cd9a4cb.PNG)
![Capture2](https://user-images.githubusercontent.com/66271249/107851978-b8568f00-6e33-11eb-9e15-2669d4bad718.PNG)


User Profile Pages
![Profile1](https://user-images.githubusercontent.com/66271249/105694988-8bdfdf00-5f27-11eb-925d-4219ffabbbb3.PNG)
![Profile](https://user-images.githubusercontent.com/66271249/105694996-8da9a280-5f27-11eb-862c-59b569ca5cdb.PNG)


