import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Accommodations from './pages/Accommodations';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import ManageVenues from './pages/ManageMyVenuesPage';
import ManageBookings from './pages/ManageBookings';
import VenueDetails from './pages/VenueDetails';
import Contact from './pages/Contact';
import CreateVenuePage from './pages/CreateVenuePage';
import UserBookings from './pages/UserBookings';
import UpdateBooking from './components/UpdateBooking';
import UserProfile from './pages/UserProfile';

function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/accommodations" element={<Accommodations />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route path="/manage-venues" element={<ManageVenues />} />
            <Route path="/manage-bookings" element={<ManageBookings />} />
            <Route path="/venues/:id" element={<VenueDetails />} />
            <Route path="/create-venue" element={<CreateVenuePage />} />
            <Route path="/edit-venue/:id" element={<CreateVenuePage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/user-dashboard/bookings" element={<UserBookings />} />
            <Route path="/update-booking/:id" element={<UpdateBooking />} />
            <Route path="/manage-bookings" element={<ManageBookings />} />
            <Route path="/user-profile" element={<UserProfile />} />
        </Routes>
    );
}

export default AppRouter;
