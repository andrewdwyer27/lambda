"use client"

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export default function AdminPage() {
    const [donations, setDonations] = useState([]);
    const [winners, setWinners] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isDrawing, setIsDrawing] = useState(false);
    const [error, setError] = useState(null);

    const raffleItems = [
        { id: 1, name: 'Locally Brewed Beverage Pack (3×6)' },
        { id: 2, name: 'Vintage WFU Merchandise Box' },
        { id: 3, name: 'Grand Prize Basket' },
        { id: 4, name: 'PGA Tour Golf Collection' },
        { id: 5, name: 'Home Decor Pack' },
    ];

    useEffect(() => {
        const fetchDonations = async () => {
            try {
                const snapshot = await getDocs(collection(db, 'donations'));
                const data = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setDonations(data);
            } catch (err) {
                console.error('Error fetching donations:', err);
                setError('Failed to load donations.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchDonations();
    }, []);

    const drawWinners = () => {
        setIsDrawing(true);
        setError(null);

        try {
            const prizeEntries = {};

            donations.forEach(({ email, selectedRaffles, ticketsPerRaffle }) => {
                selectedRaffles.forEach(id => {
                    if (!prizeEntries[id]) prizeEntries[id] = [];
                    for (let i = 0; i < ticketsPerRaffle; i++) {
                        prizeEntries[id].push(email);
                    }
                });
            });

            const newWinners = {};
            for (const id in prizeEntries) {
                const entries = prizeEntries[id];
                if (entries.length > 0) {
                    const winner = entries[Math.floor(Math.random() * entries.length)];
                    newWinners[id] = winner;
                } else {
                    newWinners[id] = "No entries";
                }
            }

            setWinners(newWinners);
        } catch (err) {
            console.error('Draw error:', err);
            setError('Failed to draw winners.');
        } finally {
            setIsDrawing(false);
        }
    };

    return (
        <>
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
                            <a href="/" className="hover:text-yellow-200 transition-colors duration-300 relative group">
                                Home
                                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-yellow-200 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                            </a>
                            <a href="/#raffle" className="hover:text-yellow-200 transition-colors duration-300 relative group">
                                Raffle Items
                                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-yellow-200 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                            </a>
                            <a href="/#donate" className="hover:text-yellow-200 transition-colors duration-300 relative group">
                                Donate
                                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-yellow-200 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                            </a>
                            <a href="/admin" className="hover:text-yellow-200 transition-colors duration-300 relative group">
                                Admin
                                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-yellow-200 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                            </a>
                        </div>
                    </div>
                </div>
                <main className="min-h-screen bg-gradient-to-br from-[#f7f5ff] via-[#fefcf8] to-[#f7f5ff] p-8">
                    <div className="max-w-6xl mx-auto space-y-12">
                        <h1 className="text-4xl font-extrabold text-center text-[#4B2E83] drop-shadow-md tracking-tight">
                            🎉 Admin Raffle Dashboard
                        </h1>

                        {/* Donations Section */}
                        <section className="bg-white rounded-2xl shadow-lg p-8 border border-[#e7e5f5]">
                            <h2 className="text-2xl font-semibold text-[#4B2E83] mb-6">📋 Current Donations</h2>

                            {isLoading ? (
                                <p className="text-gray-600">Loading donations...</p>
                            ) : donations.length === 0 ? (
                                <p className="text-gray-600">No donations found.</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left text-gray-800 border rounded-lg">
                                        <thead className="bg-[#4B2E83] text-white text-sm uppercase">
                                            <tr>
                                                <th className="px-6 py-3">Name</th>
                                                <th className="px-6 py-3">Email</th>
                                                <th className="px-6 py-3">Amount</th>
                                                <th className="px-6 py-3">Tickets</th>
                                                <th className="px-6 py-3">Raffles</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white">
                                            {donations.map((d, idx) => (
                                                <tr key={d.id} className={`border-t ${idx % 2 === 0 ? 'bg-[#f9f8ff]' : ''}`}>
                                                    <td className="px-6 py-4 font-medium">{d.name}</td>
                                                    <td className="px-6 py-4">{d.email}</td>
                                                    <td className="px-6 py-4">${d.amount}</td>
                                                    <td className="px-6 py-4">{d.totalTickets}</td>
                                                    <td className="px-6 py-4 space-x-1">
                                                        {d.selectedRaffles.map((id) => {
                                                            const name = raffleItems.find(r => r.id === id)?.name;
                                                            return (
                                                                <span
                                                                    key={id}
                                                                    className="inline-block bg-[#85754D] text-white px-3 py-1 rounded-full text-xs font-semibold shadow-sm"
                                                                >
                                                                    {name}
                                                                </span>
                                                            );
                                                        })}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </section>

                        {/* Draw Winners Button */}
                        <div className="text-center">
                            <button
                                onClick={drawWinners}
                                disabled={isDrawing || donations.length === 0}
                                className="cursor-pointer inline-flex items-center justify-center px-8 py-3 rounded-full bg-[#4B2E83] hover:bg-[#5d3da0] text-white font-semibold text-lg transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isDrawing ? 'Drawing...' : '🎯 Draw Winners'}
                            </button>
                        </div>

                        {/* Winners Section */}
                        {Object.keys(winners).length > 0 && (
                            <section className="bg-white rounded-2xl shadow-lg p-8 border border-[#e7e5f5]">
                                <h2 className="text-2xl font-semibold text-[#4B2E83] mb-6">🏆 Raffle Winners</h2>
                                <ul className="space-y-4">
                                    {raffleItems.map(item => (
                                        <li key={item.id} className="flex justify-between items-center bg-[#f5f3ff] rounded-lg px-5 py-3">
                                            <span className="font-medium text-gray-800">{item.name}</span>
                                            <span className="text-[#4B2E83] font-semibold">
                                                {winners[item.id] || 'No entries'}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {error && (
                            <p className="text-center text-red-600 font-medium">{error}</p>
                        )}
                    </div>
                </main>
            </header>
        </>
    );
}