import { useState, useEffect } from 'react';
import { useNavigation } from 'react-router-dom';
import { db } from '@/service/firebaseConfig';
import { collection, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore';
import UserTripCardItem from './components/UserTripCardItem';

function Index() {
    const navigation = useNavigation();
    const [userTrips, setUserTrips] = useState([]);
    const [selectedTrip, setSelectedTrip] = useState(null); // State to manage selected trip for deletion
    const [showModal, setShowModal] = useState(false); // State to toggle modal visibility

    useEffect(() => {
        GetUserTrips();
    }, []);

    const GetUserTrips = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            navigation('/');
            return;
        }
        const q = query(collection(db, 'AITrips'), where('userEmail', '==', user?.email));
        const querySnapshot = await getDocs(q);
        setUserTrips([]);
        querySnapshot.forEach((doc) => {
            setUserTrips(prevVal => [...prevVal, { id: doc.id, ...doc.data() }]);
        });
    };

    const confirmDeleteTrip = (trip) => {
        setSelectedTrip(trip);
        setShowModal(true);
    };

    const deleteTrip = async () => {
        if (selectedTrip) {
            try {
                await deleteDoc(doc(db, 'AITrips', selectedTrip.id));
                setUserTrips(prevTrips => prevTrips.filter(trip => trip.id !== selectedTrip.id));
                console.log('Trip deleted successfully!');
            } catch (error) {
                console.error('Error deleting trip:', error);
            }
        }
        setShowModal(false);
        setSelectedTrip(null);
    };

    return (
        <div className='sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10'>
            <h2 className='font-bold text-3xl'>My Trips</h2>
            <div className='grid grid-cols-2 mt-10 md:grid-cols-3 gap-5'>
                {userTrips?.length > 0 ? userTrips.map((trip, index) => (
                    <UserTripCardItem
                        trip={trip}
                        key={index}
                        onDelete={() => confirmDeleteTrip(trip)} // Trigger confirmation modal
                    />
                ))
                : [1, 2, 3, 4, 5, 6].map((item, index) => (
                    <div key={index} className='h-[290px] w-full bg-slate-200 animate-pulse rounded-xl'></div>
                ))}
            </div>

            {/* Confirmation Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 max-w-md w-full text-center shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Are you sure?</h2>
                        <p className="text-gray-600 mb-6">
                            Do you really want to delete <span className="font-semibold">{selectedTrip?.name || 'this trip'}</span>? 
                            This action cannot be undone.
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                                onClick={deleteTrip}
                            >
                                Delete
                            </button>
                            <button
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Index;
