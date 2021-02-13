# [Socialites](https://socialites-karthikey.herokuapp.com/)
I built a Social Networking Web Application from scratch using the MERN tech stack. The website is responsive and can be used in mobile browser as well. Find the [live version here](https://socialites-karthikey.herokuapp.com/)


## Website Features:
1. Users first have to register themselves to the site using their email and verify that email or they can quickly login using Google.
2. Users can create a post with/without an image related to chosen category. 
3. Users can also edit and delete their posts.
4. Users can comment and react on posts.
5. Users can see which users commented and reacted on which posts.
6. The posts can be filtered based on category or any content searched by the user.
7. Users can customize their profile page as they want by adding a profile picture and writing a suitable Bio.
8. Users can also chat with other users in real time, either personally or by creating a room and sharing that roomID.
9. Search option, sound effects and many filters have been added to provide good user experience.
10. For a quick look, Users can also take a tour of the website by logging in as a guest.
11. Users can also check the "remember me" option to login once for 7 days.
12. Users can also see which other users are online in a group or a personal chat.


## Technical Features:
1. The front end is built using Reactjs, HTML, CSS and Bootstrap.
2. The backend is built using Nodejs and Expressjs with MongoDB database.
3. Used sessions with cookies and Bcryptjs for user authentication.
4. Used redis for mapping session data to user data.
5. Used Socket.io library for adding real time chat feature.
6. Used Google OAuth2 API for authentication with google.
7. Used Cloudinary API for uploading and storing images uploaded by user.
8. Used Sendgrid API for sending emails from server for email verification or to reset the password.
9. Used Count API for maintaining the count of number of visits to the home page of the website.
10. Used Chartjs with React for creating Pie chart based on reactions and comments on posts of the user.
11. Used Fusejs for implementing fuzzy search, based on the Jaro-Winkler algorithm for searching in the site.
12. Used Howlerjs for adding various sound effects.

The Website is deployed on Heroku platform.

(Earlier I used JsonWebToken for token based authentication but then I changed it to session based authentication with cookies)

Some snapshots of the website:

Home Page
![Home](https://user-images.githubusercontent.com/66271249/105611159-ad32b500-5dd9-11eb-9689-29163e097d40.PNG)

Login Page
![Login](https://user-images.githubusercontent.com/66271249/105693719-132c5300-5f26-11eb-8444-5f9fa5fc9880.PNG)

Register Page
![Register](https://user-images.githubusercontent.com/66271249/105693722-145d8000-5f26-11eb-9e7d-f8dfa3db7edd.PNG)

All Posts Page
![AllPosts](https://user-images.githubusercontent.com/66271249/105693824-3820c600-5f26-11eb-8987-e1623816550e.PNG)

Complete Post Page
![Complete Post](https://user-images.githubusercontent.com/66271249/105693832-3bb44d00-5f26-11eb-8c44-c4ec63fcc8ee.PNG)

Complete Comment Page
![completeComment](https://user-images.githubusercontent.com/66271249/105693843-3e16a700-5f26-11eb-8af4-7c9cd3c8da94.PNG)

Create Post Page
![Create](https://user-images.githubusercontent.com/66271249/105693979-69999180-5f26-11eb-92bf-017d31270c66.PNG)

About Page
![About](https://user-images.githubusercontent.com/66271249/105693982-6b635500-5f26-11eb-8253-78b3a6f070be.PNG)

Reactions Page
![Reactions](https://user-images.githubusercontent.com/66271249/105693998-6f8f7280-5f26-11eb-8c92-0a0ea35e68a0.PNG)

All Users Page
![chats](https://user-images.githubusercontent.com/66271249/105694848-69e65c80-5f27-11eb-8699-3f12473c05a2.PNG)

Chat Room Pages
![room](https://user-images.githubusercontent.com/66271249/105694835-6521a880-5f27-11eb-9621-aa762b4fefec.PNG)
![room1](https://user-images.githubusercontent.com/66271249/105694840-66eb6c00-5f27-11eb-88c3-86100a487c9d.PNG)
![Capture](https://user-images.githubusercontent.com/66271249/107851975-b68ccb80-6e33-11eb-8cac-64694e426aad.PNG)
![Capture1](https://user-images.githubusercontent.com/66271249/107851977-b7bdf880-6e33-11eb-9061-6c7e9cd9a4cb.PNG)
![Capture2](https://user-images.githubusercontent.com/66271249/107851978-b8568f00-6e33-11eb-9e15-2669d4bad718.PNG)


User Profile Pages
![Profile1](https://user-images.githubusercontent.com/66271249/105694988-8bdfdf00-5f27-11eb-925d-4219ffabbbb3.PNG)
![Profile](https://user-images.githubusercontent.com/66271249/105694996-8da9a280-5f27-11eb-862c-59b569ca5cdb.PNG)


