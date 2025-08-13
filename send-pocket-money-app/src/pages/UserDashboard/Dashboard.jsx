import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import {
  Bell,
  X,
  CreditCard,
  ArrowRightLeft,
  Banknote,
  Wallet,
} from 'lucide-react';

// Custom hook to get window width for responsive design
const useWindowWidth = () => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowWidth;
};

// Reusable Button for Services
const ServiceButton = ({ onClick, children, icon: Icon }) => (
    <button onClick={onClick} className="service-button">
        <div className="service-icon-wrapper">
            <Icon size={24} className="service-icon" />
        </div>
        <span className="service-label">{children}</span>
    </button>
);

// Top bar component
const TopBar = ({ user, currentTime, onNotificationClick }) => {
    const windowWidth = useWindowWidth();
    const isMobile = windowWidth < 768;
    return (
        <div className="top-bar">
            <div className="user-profile">
                <div className="user-avatar">{user.initials}</div>
                {!isMobile && (
                    <div className="user-info">
                        <div className="user-name">{user.name}</div>
                        <div className="current-time">
                            {currentTime.toLocaleDateString()} {currentTime.toLocaleTimeString()}
                        </div>
                    </div>
                )}
            </div>
            <button onClick={onNotificationClick} className="notification-button">
                <Bell size={24} />
            </button>
        </div>
    );
};

// New Dashboard Summary component
const DashboardSummary = ({ accounts, monthlyExpenses }) => {
    const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0).toFixed(2);
    return (
        <div className="dashboard-summary">
            <h2 className="summary-title">Dashboard Overview</h2>
            <div className="summary-grid">
                <div className="balance-card">
                    <div className="balance-label">Total Balance</div>
                    <div className="balance-amount">${totalBalance}</div>
                </div>
                <div className="expenses-card">
                    <div className="expenses-label">Monthly Expenses</div>
                    <ResponsiveContainer width="100%" height={100} className="expenses-chart">
                        <BarChart data={monthlyExpenses} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                            <YAxis hide={true} />
                            <Tooltip />
                            <Bar dataKey="expenses" fill="#4f46e5" radius={[10, 10, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

// Advertisement Carousel Component
const Carousel = ({ advertisements }) => {
    const [currentAdIndex, setCurrentAdIndex] = useState(0);

    // Auto-rotate the ads every 5 seconds
    useEffect(() => {
        const adInterval = setInterval(() => {
            setCurrentAdIndex((prevIndex) => (prevIndex + 1) % advertisements.length);
        }, 5000);
        return () => clearInterval(adInterval);
    }, [advertisements.length]);

    return (
        <div className="carousel-container">
            {advertisements.map((ad, index) => (
                <div
                    key={index}
                    className={`carousel-slide ${ad.color} ${index === currentAdIndex ? 'active' : ''}`}
                >
                    <h3 className="carousel-title">{ad.title}</h3>
                    <p className="carousel-text">{ad.text}</p>
                </div>
            ))}
            <div className="carousel-nav">
                {advertisements.map((_, index) => (
                    <span
                        key={index}
                        onClick={() => setCurrentAdIndex(index)}
                        className={`carousel-dot ${index === currentAdIndex ? 'active' : ''}`}
                    ></span>
                ))}
            </div>
        </div>
    );
};

// Pagination Component
const Pagination = ({ currentPage, totalPages, paginate }) => (
    <div className="pagination">
        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="pagination-button disabled:opacity-50">
            Previous
        </button>
        <span className="pagination-info">
            Page {currentPage} of {totalPages}
        </span>
        <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="pagination-button disabled:opacity-50">
            Next
        </button>
    </div>
);

// Generic Modal for services
const ServiceModal = ({ show, onClose, children }) => {
    if (!show) return null;
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                {children}
                <button onClick={onClose} className="modal-close-button">
                    <X size={24} />
                </button>
            </div>
        </div>
    );
};

// Send Money Modal
const SendMoneyModal = ({ onClose, fxRates, showAppNotification }) => {
    const [amount, setAmount] = useState(100);
    const [currency, setCurrency] = useState("GBP");
    const [summary, setSummary] = useState({ fee: 0, fxRate: 0, finalAmount: 0 });
    const [amountError, setAmountError] = useState('');

    const feeConfig = {
        USD: { type: "flat", value: 2 },
        GBP: { type: "percent", value: 0.02 },
        ZAR: { type: "percent", value: 0.05 },
    };

    useEffect(() => {
        const calculateTransaction = () => {
            const amt = parseFloat(amount);
            if (isNaN(amt) || amt < 10 || amt > 10000) {
                setAmountError('Enter an amount between 10 and 10,000.');
                setSummary({ fee: 0, fxRate: 0, finalAmount: 0 });
                return;
            } else {
                setAmountError('');
            }

            const feeData = feeConfig[currency] || { type: "flat", value: 2 };
            const rate = fxRates[currency] || 1;

            let calculatedFee = feeData.type === "percent" ? amt * feeData.value : feeData.value;
            calculatedFee = Math.round(calculatedFee * 100) / 100;

            const amountAfterFee = amt - calculatedFee;
            const calculatedFinal = Math.round(amountAfterFee * rate * 100) / 100;

            setSummary({
                fee: calculatedFee,
                fxRate: rate,
                finalAmount: calculatedFinal,
            });
        };

        if (Object.keys(fxRates).length > 0) {
            calculateTransaction();
        }

    }, [amount, currency, fxRates]);
    
    const handleSend = () => {
        if (!amountError) {
            showAppNotification(`Sending ${amount} USD. Recipient receives ${currency} ${summary.finalAmount.toFixed(2)}.`);
            onClose();
        }
    };

    return (
        <div className="send-money-modal">
            <h2 className="modal-title">Send Money</h2>
            <div className="form-group">
                <label htmlFor="amount" className="form-label">Amount (USD)</label>
                <input
                    id="amount"
                    type="number"
                    value={amount}
                    min="10"
                    max="10000"
                    onChange={(e) => setAmount(e.target.value)}
                    className={`form-input ${amountError ? 'input-error' : ''}`}
                />
                {amountError && <p className="error-message">{amountError}</p>}
            </div>
            <div className="form-group">
                <label htmlFor="currency" className="form-label">Recipient Currency</label>
                <select
                    id="currency"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="form-select"
                >
                    {Object.keys(fxRates).map((cur) => (
                        <option key={cur} value={cur}>{cur}</option>
                    ))}
                </select>
            </div>
            <div className="summary-box">
                <h3 className="summary-box-title">Transaction Summary</h3>
                <p className="summary-detail">Fee: {currency} {summary.fee.toFixed(2)}</p>
                <p className="summary-detail">Exchange Rate: 1 USD = {summary.fxRate} {currency}</p>
                <p className="summary-final-amount">Recipient Receives: {currency} {summary.finalAmount.toFixed(2)}</p>
            </div>
            <div className="modal-action-buttons">
                <button onClick={handleSend} className="send-button">
                    Send
                </button>
            </div>
        </div>
    );
};

// Main Dashboard component
export default function Dashboard() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [showModal, setShowModal] = useState(false);
    const [fxRates, setFxRates] = useState({});
    const [transactions, setTransactions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const transactionsPerPage = 5;
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');

    const user = { name: "Lisa Chimunhu", initials: "LC" };
    const accounts = [
        { name: "Primary Account", balance: 2749.0 },
        { name: "Saving Account", balance: 50.0 },
    ];
    const advertisements = [
        { title: "Get a Personal Loan", text: "Low interest rates, quick approval!", color: "bg-blue-600" },
        { title: "Open a High-Yield Savings", text: "Earn more on your savings today.", color: "bg-green-600" },
    ];

    const monthlyExpenses = [
        { name: 'Jan', expenses: 400 },
        { name: 'Feb', expenses: 300 },
        { name: 'Mar', expenses: 200 },
        { name: 'Apr', expenses: 278 },
        { name: 'May', expenses: 189 },
    ];

    const showAppNotification = (message) => {
        setNotificationMessage(message);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
    };

    const fetchWithRetry = async (url, options = {}, retries = 3) => {
        let delay = 1000;
        for (let i = 0; i < retries; i++) {
            try {
                const response = await fetch(url, options);
                if (!response.ok) throw new Error('API request failed');
                return await response.json();
            } catch (error) {
                console.error(`Attempt ${i + 1} failed: ${error.message}`);
                if (i < retries - 1) {
                    await new Promise(res => setTimeout(res, delay));
                    delay *= 2;
                } else {
                    throw error;
                }
            }
        }
    };

    useEffect(() => {
        const fetchFxRates = async () => {
            const apiUrl = 'https://68976304250b078c2041c7fc.mockapi.io/api/wiremit/InterviewAPIS';
            try {
                const data = await fetchWithRetry(apiUrl);
                const processedRates = data.reduce((acc, curr) => ({ ...acc, ...curr }), {});
                setFxRates(processedRates);
                console.log('Fetched FX Rates:', processedRates);
            } catch (error) {
                console.error('Failed to fetch FX rates after multiple retries.', error);
                setFxRates({ USD: 1, GBP: 0.74, ZAR: 17.75, USDT: 1 });
            }
        };
        fetchFxRates();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const generateTransactions = () => {
            const mockTransactions = [];
            const transactionTypes = ['Payment', 'Transfer', 'Deposit', 'Withdrawal'];
            const transactionDescriptions = ['Groceries', 'Rent', 'Freelance Work', 'Online Shopping'];
            const currencies = ['USD', 'GBP', 'ZAR', 'USD', 'USD'];
            for (let i = 1; i <= 25; i++) {
                const amount = (Math.random() * 500).toFixed(2);
                const type = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
                const description = transactionDescriptions[Math.floor(Math.random() * transactionDescriptions.length)];
                const date = new Date(Date.now() - i * 86400000).toLocaleDateString();
                const currency = currencies[Math.floor(Math.random() * currencies.length)];
                mockTransactions.push({
                    id: i,
                    date,
                    type,
                    description,
                    amount,
                    currency,
                });
            }
            setTransactions(mockTransactions);
        };
        generateTransactions();
    }, []);

    const totalPages = Math.ceil(transactions.length / transactionsPerPage);
    const indexOfLastTransaction = currentPage * transactionsPerPage;
    const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
    const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const getCurrencySymbol = (currency) => {
        switch (currency) {
            case 'USD':
                return '$';
            case 'GBP':
                return '£';
            case 'ZAR':
                return 'R';
            default:
                return '';
        }
    };
    
    const AccountCard = ({ account, onClick }) => (
        <div onClick={onClick} className="account-card">
            <div className="account-icon-wrapper">
                <Wallet size={24} className="account-icon" />
            </div>
            <div className="account-details">
                <div className="account-name">{account.name}</div>
                <div className="account-balance">${account.balance.toFixed(2)}</div>
            </div>
        </div>
    );

    return (
        <div className="dashboard-container">
            <style>{`
                /* You would typically import this from a compiled CSS file, like so:
                 * import './dashboard.css';
                 * but for this example, we've included the styles inline below.
                 * Please see the next immersive for the SCSS source code.
                 */
                .dashboard-container {
                    min-height: 100vh;
                    background-color: #f3f4f6;
                    padding: 1rem;
                    font-family: 'Inter', sans-serif;
                }
                @media (min-width: 640px) {
                    .dashboard-container {
                        padding: 1.5rem;
                    }
                }
                /* Adjusted for centered desktop view */
                @media (min-width: 1024px) {
                    body {
                        display: flex;
                        justify-content: center;
                        background-color: #f3f4f6;
                    }
                    .dashboard-container {
                        max-width: 900px;
                        width: 100%;
                        margin: 2rem auto;
                        box-sizing: border-box;
                    }
                }
                
                .notification-banner {
                    position: fixed;
                    top: 1rem;
                    left: 50%;
                    transform: translateX(-50%);
                    background-color: #10b981;
                    color: white;
                    padding: 0.75rem 1.5rem;
                    border-radius: 9999px;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                    z-index: 50;
                    animation: fade-in 0.5s ease-out;
                }

                @keyframes fade-in {
                    from { opacity: 0; transform: translate(-50%, -20px); }
                    to { opacity: 1; transform: translate(-50%, 0); }
                }

                .top-bar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background-color: white;
                    padding: 1rem;
                    border-radius: 1.5rem;
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                }

                .user-profile {
                    display: flex;
                    align-items: center;
                }
                
                .user-avatar {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 3rem;
                    height: 3rem;
                    border-radius: 9999px;
                    background-color: #4f46e5;
                    color: white;
                    font-weight: bold;
                    font-size: 1.25rem;
                }
                
                .user-info {
                    margin-left: 1rem;
                }

                @media (max-width: 767px) {
                    .user-info {
                        display: none;
                    }
                }
                
                .user-name {
                    font-weight: bold;
                    font-size: 1.125rem;
                    color: #1f2937;
                }
                
                .current-time {
                    font-size: 0.875rem;
                    color: #6b7280;
                }
                
                .notification-button {
                    padding: 0.75rem;
                    background-color: #f3f4f6;
                    border-radius: 9999px;
                    color: #4f46e5;
                    transition-property: background-color;
                    transition-duration: 200ms;
                }
                
                .notification-button:hover {
                    background-color: #e5e7eb;
                }

                .dashboard-summary {
                    margin-top: 1.5rem;
                    padding: 1.5rem;
                    background-color: white;
                    border-radius: 1.5rem;
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                }

                .summary-title {
                    font-size: 1.5rem;
                    font-weight: bold;
                    margin-bottom: 1rem;
                    color: #1f2937;
                }

                .summary-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 1.5rem;
                }

                @media (min-width: 768px) {
                    .summary-grid {
                        grid-template-columns: 1fr 1fr;
                    }
                }
                
                .balance-card, .expenses-card {
                    padding: 1.5rem;
                    background-color: #f9fafb;
                    border-radius: 1rem;
                }

                .balance-label, .expenses-label {
                    font-size: 1.125rem;
                    font-weight: 500;
                    color: #6b7280;
                }
                
                .balance-amount {
                    font-size: 2.25rem;
                    font-weight: 800;
                    margin-top: 0.5rem;
                    color: #1f2937;
                }

                .expenses-chart {
                    margin-top: 0.5rem;
                }

                .account-cards-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 1rem;
                    margin-top: 1.5rem;
                }

                @media (min-width: 768px) {
                    .account-cards-grid {
                        grid-template-columns: 1fr 1fr;
                    }
                }

                /* Adjusted for full-width desktop view */
                @media (min-width: 1024px) {
                    .account-cards-grid {
                        grid-template-columns: repeat(3, minmax(0, 1fr));
                    }
                }

                .account-card {
                    display: flex;
                    align-items: center;
                    padding: 1.5rem;
                    background-color: white;
                    border-radius: 1.5rem;
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                    cursor: pointer;
                    transition: transform 200ms;
                }

                .account-card:hover {
                    transform: scale(1.05);
                }

                .account-icon-wrapper {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 3rem;
                    height: 3rem;
                    border-radius: 9999px;
                    background-color: #e5e7eb;
                    font-size: 1.25rem;
                }
                
                .account-icon {
                    color: #4b5563;
                }

                .account-details {
                    margin-left: 1rem;
                }
                
                .account-name {
                    font-size: 1.125rem;
                    font-weight: 500;
                    color: #4b5563;
                }
                
                .account-balance {
                    font-size: 1.5rem;
                    font-weight: bold;
                    margin-top: 0.25rem;
                    color: #1f2937;
                }

                .services-grid {
                    display: grid;
                    grid-template-columns: repeat(3, minmax(0, 1fr));
                    gap: 1rem;
                    margin-top: 2rem;
                }
                
                .service-button {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 1rem;
                    background-color: white;
                    border-radius: 1rem;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                    transition: background-color 200ms;
                }
                
                .service-button:hover {
                    background-color: #f9fafb;
                }
                
                .service-icon-wrapper {
                    padding: 0.75rem;
                    background-color: #eef2ff;
                    border-radius: 9999px;
                    margin-bottom: 0.5rem;
                }

                .service-icon {
                    color: #4f46e5;
                }
                
                .service-label {
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: #4b5563;
                }

                .carousel-container {
                    position: relative;
                    margin-top: 2rem;
                    border-radius: 1.5rem;
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                    overflow: hidden;
                    height: 10rem;
                }
                
                .carousel-slide {
                    position: absolute;
                    inset: 0;
                    padding: 1.5rem;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    color: white;
                    transition: opacity 1000ms ease-in-out;
                    opacity: 0;
                }

                .carousel-slide.active {
                    opacity: 1;
                }

                .carousel-title {
                    font-size: 1.25rem;
                    font-weight: bold;
                }

                .carousel-text {
                    font-size: 0.875rem;
                    margin-top: 0.5rem;
                }

                .carousel-nav {
                    position: absolute;
                    bottom: 1rem;
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    gap: 0.5rem;
                }
                
                .carousel-dot {
                    display: block;
                    width: 0.625rem;
                    height: 0.625rem;
                    border-radius: 9999px;
                    cursor: pointer;
                    transition: background-color 200ms;
                    background-color: rgba(255, 255, 255, 0.5);
                }
                
                .carousel-dot.active {
                    background-color: white;
                }

                .transactions-section {
                    margin-top: 2rem;
                    padding: 1.5rem;
                    background-color: white;
                    border-radius: 1.5rem;
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                }

                .transactions-title {
                    font-size: 1.5rem;
                    font-weight: bold;
                    margin-bottom: 1rem;
                    color: #1f2937;
                }

                .transactions-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                
                .transaction-item {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 1rem;
                    background-color: #f9fafb;
                    border-radius: 1rem;
                }
                
                .transaction-info {
                    display: flex;
                    flex-direction: column;
                }
                
                .transaction-description {
                    font-weight: 600;
                    color: #1f2937;
                }
                
.transaction-date {
                    font-size: 0.875rem;
                    color: #6b7280;
                }
                
                .transaction-amount {
                    font-weight: bold;
                    font-size: 1.125rem;
                }
                
                .transaction-amount.deposit {
                    color: #22c55e;
                }
                
                .transaction-amount.withdrawal {
                    color: #ef4444;
                }

                .pagination {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    margin-top: 1.5rem;
                    font-size: 0.875rem;
                    font-weight: 600;
                }
                
                .pagination-button {
                    padding: 0.5rem 1rem;
                    border-radius: 0.75rem;
                    background-color: #eef2ff;
                    color: #4f46e5;
                }
                
                .pagination-info {
                    padding: 0.5rem 1rem;
                    color: #4b5563;
                }

                .modal-overlay {
                    position: fixed;
                    inset: 0;
                    background-color: rgba(17, 24, 39, 0.75);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 1rem;
                    z-index: 50;
                }
                
                .modal-content {
                    position: relative;
                    background-color: white;
                    padding: 2rem;
                    border-radius: 1.5rem;
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                    max-width: 32rem;
                    width: 100%;
                }
                
                .modal-close-button {
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    color: #6b7280;
                    transition: color 200ms;
                }
                
.modal-close-button:hover {
                    color: #1f2937;
                }

                .send-money-modal {
                    text-align: center;
                }
                
                .modal-title {
                    font-size: 1.875rem;
                    font-weight: bold;
                    margin-bottom: 1.5rem;
                    color: #1f2937;
                }

                .form-group {
                    text-align: left;
                    margin-bottom: 1rem;
                }

                .form-label {
                    display: block;
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: #374151;
                }

                .form-input, .form-select {
                    margin-top: 0.25rem;
                    display: block;
                    width: 100%;
                    border-radius: 0.75rem;
                    border-width: 1px;
                    border-color: #d1d5db;
                    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
                    padding: 0.75rem;
                    transition: border-color 200ms, box-shadow 200ms;
                }
                
                .form-input:focus, .form-select:focus {
                    outline: 2px solid transparent;
                    outline-offset: 2px;
                    border-color: #4f46e5;
                    --tw-ring-color: #4f46e5;
                    box-shadow: 0 0 0 1px var(--tw-ring-color);
                }

                .input-error {
                    border-color: #ef4444;
                }

                .error-message {
                    margin-top: 0.25rem;
                    font-size: 0.875rem;
                    color: #ef4444;
                }

                .summary-box {
                    margin-top: 1.5rem;
                    padding: 1rem;
                    background-color: #f9fafb;
                    border-radius: 1rem;
                    text-align: left;
                }
                
                .summary-box-title {
                    font-size: 1.125rem;
                    font-weight: bold;
                    margin-bottom: 0.5rem;
                }
                
                .summary-detail {
                    font-size: 0.875rem;
                }

                .summary-final-amount {
                    font-size: 1.125rem;
                    font-weight: bold;
                    margin-top: 0.5rem;
                    color: #4f46e5;
                }
                
                .modal-action-buttons {
                    margin-top: 1.5rem;
                    display: flex;
                    justify-content: center;
                }
                
                .send-button {
                    width: 100%;
                    padding: 0.75rem 1.5rem;
                    border-radius: 1rem;
                    background-color: #4f46e5;
                    color: white;
                    font-weight: bold;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                    transition: background-color 200ms;
                }
                
                .send-button:hover {
                    background-color: #4338ca;
                }
            `}</style>

            {showNotification && (
                <div className="notification-banner">
                    {notificationMessage}
                </div>
            )}

            <TopBar
                user={user}
                currentTime={currentTime}
                onNotificationClick={() => showAppNotification("You have no new notifications.")}
            />

            <DashboardSummary accounts={accounts} monthlyExpenses={monthlyExpenses} />

            <div className="account-cards-grid">
                {accounts.map((acc, idx) => (
                    <AccountCard
                        key={idx}
                        account={acc}
                        onClick={() => showAppNotification(`Showing details for ${acc.name}.`)}
                    />
                ))}
            </div>

            <div className="services-grid">
                <ServiceButton onClick={() => setShowModal(true)} icon={ArrowRightLeft}>Transfer</ServiceButton>
                <ServiceButton onClick={() => showAppNotification("Payment functionality is coming soon.")} icon={CreditCard}>Payment</ServiceButton>
                <ServiceButton onClick={() => showAppNotification("Withdrawal functionality is coming soon.")} icon={Banknote}>Withdraw</ServiceButton>
            </div>
            
            <Carousel advertisements={advertisements} />

            <div className="transactions-section">
                <h2 className="transactions-title">Recent Transactions</h2>
                {currentTransactions.length > 0 ? (
                    <>
                        <div className="transactions-list">
                            {currentTransactions.map((tx) => (
                                <div key={tx.id} className="transaction-item">
                                    <div className="transaction-info">
                                        <div className="transaction-description">{tx.description}</div>
                                        <div className="transaction-date">{tx.date}</div>
                                    </div>
                                    <div className={`transaction-amount ${tx.type === 'Deposit' ? 'deposit' : 'withdrawal'}`}>
                                        {tx.type === 'Deposit' ? '+' : '-'}{getCurrencySymbol(tx.currency)}{tx.amount}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="pagination">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                paginate={paginate}
                            />
                        </div>
                    </>
                ) : (
                    <p className="no-transactions">No transactions found.</p>
                )}
            </div>
            
            <ServiceModal show={showModal} onClose={() => setShowModal(false)}>
                <SendMoneyModal
                    onClose={() => setShowModal(false)}
                    fxRates={fxRates}
                    showAppNotification={showAppNotification}
                />
            </ServiceModal>
        </div>
    );
}
