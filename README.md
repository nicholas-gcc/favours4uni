# Favours 4 Uni
An application for students, by students
<img width="1437" alt="image" src="https://github.com/nicholas-gcc/favours4uni/assets/69677864/87e15700-e391-412b-b3ab-19f006a9ed1f">



## Development Team:
* Augustine Kau
* Cheok Su Anne
* Jordan Yoong
* Nicholas Canete

Our hosted web application can be viewed at: 
https://favours4uni.web.app/dashboard


## Hosting this application locally:
1. Clone/Fork the repository to you local computer by using the command: `git clone https://github.com/CS3219-SE-Principles-and-Patterns/cs3219-project-ay2122-2122-s1-g30.git`
2. Run `cd Backend`, `npm install -g firebase-tools`, `firebase serve` on one terminal
3. Run `cd Frontend`, `npm ci`, `ng serve` on another terminal
4. Your application is now deployed locally! You can visit the website at http://localhost:4200. If you get the error command ng isn't found, you might need to run `npm install @angular/cli`

## Reflections:
* As a first attempt at designing a full CRUD app, I understand some of the code is messy. This project was built with speed of implementation in mind. With more time and knowledge looking back, this can and should be refactored into a proper microservice architecture. For anyone viewing this project, while it is not actively maintained, I'd love to discuss ideas with you for my learning!
* Ideally, APIs for favours, authentication and chats would be sitting behind an API gateway, and each service having its own deployment environment independent of a central monolithic structure dependent on Firebase so there is no single point of failure
* The chats service should be built with WebSockets
* Each service should have a well-defined structure, separating components into models, controllers, validators, middleware and configurations.




