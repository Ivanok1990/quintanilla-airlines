import React from 'react';
import '../components/css/DestinationDetails.css';

const destinationData = [
    {
        id: 'corn-island',
        name: 'Corn Island',
        description: 'Escape to the pristine beauty of Corn Island, a hidden gem off the Caribbean coast of Nicaragua. With its two main islands, Big Corn and Little Corn, this tropical paradise offers a perfect blend of relaxation and adventure.',
        image: 'http://localhost:8080/imagenes/cornIsland.jpg'
    },
    {
        id: 'bluefields',
        name: 'Bluefields',
        description: 'Discover the vibrant coastal charm of Bluefields, Nicaragua, where a rich tapestry of cultural heritage awaits. Immerse yourself in the rhythms of Afro-Caribbean music, savor the flavors of local cuisine, and experience the warmth of Nicaraguan hospitality.',
        image: 'http://localhost:8080/imagenes/Blufield.jpg'
    },
    {
        id: 'managua',
        name: 'Managua',
        description: 'Managua, the capital of Nicaragua, blends history, culture, and nature. Explore landmarks like the Old Cathedral and enjoy the vibrant local cuisine, nightlife, and lakeside views.',
        image: 'http://localhost:8080/imagenes/Managua.jpg'
    }
];

const DestinationDetails = () => {
    return (
        <div className="destination-details">
            <h2>Explore Our Destinations</h2>
            <div className="destination-cards">
                {destinationData.map((destination, index) => (
                    <div className="destination-card" key={index}>
                        <img src={destination.image} alt={destination.name} />
                        <div className="card-content">
                            <h3>{destination.name}</h3>
                            <p>{destination.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DestinationDetails;
