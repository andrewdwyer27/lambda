"use client";

import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, orderBy } from 'firebase/firestore';

// Firebase configuration
// You'll need to replace these with your actual Firebase project credentials
const firebaseConfig = {
    apiKey: "AIzaSyAImtXy0MKb2-TcFMDzNNpAxo9pciONWOM",
    authDomain: "lambda-ab294.firebaseapp.com",
    projectId: "lambda-ab294",
    storageBucket: "lambda-ab294.firebasestorage.app",
    messagingSenderId: "269073574410",
    appId: "1:269073574410:web:b6e620c662c8d2c8d88df3",
    measurementId: "G-M8JXV4YQRR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function Admin() {
    // Lambda Chi Alpha colors
    const colors = {
        primary: '#4B2E83', // Purple
        secondary: '#85754D', // Gold
    };

    const [donations, setDonations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [authenticated, setAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [sortBy, setSortBy] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');
    const [summaryStats, setSummaryStats] = useState({
        totalDonations: 0,
        totalAmount: 0,
        averageDonation: 0,
        raffleStats: {}
    });
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Raffle items (same as in your main page)
    const raffleItems = [
        { id: 1, name: 'Locally Brewed Beverage Pack (3×6)', price: 5, description: 'A selection of premium local craft beers.' },
        { id: 2, name: 'Vintage WFU Merchandise Box', price: 10, description: 'Includes vintage flag, hat, and shirt.' },
        { id: 3, name: 'Grand Prize Basket', price: 20, description: 'A collection of premium items worth over $100.' },
        { id: 4, name: 'PGA Tour Golf Collection', price: 15, description: 'Pinehurst No. 2 PGA memorabilia and accessories.' },
        { id: 5, name: 'Home Decor Pack', price: 5, description: '2 custom signs perfect for your home or dorm.' },
    ];

    // Admin authentication
    const handleLogin = (e) => {
        e.preventDefault();
        // Simple password check - in a real app you'd use proper authentication
        if (password === 'lambda123') { // Change this to your desired admin password
            setAuthenticated(true);
            fetchDonations();
        } else {
            setError('Incorrect password');
        }
    };

    // Fetch donations from Firestore
    const fetchDonations = async () => {
        setIsLoading(true);
        try {
            const donationsRef = collection(db, 'donations');
            const q = query(donationsRef, orderBy('timestamp', 'desc'));
            const querySnapshot = await getDocs(q);

            const donationData = [];
            querySnapshot.forEach((doc) => {
                donationData.push({ id: doc.id, ...doc.data() });
            });

            setDonations(donationData);
            calculateSummaryStats(donationData);
            setIsLoading(false);
        } catch (err) {
            console.error("Error fetching donations:", err);
            setError("Failed to load donation data. Please try again later.");
            setIsLoading(false);
        }
    };

    // Calculate summary statistics
    const calculateSummaryStats = (donationData) => {
        const totalDonations = donationData.length;
        const totalAmount = donationData.reduce((sum, donation) => sum + donation.amount, 0);
        const averageDonation = totalDonations > 0 ? totalAmount / totalDonations : 0;

        // Calculate raffle stats
        const raffleStats = {};

        // Initialize stats for each raffle item
        raffleItems.forEach(item => {
            raffleStats[item.id] = {
                name: item.name,
                totalTickets: 0,
                donors: 0
            };
        });

        // Populate stats
        donationData.forEach(donation => {
            if (donation.selectedRaffles && donation.ticketsPerRaffle) {
                donation.selectedRaffles.forEach(raffleId => {
                    if (raffleStats[raffleId]) {
                        raffleStats[raffleId].totalTickets += donation.ticketsPerRaffle;
                        raffleStats[raffleId].donors += 1;
                    }
                });
            }
        });

        setSummaryStats({
            totalDonations,
            totalAmount,
            averageDonation,
            raffleStats
        });
    };

    // Sort donations
    const handleSort = (field) => {
        if (sortBy === field) {
            // Toggle sort order if the same field is clicked
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            // Set new sort field and default to ascending order
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    // Apply sorting to donations
    const sortedDonations = [...donations].sort((a, b) => {
        let comparison = 0;

        switch (sortBy) {
            case 'name':
                comparison = a.name.localeCompare(b.name);
                break;
            case 'email':
                comparison = a.email.localeCompare(b.email);
                break;
            case 'amount':
                comparison = a.amount - b.amount;
                break;
            case 'date':
            default:
                // Convert timestamp to Date if it's a Firestore timestamp
                const dateA = a.timestamp?.toDate?.() || new Date(a.timestamp);
                const dateB = b.timestamp?.toDate?.() || new Date(b.timestamp);
                comparison = dateA - dateB;
                break;
        }

        return sortOrder === 'asc' ? comparison : -comparison;
    });

    // Format date for display
    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';

        // Convert Firestore timestamp to JS Date if necessary
        const date = timestamp?.toDate?.() || new Date(timestamp);

        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    // Get raffle name by ID
    const getRaffleName = (raffleId) => {
        const raffle = raffleItems.find(item => item.id === raffleId);
        return raffle ? raffle.name : `Raffle ${raffleId}`;
    };

    return (
        <main className="min-h-screen bg-gray-100">
            {/* Header/Navigation */}
            <header className="sticky top-0 z-50 bg-gradient-to-r from-[#3a2068] via-[#4B2E83] to-[#3a2068] shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <div className="relative">
                                <div className="absolute -inset-1 bg-yellow-400 rounded-full blur opacity-30"></div>
                                <span className="relative text-white font-bold text-xl md:text-2xl tracking-wider">
                                    ΛΧΑ Fundraiser Admin
                                </span>
                            </div>
                        </div>
                        {authenticated && (
                            <div className="hidden md:flex space-x-8 text-white">
                                <a href="#dashboard" className="hover:text-yellow-200 transition-colors duration-300 relative group">
                                    Dashboard
                                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-yellow-200 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                                </a>
                                <a href="#donations" className="hover:text-yellow-200 transition-colors duration-300 relative group">
                                    Donations
                                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-yellow-200 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                                </a>
                                <a href="#raffle-stats" className="hover:text-yellow-200 transition-colors duration-300 relative group">
                                    Raffle Stats
                                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-yellow-200 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                                </a>
                                <a href="/" className="hover:text-yellow-200 transition-colors duration-300 relative group">
                                    Main Page
                                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-yellow-200 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                                </a>
                            </div>
                        )}
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
                    {mobileMenuOpen && authenticated && (
                        <div className="md:hidden mt-2 py-2 bg-white rounded-md shadow-lg">
                            <a href="#dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>Dashboard</a>
                            <a href="#donations" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>Donations</a>
                            <a href="#raffle-stats" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>Raffle Stats</a>
                            <a href="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>Main Page</a>
                        </div>
                    )}
                </div>
            </header>

            {!authenticated ? (
                // Login Form
                <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 via-purple-50 to-gray-100">
                    <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-[#4B2E83]">Admin Login</h2>
                            <p className="text-gray-600 mt-2">Enter your password to access the admin dashboard</p>
                        </div>

                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-red-700">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleLogin}>
                            <div className="mb-6">
                                <label htmlFor="password" className="block text-gray-800 text-sm font-medium mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4B2E83] focus:border-[#4B2E83]"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-[#4B2E83] to-[#5d3da0] text-white py-2 px-4 rounded-md hover:from-[#5d3da0] hover:to-[#6e4eaf] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4B2E83] transition-all duration-300 transform hover:scale-105"
                            >
                                Login
                            </button>
                        </form>
                    </div>
                </div>
            ) : (
                // Admin Dashboard Content
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Summary Cards */}
                    <section id="dashboard" className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Total Donations Card */}
                            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#4B2E83]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div className="ml-5">
                                            <h3 className="text-lg font-medium text-gray-900">Total Donations</h3>
                                            <p className="text-3xl font-bold text-[#4B2E83]">{summaryStats.totalDonations}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-5 py-3">
                                    <div className="text-sm text-gray-700">
                                        <span className="font-medium">Last updated:</span> {isLoading ? 'Loading...' : new Date().toLocaleTimeString()}
                                    </div>
                                </div>
                            </div>

                            {/* Total Amount Card */}
                            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 bg-amber-100 rounded-md p-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#85754D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div className="ml-5">
                                            <h3 className="text-lg font-medium text-gray-900">Total Amount</h3>
                                            <p className="text-3xl font-bold text-[#85754D]">${summaryStats.totalAmount.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-5 py-3">
                                    <div className="text-sm text-gray-700">
                                        Average donation: <span className="font-medium">${summaryStats.averageDonation.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Most Popular Raffle Card */}
                            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                                            </svg>
                                        </div>
                                        <div className="ml-5">
                                            <h3 className="text-lg font-medium text-gray-900">Most Popular Raffle</h3>
                                            {Object.keys(summaryStats.raffleStats).length > 0 ? (
                                                <p className="text-xl font-bold text-blue-600">
                                                    {Object.values(summaryStats.raffleStats)
                                                        .sort((a, b) => b.totalTickets - a.totalTickets)[0]?.name || 'N/A'}
                                                </p>
                                            ) : (
                                                <p className="text-gray-500">No raffle data yet</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-5 py-3">
                                    <div className="text-sm text-gray-700">
                                        {Object.keys(summaryStats.raffleStats).length > 0 ? (
                                            <span>
                                                <span className="font-medium">
                                                    {Object.values(summaryStats.raffleStats)
                                                        .sort((a, b) => b.totalTickets - a.totalTickets)[0]?.totalTickets || 0}
                                                </span> tickets
                                            </span>
                                        ) : 'No raffle entries yet'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Raffle Statistics */}
                    <section id="raffle-stats" className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Raffle Statistics</h2>

                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Raffle Item
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Total Tickets
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Number of Donors
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Avg. Tickets Per Donor
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {raffleItems.map(item => {
                                            const stats = summaryStats.raffleStats[item.id] || { totalTickets: 0, donors: 0 };
                                            const avgTickets = stats.donors > 0 ? stats.totalTickets / stats.donors : 0;

                                            return (
                                                <tr key={item.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                                        <div className="text-sm text-gray-500">${item.price} per ticket</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">{stats.totalTickets}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">{stats.donors}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">{avgTickets.toFixed(1)}</div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>

                    {/* Donations List */}
                    <section id="donations" className="mb-12">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">All Donations</h2>
                            <button
                                onClick={fetchDonations}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#4B2E83] hover:bg-[#5d3da0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4B2E83]"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Refresh
                            </button>
                        </div>

                        {isLoading ? (
                            <div className="flex justify-center items-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4B2E83]"></div>
                            </div>
                        ) : error ? (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-red-700">{error}</p>
                                    </div>
                                </div>
                            </div>
                        ) : donations.length === 0 ? (
                            <div className="bg-white rounded-lg shadow-md p-6 text-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                                <p className="mt-4 text-gray-700">No donations yet. They will appear here once available.</p>
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                                    onClick={() => handleSort('name')}
                                                >
                                                    <div className="flex items-center">
                                                        Name
                                                        {sortBy === 'name' && (
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                {sortOrder === 'asc'
                                                                    ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                                                    : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                                }
                                                            </svg>
                                                        )}
                                                    </div>
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                                    onClick={() => handleSort('email')}
                                                >
                                                    <div className="flex items-center">
                                                        Email
                                                        {sortBy === 'email' && (
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                {sortOrder === 'asc'
                                                                    ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                                                    : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                                }
                                                            </svg>
                                                        )}
                                                    </div>
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                                    onClick={() => handleSort('amount')}
                                                >
                                                    <div className="flex items-center">
                                                        Amount
                                                        {sortBy === 'amount' && (
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                {sortOrder === 'asc'
                                                                    ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                                                    : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                                }
                                                            </svg>
                                                        )}
                                                    </div>
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                                    onClick={() => handleSort('date')}
                                                >
                                                    <div className="flex items-center">
                                                        Date
                                                        {sortBy === 'date' && (
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                {sortOrder === 'asc'
                                                                    ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                                                    : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                                }
                                                            </svg>
                                                        )}
                                                    </div>
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Tickets
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Raffle Selections
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {sortedDonations.map((donation) => (
                                                <tr key={donation.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">{donation.name}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-500">{donation.email}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">${donation.amount}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-500">{formatDate(donation.timestamp)}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {donation.amount}
                                                        {donation.selectedRaffles && donation.selectedRaffles.length > 0 &&
                                                            <span> ({donation.ticketsPerRaffle} per raffle)</span>
                                                        }
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm text-gray-900">
                                                            {donation.selectedRaffles && donation.selectedRaffles.length > 0 ? (
                                                                <ul className="list-disc pl-5">
                                                                    {donation.selectedRaffles.map(raffleId => (
                                                                        <li key={raffleId} className="text-sm text-gray-700">
                                                                            {getRaffleName(raffleId)}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            ) : (
                                                                <span className="text-gray-500">None selected</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </section>

                    {/* Export Options */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Export Data</h2>

                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">Download Donation Data</h3>
                                    <p className="mt-1 text-sm text-gray-500">Export all donation records for your records.</p>
                                </div>
                                <div className="mt-4 sm:mt-0">
                                    <button
                                        onClick={() => {
                                            // Create CSV content
                                            const headers = ['Name', 'Email', 'Amount', 'Date', 'Tickets', 'Selected Raffles'];

                                            const csvContent = donations.map(donation => {
                                                return [
                                                    donation.name,
                                                    donation.email,
                                                    donation.amount,
                                                    formatDate(donation.timestamp),
                                                    donation.amount,
                                                    donation.selectedRaffles ? donation.selectedRaffles.map(id => getRaffleName(id)).join(', ') : ''
                                                ].join(',');
                                            }).join('\n');

                                            const fullCSV = [headers.join(','), csvContent].join('\n');

                                            // Create a blob and download link
                                            const blob = new Blob([fullCSV], { type: 'text/csv' });
                                            const url = URL.createObjectURL(blob);
                                            const a = document.createElement('a');
                                            a.setAttribute('href', url);
                                            a.setAttribute('download', `lambda-chi-donations-${new Date().toISOString().split('T')[0]}.csv`);
                                            a.click();
                                        }}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#85754D] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#85754D]"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Export CSV
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            )}

            {/* Footer */}
            <footer className="py-8 bg-[#4B2E83]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="md:flex md:items-center md:justify-between">
                        <div className="flex justify-center md:justify-start">
                            <p className="text-white font-bold text-lg">Lambda Chi Alpha Admin Dashboard</p>
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