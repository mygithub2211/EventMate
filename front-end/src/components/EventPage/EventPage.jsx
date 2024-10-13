import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './EventPage.css'

function EventPage() {
    const navigate = useNavigate()
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selectedEvent, setSelectedEvent] = useState(null)
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'

    useEffect(() => {
        fetchEvents()
    }, [])

    async function fetchEvents() {
        try {
            const response = await axios.get('https://event-mate-ten.vercel.app/api/events')
            console.log('API Response:', response.data)
            if (Array.isArray(response.data)) {
                setEvents(response.data)
            } else {
                setError('Unexpected data format')
            }
        } catch (error) {
            console.error('Error fetching events:', error)
            setError('Failed to fetch events')
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated')
        navigate('/')
    }

    const showDescription = (event) => {
        setSelectedEvent(event)
    }

    const hideDescription = () => {
        setSelectedEvent(null)
    }

    // Function to update the slots after a successful enrollment
    const updateSlots = async (eventId) => {
        try {
            const updatedEvents = events.map(event => {
                if (event._id === eventId) {
                    return { ...event, slot: event.slot - 1 } // Reduce slot by 1
                }
                return event
            })
            setEvents(updatedEvents)
            await axios.put(`https://event-mate-ten.vercel.app/api/events/${eventId}`, {
                slot: updatedEvents.find(event => event._id === eventId).slot
            })
        } catch (error) {
            console.error('Error updating slots:', error)
        }
    }

    if (loading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>{error}</div>
    }

    return (
        <div className='container'>
            <header>
                <h1 className='page-title'>EventMate</h1>
                {isAuthenticated && (
                    <button className='logout-button' onClick={handleLogout}>Log Out</button>
                )}
            </header>

            <div className='container-for-table'>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Place</th>
                            <th>Slots</th>
                            <th>Join</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map((event) => (
                            <tr key={event._id}>
                                <td>{event.name}</td>
                                <td>{new Date(event.date).toLocaleDateString()}</td>
                                <td>{event.time}</td>
                                <td>{event.place}</td>
                                <td>{event.slot}</td>
                                <td>
                                    <button 
                                        className='join-button'
                                        onClick={() => {
                                            updateSlots(event._id) // Update slots before navigating
                                            navigate(`/enroll/${event._id}`)
                                        }}
                                    >
                                        Join
                                    </button>
                                    <button 
                                        className='info-button'
                                        onClick={() => showDescription(event)}
                                    >
                                        Info
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedEvent && (
                <>
                    <div className='overlay visible' onClick={hideDescription}></div>
                    <div className='description-cell visible'>
                        <h3>{selectedEvent.name}</h3>
                        <p>{selectedEvent.description}</p>
                    </div>
                </>
            )}
        </div>
    )
}

export default EventPage
