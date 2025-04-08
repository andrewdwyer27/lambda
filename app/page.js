"use client"

import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from "../lib/firebase";
import Link from 'next/link';

export default function Home() {
    // Lambda Chi Alpha colors
    const colors = {
        primary: '#4B2E83', // Purple
        secondary: '#85754D', // Gold
    };

    // State for donation and raffle selection
    const [donationAmount, setDonationAmount] = useState(0);
    const [selectedRaffles, setSelectedRaffles] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionError, setSubmissionError] = useState(null);
    const [donationId, setDonationId] = useState(null);

    // Raffle items
    const raffleItems = [
        { id: 1, name: 'Locally Brewed Beverage Pack (3×6)', price: 5, description: 'A selection of premium local craft beers.' },
        { id: 2, name: 'Vintage WFU Merchandise Box', price: 10, description: 'Includes vintage flag, hat, and shirt.' },
        { id: 3, name: 'Grand Prize Basket', price: 20, description: 'A collection of premium items worth over $100.' },
        { id: 4, name: 'PGA Tour Golf Collection', price: 15, description: 'Pinehurst No. 2 PGA memorabilia and accessories.' },
        { id: 5, name: 'Home Decor Pack', price: 5, description: '2 custom signs perfect for your home or dorm.' },
    ];

    // Available donation options
    const donationOptions = [10, 20, 30, 40, 50, 100];

    // Toggle raffle selection
    const toggleRaffleSelection = (id) => {
        if (selectedRaffles.includes(id)) {
            setSelectedRaffles(selectedRaffles.filter(itemId => itemId !== id));
        } else {
            setSelectedRaffles([...selectedRaffles, id]);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (donationAmount > 0 && selectedRaffles.length > 0 && name && email) {
            setIsSubmitting(true);
            setSubmissionError(null);

            try {
                const ticketsPerRaffle = Math.floor(donationAmount / selectedRaffles.length);

                const donationData = {
                    name,
                    email,
                    amount: donationAmount,
                    selectedRaffles,
                    ticketsPerRaffle,
                    totalTickets: donationAmount,
                    timestamp: new Date(),
                };

                const docRef = await addDoc(collection(db, 'donations'), donationData);
                setDonationId(docRef.id);
                setSubmitted(true);
            } catch (error) {
                console.error('Submission error:', error);
                setSubmissionError('An unexpected error occurred. Please try again.');
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    // Calculate tickets based on donation amount (1 ticket per dollar)
    const ticketCount = donationAmount;

    // Distribute tickets evenly among selected raffles
    const ticketsPerRaffle = selectedRaffles.length > 0
        ? Math.floor(ticketCount / selectedRaffles.length)
        : 0;

    // Custom icons for raffle items
    const getRaffleIcon = (id) => {
        switch (id) {
            case 1: // Craft Brews
                return (
                    <div className="w-full h-full flex items-center justify-center relative">
                        <div className="absolute inset-0 bg-blue-400 rounded-full filter blur-xl opacity-30 animate-pulse"></div>
                        <div className="relative z-10 text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#4B2E83" className="w-24 h-24 mx-auto">
                                <path d="M9.5 3C7.56 3 6 4.56 6 6.5V7h12v-.5C18 4.56 16.44 3 14.5 3h-5zm-1.5 5C5.9 8 4 9.9 4 12v7c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-7c0-2.1-1.9-4-4-4H8zm3.5 2.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5S10 12.83 10 12s.67-1.5 1.5-1.5zm3 0c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5zM8 17l.7-2.1c.77-.58 1.73-.9 2.8-.9s2.03.32 2.8.9L15 17H8z" />
                            </svg>
                            <span className="text-white font-bold text-lg mt-2 block drop-shadow-lg">Craft Brews</span>
                        </div>
                    </div>
                );
            case 2: // WFU Merch
                return (
                    <div className="w-full h-full flex items-center justify-center relative">
                        <div className="absolute inset-0 bg-[#85754D] rounded-full filter blur-xl opacity-30 animate-pulse"></div>
                        <div className="relative z-10 text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#85754D" className="w-24 h-24 mx-auto">
                                <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
                            </svg>
                            <span className="text-white font-bold text-lg mt-2 block drop-shadow-lg">WFU Merch</span>
                        </div>
                    </div>
                );
            case 3: // Grand Prize
                return (
                    <div className="w-full h-full flex items-center justify-center relative">
                        <div className="absolute inset-0 bg-yellow-400 rounded-full filter blur-xl opacity-40 animate-pulse"></div>
                        <div className="relative z-10 text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="gold" className="w-24 h-24 mx-auto">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1h-6v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                            </svg>
                            <span className="text-white font-bold text-lg mt-2 block drop-shadow-lg">Grand Prize</span>
                        </div>
                    </div>
                );
            case 4: // PGA Golf
                return (
                    <div className="w-full h-full flex items-center justify-center relative">
                        <div className="absolute inset-0 bg-green-400 rounded-full filter blur-xl opacity-30 animate-pulse"></div>
                        <div className="relative z-10 text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="green" className="w-24 h-24 mx-auto">
                                <path d="M19.5 9c0 1.51-.91 2.82-2.22 3.4.44.73.69 1.57.69 2.47 0 2.64-2.15 4.79-4.79 4.79-1.51 0-2.86-.7-3.74-1.8-.88 1.1-2.22 1.8-3.74 1.8-2.64 0-4.79-2.15-4.79-4.79 0-.9.25-1.75.69-2.47C.91 11.82 0 10.51 0 9c0-2.36 1.92-4.28 4.28-4.28 1.44 0 2.72.71 3.5 1.8.78-1.09 2.06-1.8 3.5-1.8 1.44 0 2.72.71 3.5 1.8.78-1.09 2.06-1.8 3.5-1.8C17.58 4.72 19.5 6.64 19.5 9z" />
                            </svg>
                            <span className="text-white font-bold text-lg mt-2 block drop-shadow-lg">PGA Golf</span>
                        </div>
                    </div>
                );
            case 5: // Home Decor
                return (
                    <div className="w-full h-full flex items-center justify-center relative">
                        <div className="absolute inset-0 bg-purple-400 rounded-full filter blur-xl opacity-30 animate-pulse"></div>
                        <div className="relative z-10 text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#4B2E83" className="w-24 h-24 mx-auto">
                                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                            </svg>
                            <span className="text-white font-bold text-lg mt-2 block drop-shadow-lg">Home Decor</span>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <main className="min-h-screen">
            {/* Header/Navigation */}
            <header className="sticky top-0 z-50 bg-gradient-to-r from-[#3a2068] via-[#4B2E83] to-[#3a2068] shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <div className="relative">
                                <div className="absolute -inset-1 bg-yellow-400 rounded-full blur opacity-30"></div>
                                <span className="relative text-white font-bold text-xl md:text-2xl tracking-wider">
                                    ΛΧΑ × LBF Parents Weekend!
                                </span>
                            </div>
                        </div>
                        <div className="hidden md:flex space-x-8 text-white">
                            <Link href="#raffle" className="hover:text-yellow-200 transition-colors duration-300 relative group">
                                Raffle Items
                                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-yellow-200 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                            </Link>
                            <Link href="#donate" className="hover:text-yellow-200 transition-colors duration-300 relative group">
                                Donate
                                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-yellow-200 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                            </Link>
                            <Link href="#about" className="hover:text-yellow-200 transition-colors duration-300 relative group">
                                About
                                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-yellow-200 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                            </Link>
                            <Link href="/admin" className="hover:text-yellow-200 transition-colors duration-300 relative group">
                                Admin
                                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-yellow-200 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                            </Link>
                        </div>
                        <div className="md:hidden">
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="text-white hover:text-yellow-200 transition-colors duration-300"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                                    {mobileMenuOpen ?
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> :
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    }
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Mobile menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden mt-2 py-2 bg-white rounded-md shadow-lg">
                            <Link href="#raffle" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>Raffle Items</Link>
                            <Link href="#donate" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>Donate</Link>
                            <Link href="#about" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>About</Link>
                            <Link href="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>Admin</Link>
                        </div>
                    )}
                </div>
            </header>

            {/* Hero Section */}
            <section className="py-12 bg-gradient-to-br from-gray-100 via-purple-50 to-gray-100 relative overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                    <div className="absolute top-10 left-10 w-32 h-32 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
                    <div className="absolute top-0 right-10 w-32 h-32 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-10 left-1/3 w-32 h-32 bg-[#85754D] rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center">
                        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl relative">
                            <span className="text-[#4B2E83] inline-block transform hover:scale-105 transition-transform duration-300 glow-purple">Lambda Chi Alpha</span>{' '}
                            <span className="text-[#85754D] inline-block transform hover:scale-105 transition-transform duration-300 glow-gold">Fundraiser</span>
                            <style jsx>{`
                                .glow-purple {
                                    text-shadow: 0 0 10px rgba(75, 46, 131, 0.3);
                                }
                                .glow-gold {
                                    text-shadow: 0 0 10px rgba(133, 117, 77, 0.3);
                                }
                                @keyframes blob {
                                    0% { transform: translate(0px, 0px) scale(1); }
                                    33% { transform: translate(30px, -50px) scale(1.1); }
                                    66% { transform: translate(-20px, 20px) scale(0.9); }
                                    100% { transform: translate(0px, 0px) scale(1); }
                                }
                                .animate-blob {
                                    animation: blob 7s infinite;
                                }
                                .animation-delay-2000 {
                                    animation-delay: 2s;
                                }
                                .animation-delay-4000 {
                                    animation-delay: 4s;
                                }
                            `}</style>
                        </h1>
                        <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-700">
                            Support our chapter and enter for a chance to win amazing prizes!
                        </p>
                        <div className="mt-8 flex justify-center">
                            <Link
                                href="#donate"
                                className="px-8 py-3 text-base font-medium rounded-md text-white bg-[#4B2E83] hover:bg-opacity-90 md:text-lg shadow-lg hover:shadow-purple-300/50 transition-all duration-300 transform hover:scale-105 hover:bg-[#5d3da0]"
                            >
                                Donate Now
                            </Link>
                            <Link
                                href="#raffle"
                                className="ml-4 px-8 py-3 text-base font-medium rounded-md text-white bg-[#85754D] hover:bg-opacity-90 md:text-lg shadow-lg hover:shadow-amber-300/50 transition-all duration-300 transform hover:scale-105 hover:bg-[#9a8a5a]"
                            >
                                View Prizes
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Raffle Items Section */}
            <section id="raffle" className="py-16 bg-white relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-gray-100 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-gray-100 to-transparent"></div>
                <div className="absolute -left-16 top-1/4 w-32 h-32 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute -right-16 top-3/4 w-32 h-32 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-700"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl relative inline-block">
                            Raffle Items
                            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#4B2E83] to-transparent"></div>
                        </h2>
                        <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-700">
                            With each donation, you are eligible for tickets in our raffle of various prizes!
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {raffleItems.map((item) => (
                            <div
                                key={item.id}
                                className={`border rounded-lg overflow-hidden shadow-xl transition-all duration-200 hover:shadow-2xl ${selectedRaffles.includes(item.id)
                                    ? 'ring-4 ring-offset-2 ring-[#4B2E83] transform scale-105'
                                    : 'hover:scale-102 hover:border-purple-300'
                                    }`}
                                style={{
                                    borderColor: selectedRaffles.includes(item.id) ? '#4B2E83' : 'transparent'
                                }}
                            >
                                <div className="relative h-48 bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
                                    {getRaffleIcon(item.id)}
                                </div>
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                                    <p className="mt-2 text-gray-700">{item.description}</p>
                                    <p className="mt-2 text-gray-700">Ticket Price: ${item.price}</p>

                                    {submitted ? (
                                        <div className="mt-4">
                                            <p className="text-sm text-gray-700">
                                                Your tickets for this prize: <span className="font-bold">{selectedRaffles.includes(item.id) ? ticketsPerRaffle : 0}</span>
                                            </p>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => toggleRaffleSelection(item.id)}
                                            className={`cursor-pointer mt-4 w-full px-4 py-2 border text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 ${selectedRaffles.includes(item.id)
                                                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-transparent shadow-lg'
                                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:shadow-md'
                                                }`}
                                        >
                                            {selectedRaffles.includes(item.id) ? (
                                                <span className="flex items-center justify-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    Selected
                                                </span>
                                            ) : 'Select'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Donation Form Section */}
            <section id="donate" className="py-16 bg-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            Make a Donation
                        </h2>
                        <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-700">
                            Your support helps our chapter continue making an impact.
                        </p>
                    </div>

                    {submitted ? (
                        <div className="max-w-md mx-auto bg-white p-8 border border-gray-200 rounded-lg shadow-md">
                            <div className="text-center">
                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-green-600">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="mt-4 text-lg font-medium text-gray-900">Thank you for your donation!</h3>
                                <p className="mt-2 text-sm text-gray-700">
                                    You have donated ${donationAmount} and received {ticketCount} raffle tickets,
                                    distributed among your selected prizes.
                                </p>
                                <div className="mt-6">
                                    <button
                                        onClick={() => {
                                            setSubmitted(false);
                                            setDonationAmount(0);
                                            setSelectedRaffles([]);
                                            setName('');
                                            setEmail('');
                                        }}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#4B2E83] focus:outline-none focus:ring-2 focus:ring-offset-2"
                                    >
                                        Make Another Donation
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <form
                            onSubmit={handleSubmit}
                            className="max-w-md mx-auto bg-white p-8 border border-gray-200 rounded-lg shadow-md"
                        >
                            {submissionError && (
                                <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-red-700">{submissionError}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="mb-6">
                                <label htmlFor="name" className="block text-gray-800 text-sm font-medium mb-2">
                                    Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                                    placeholder="Your name"
                                />
                            </div>

                            <div className="mb-6">
                                <label htmlFor="email" className="block text-gray-800 text-sm font-medium mb-2">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                                    placeholder="your.email@example.com"
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-gray-800 text-sm font-medium mb-2">
                                    How much would you like to donate? <span className="text-red-500">*</span>
                                </label>

                                <div className="grid grid-cols-3 gap-3">
                                    {donationOptions.map((amount) => (
                                        <div key={amount}>
                                            <input
                                                type="radio"
                                                id={`amount-${amount}`}
                                                name="amount"
                                                value={amount}
                                                checked={donationAmount === amount}
                                                onChange={() => setDonationAmount(amount)}
                                                className="sr-only"
                                            />
                                            <label
                                                htmlFor={`amount-${amount}`}
                                                className={`block w-full py-3 text-center border rounded-md cursor-pointer focus:outline-none ${donationAmount === amount
                                                    ? 'border-2 text-white bg-[#4B2E83]'
                                                    : 'border-gray-400 text-gray-700 hover:border-gray-500'
                                                    }`}
                                            >
                                                ${amount}
                                            </label>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-4">
                                    <label className="block text-gray-800 text-sm font-medium mb-2">
                                        Or enter custom amount:
                                    </label>
                                    <div className="relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-gray-700 sm:text-sm">$</span>
                                        </div>
                                        <input
                                            type="number"
                                            min="1"
                                            value={donationOptions.includes(donationAmount) ? '' : donationAmount}
                                            onChange={(e) => setDonationAmount(parseInt(e.target.value) || 0)}
                                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-400 rounded-md text-gray-900"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6">
                                <p className="block text-gray-800 text-sm font-medium mb-2">
                                    You will receive <span className="font-bold">{ticketCount}</span> raffle tickets.
                                </p>

                                {ticketCount > 0 && selectedRaffles.length > 0 && (
                                    <p className="mt-2 text-sm text-gray-700">
                                        Each selected raffle will receive <span className="font-bold">{ticketsPerRaffle}</span> tickets.
                                    </p>
                                )}

                                {ticketCount > 0 && selectedRaffles.length === 0 && (
                                    <p className="mt-2 text-sm text-red-600">
                                        Please select at least one raffle item.
                                    </p>
                                )}
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={donationAmount <= 0 || selectedRaffles.length === 0 || !name || !email || isSubmitting}
                                    className="cursor-pointer w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-lg text-sm font-medium text-white bg-gradient-to-r from-[#4B2E83] to-[#5d3da0] hover:from-[#5d3da0] hover:to-[#6e4eaf] focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-purple-300/40"
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </span>
                                    ) : (
                                        "Complete Donation"
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            About Our Fundraiser
                        </h2>
                    </div>

                    <div className="prose prose-lg mx-auto">
                        <p className="text-gray-800">
                            The LXA × LBF Parents Weekend fundraiser is an annual event that helps support our chapters operations,
                            community service initiatives, and brotherhood events. All proceeds go directly to the Lambda Chi Alpha
                            chapter to continue our tradition of excellence and service.
                        </p>

                        <p className="text-gray-800">
                            This year, we have partnered with local businesses to bring you an exciting collection of raffle prizes.
                            For every dollar you donate, you will receive one raffle ticket that you can allocate to any prize of your choice.
                        </p>

                        <h3 className="text-[#4B2E83] font-semibold mt-6 mb-3">How It Works</h3>
                        <ol className="list-decimal pl-6 my-3 text-gray-800">
                            <li>Choose your donation amount</li>
                            <li>Select which prize(s) you would like to enter to win</li>
                            <li>Your tickets will be distributed evenly among your selected prizes</li>
                            <li>Winners will be announced at the end of Parents Weekend</li>
                        </ol>

                        <p className="text-gray-800">
                            Thank you for your support! If you have any questions, please contact our fundraising chair!
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 bg-[#4B2E83]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="md:flex md:items-center md:justify-between">
                        <div className="flex justify-center md:justify-start">
                            <p className="text-white font-bold text-lg">Lambda Chi Alpha</p>
                        </div>
                        <div className="mt-8 md:mt-0">
                            <p className="text-center text-white text-sm">
                                &copy; {new Date().getFullYear()} Lambda Chi Alpha. All rights reserved.
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </main>
    );
}