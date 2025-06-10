import React from 'react';
import ReactDOM from 'react-dom/client';
import ProfileCard from './ProfileCard.jsx';
import './ProfileCard.css';


const mountPoint = document.getElementById('profile-card-root');

if (mountPoint) {

    ReactDOM.createRoot(mountPoint).render(
        <ProfileCard
            name="Javi A. Torres"
            title="Software Engineer"
            handle="javicodes"
            status="Online"
            contactText="Contact Me"
            avatarUrl="/avatar.png"
            showUserInfo
            enableTilt
            onContactClick={() => console.log('Contact clicked')}
        />
    );
} else {
    console.error('No se encontró #profile-card-root en tu HTML');
}