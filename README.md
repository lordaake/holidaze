# Holidaze Booking Platform

![Holidaze Screenshot](https://tordlarsson.com/assets/holidaze-screenshot-CWUvGlQ0.png)

## Project Overview

Holidaze is a modern accommodation booking platform that allows users to search for venues, make bookings, and manage their stays. Venue managers can also list, update, and manage bookings for their venues. This project demonstrates both technical and visual skills developed over two years, using the Noroff API to handle accommodation listings and bookings.

**Made by Tord Åke Larsson** as part of **Project Exam 2**.

## GitHub Profile
You can view my GitHub profile [here](https://github.com/lordaake).

## Features

### User-facing Features:
- **View Venues**: Users can browse a list of available venues.
- **Search Venues**: Users can search for venues by name or location.
- **View Venue Details**: Each venue has its own details page with information like location, amenities, and available dates.
- **User Registration**: Users can register as customers or venue managers.
- **Booking**: Registered users can make bookings at available venues.
- **Manage Bookings**: Registered users can view and manage their upcoming bookings.
- **Profile Update**: Users can update their profile and avatar.

### Admin-facing Features (Venue Managers):
- **Create and Manage Venues**: Venue managers can create, update, and delete their venues.
- **Manage Bookings**: Venue managers can view bookings made for their venues.

## Technologies Used

- **JavaScript Framework**: React (version 18.x)
- **CSS Framework**: Tailwind CSS (version 3.x)
- **Build Tool**: Vite (version 4.x)
- **Hosting**: Netlify
- **Design Tool**: Figma
- **Planning Tools**: Trello

## Setup and Installation

### Prerequisites:
- **Node.js**: Version 14 or higher
- **npm**: Version 6 or higher or yarn package manager

### Installation Steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/lordaake/holidaze.git
   ```

2. Navigate into the project directory:
   ```bash
   cd holidaze
   ```

3. Install dependencies:
   ```bash
   npm install
   ```
   Or if you're using yarn:
   ```bash
   yarn install
   ```

### Running the Project Locally:

1. Start the development server:
   ```bash
   npm run dev
   ```
   Or if you're using yarn:
   ```bash
   yarn dev
   ```

2. The app will be available at `http://localhost:3000`.

### Building for Production:

1. Create a production build of the application:
   ```bash
   npm run build
   ```
   Or if you're using yarn:
   ```bash
   yarn build
   ```

2. Deploy the contents of the `dist/` directory to your static hosting provider (Netlify, GitHub Pages, etc.).

## API Setup

1. This project uses the **Holidaze API** provided by Noroff.
2. You will need an API key, which is generated upon user login. The API key and authentication token should be stored in `localStorage` for future API requests.

## Key Components

- **AppRouter.jsx**: Manages the routing of the entire application.
- **Accommodations.jsx**: Displays a list of available accommodations with search and pagination functionality.
- **UserDashboard.jsx**: Shows information related to the user, such as their bookings and managed venues.
- **VenueCard.jsx**: A reusable component to display venue details.

## Deployment

1. It is recommended to deploy this project to **Netlify** or **GitHub Pages**.
2. The build files are located in the `dist/` directory after running the production build.

### Example for Netlify Deployment:

1. Install the Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Deploy the project:
   ```bash
   netlify deploy
   ```

## Planning and Design Resources

- **Mobile Design Prototype**: [Link to Mobile Figma prototype](https://www.figma.com/design/xyEvYW0pLHMCYUqN3H2BOs/Holidaze---Project-Exam?node-id=1-83&t=jmiEe8XOMi3a88wd-1)
 **Desktop Design Prototype**: [Link to Desktop Figma prototype](https://www.figma.com/design/xyEvYW0pLHMCYUqN3H2BOs/Holidaze---Project-Exam?node-id=0-1&t=jmiEe8XOMi3a88wd-1)
- **Style Guide**: Contains the chosen color palette, fonts, and component styles based on Tailwind CSS.
- **Trello**: [Link to Trello](https://trello.com/invite/b/66f8128b974dbf28ff5e9cc5/ATTI409d6499b88d10e9fdf251c64146b55c1748E8F7/project-exam-2-holidaze)

## Links

- **GitHub Repository**: [Link to GitHub Repository](https://github.com/lordaake/holidaze)
- **Live Demo**: [Link to Live Project on Netlify](https://holidaze-lordaake-pe.netlify.app/)
- **API Documentation**: [Link to API Documentation](https://docs.noroff.dev/docs/v2)

## How to Contribute

1. Fork the repository.
2. Create a new feature branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add new feature"
   ```
4. Push the branch:
   ```bash
   git push origin feature-name
   ```
5. Create a pull request for review.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
