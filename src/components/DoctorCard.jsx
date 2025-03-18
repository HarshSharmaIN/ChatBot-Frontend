import { Star, Calendar, Phone } from 'lucide-react';

export const DoctorCard = ({ doctor }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-blue-100 hover:shadow-xl transition-shadow duration-300">
      <div className="h-48 relative">
        <img
          src={doctor.image}
          alt={doctor.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-center gap-1 text-white">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium">{doctor.rating}</span>
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900">{doctor.name}</h3>
        <p className="text-blue-600 font-medium">{doctor.specialization}</p>
        
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{doctor.experience} years experience</span>
          </div>
          <button className="w-full mt-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity duration-200">
            <Phone className="w-4 h-4" />
            <span>Book Appointment</span>
          </button>
        </div>
      </div>
    </div>
  );
};