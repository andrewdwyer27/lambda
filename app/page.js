"use client";

import { useState } from 'react';
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

    // Raffle items
    const raffleItems = [
        { id: 1, name: 'Locally Brewed Beverage Pack (3x6)', price: 5, description: 'A selection of premium local craft beers.' },
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
    const handleSubmit = (e) => {
        e.preventDefault();
        if (donationAmount > 0 && selectedRaffles.length > 0 && name && email) {
            setSubmitted(true);
            // In a real app, you would send this data to your server
            console.log('Submission data:', { name, email, donationAmount, selectedRaffles });
        }
    };

    // Calculate tickets based on donation amount (1 ticket per dollar)
    const ticketCount = donationAmount;

    // Distribute tickets evenly among selected raffles
    const ticketsPerRaffle = selectedRaffles.length > 0
        ? Math.floor(ticketCount / selectedRaffles.length)
        : 0;

    return (
        <main className="min-h-screen">
            {/* Header/Navigation */}
            <header className="sticky top-0 z-50 bg-[#4B2E83]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <span className="text-white font-bold text-xl md:text-2xl">ΛΧΑ × LBF Parents Weekend!</span>
                        </div>
                        <div className="hidden md:flex space-x-8 text-white">
                            <a href="#raffle" className="hover:text-gray-200">Raffle Items</a>
                            <a href="#donate" className="hover:text-gray-200">Donate</a>
                            <a href="#about" className="hover:text-gray-200">About</a>
                        </div>
                        <div className="md:hidden">
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="text-white hover:text-gray-200"
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
                            <a href="#raffle" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>Raffle Items</a>
                            <a href="#donate" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>Donate</a>
                            <a href="#about" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>About</a>
                        </div>
                    )}
                </div>
            </header>

            {/* Hero Section */}
            <section className="py-12 bg-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                            <span className="text-[#4B2E83]">Lambda Chi Alpha</span>{' '}
                            <span className="text-[#85754D]">Fundraiser</span>
                        </h1>
                        <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-700">
                            Support our chapter and enter for a chance to win amazing prizes!
                        </p>
                        <div className="mt-8 flex justify-center">
                            <a
                                href="#donate"
                                className="px-8 py-3 text-base font-medium rounded-md text-white bg-[#4B2E83] hover:bg-opacity-90 md:text-lg"
                            >
                                Donate Now
                            </a>
                            <a
                                href="#raffle"
                                className="ml-4 px-8 py-3 text-base font-medium rounded-md text-white bg-[#85754D] hover:bg-opacity-90 md:text-lg"
                            >
                                View Prizes
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Raffle Items Section */}
            <section id="raffle" className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            Raffle Items
                        </h2>
                        <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-700">
                            With each donation, you are eligible for tickets in our raffle of various prizes!
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {raffleItems.map((item) => (
                            <div
                                key={item.id}
                                className={`border rounded-lg overflow-hidden shadow-md transition-all duration-200 ${selectedRaffles.includes(item.id) ? 'ring-2 ring-offset-2 ring-[#4B2E83]' : ''
                                    }`}
                                style={{
                                    borderColor: selectedRaffles.includes(item.id) ? '#4B2E83' : 'transparent'
                                }}
                            >
                                <div className="relative h-48 bg-gray-200">
                                    {/* Placeholder for image */}
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-16 h-16">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
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
                                            className={`mt-4 w-full px-4 py-2 border text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${selectedRaffles.includes(item.id)
                                                ? 'bg-gray-100 text-gray-800 border-[#4B2E83]'
                                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                                }`}
                                        >
                                            {selectedRaffles.includes(item.id) ? 'Selected' : 'Select'}
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
                                    disabled={donationAmount <= 0 || selectedRaffles.length === 0 || !name || !email}
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#4B2E83] hover:bg-[#5d3da0] focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Complete Donation
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
                            The LXA × LBF Parents Weekend fundraiser is an annual event that helps support our chapter's operations,
                            community service initiatives, and brotherhood events. All proceeds go directly to the Lambda Chi Alpha
                            chapter to continue our tradition of excellence and service.
                        </p>

                        <p className="text-gray-800">
                            This year, we have partnered with local businesses to bring you an exciting collection of raffle prizes.
                            For every dollar you donate, you'll receive one raffle ticket that you can allocate to any prize of your choice.
                        </p>

                        <h3 className="text-[#4B2E83] font-semibold mt-6 mb-3">How It Works</h3>
                        <ol className="list-decimal pl-6 my-3 text-gray-800">
                            <li>Choose your donation amount</li>
                            <li>Select which prize(s) you'd like to enter to win</li>
                            <li>Your tickets will be distributed evenly among your selected prizes</li>
                            <li>Winners will be announced at the end of Parents Weekend</li>
                        </ol>

                        <p className="text-gray-800">
                            Thank you for your support! If you have any questions, please contact our fundraising chair at
                            <a href="mailto:fundraising@lambdachi.org" className="text-blue-600 hover:text-blue-800"> fundraising@lambdachi.org</a>.
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