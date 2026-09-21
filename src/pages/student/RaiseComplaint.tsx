import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { useMockData } from '../../context/MockDataContext';
import type { Priority } from '../../types';
import { UploadCloud, CheckCircle2, ChevronRight, Check } from 'lucide-react';

const RaiseComplaint: React.FC = () => {
  const { categories, addComplaint, currentUser } = useMockData();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  
  // Form state
  const [categoryId, setCategoryId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [priority, setPriority] = useState<Priority>('Low');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const getLocationOptions = () => {
    switch (categoryId) {
      case 'CAT08': // Transport
        return ['Bus Route 1', 'Bus Route 2', 'Bus Route 3', 'College Van', 'Main Parking Area', 'Faculty Parking'];
      case 'CAT03': // Hostel
        return ['Boys Hostel - Block A', 'Boys Hostel - Block B', 'Girls Hostel - Block A', 'Girls Hostel - Block B', 'Hostel Mess', 'Hostel Gym'];
      case 'CAT02': // Lab Equipment
      case 'CAT07': // Internet
        return ['Computer Lab 1', 'Computer Lab 2', 'Computer Lab 3', 'Physics Lab', 'Chemistry Lab', 'Library E-Corner', 'Server Room'];
      case 'CAT04': // Mess & Canteen
        return ['Main Canteen', 'Hostel Mess', 'Block B Cafeteria', 'Staff Canteen'];
      case 'CAT05': // Classroom
        return ['Classroom A-101', 'Classroom A-102', 'Classroom B-201', 'Classroom B-202', 'Main Auditorium', 'Seminar Hall'];
      default:
        return ['Block A', 'Block B', 'Block C', 'Library', 'Sports Ground', 'Main Gate', 'Other'];
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 4) {
      setStep(step + 1);
      return;
    }

    setIsSubmitting(true);
    
    // Simulate network delay
    setTimeout(() => {
      addComplaint({
        categoryId,
        title,
        description,
        location,
        priority,
        studentId: currentUser?.id || 'U001'
      });
      // Mock generate ID to show success screen
      setSubmittedId(`#C00${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`);
      setIsSubmitting(false);
    }, 1500);
  };

  if (submittedId) {
    return (
      <Layout title="Complaint Status">
        <div className="max-w-md mx-auto mt-12 card text-center p-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-navy-900 mb-2">Complaint Submitted Successfully</h2>
          <p className="text-slate-500 mb-8">Your complaint has been registered and sent to the respective department.</p>
          
          <div className="bg-slate-50 rounded-lg p-6 mb-8 text-left space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-500 text-sm">Complaint ID:</span>
              <span className="font-bold text-navy-900">{submittedId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 text-sm">Category:</span>
              <span className="font-medium text-slate-800">{categories.find(c => c.id === categoryId)?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 text-sm">Status:</span>
              <span className="font-medium text-blue-600">Submitted</span>
            </div>
          </div>

          <div className="space-y-3">
            <button 
              onClick={() => navigate('/student')}
              className="btn-primary w-full"
            >
              Back to Dashboard
            </button>
            <button 
              onClick={() => navigate(`/student/track/${submittedId.replace('#', '')}`)}
              className="btn-secondary w-full"
            >
              Track Complaint
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Raise a Complaint">
      <div className="max-w-3xl mx-auto">
        
        {/* Progress Bar */}
        <div className="mb-8 relative">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map(num => (
              <div 
                key={num} 
                className="flex flex-col items-center relative z-10 cursor-pointer"
                onClick={() => setStep(num)}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                  step > num ? 'bg-green-500 text-white' : step === num ? 'bg-royal-600 text-white' : 'bg-slate-200 text-slate-500 hover:bg-slate-300'
                }`}>
                  {step > num ? <Check className="w-4 h-4" /> : num}
                </div>
                <span className={`text-xs mt-2 font-medium ${step >= num ? 'text-navy-900' : 'text-slate-500 group-hover:text-slate-700'}`}>
                  {num === 1 ? 'Category' : num === 2 ? 'Details' : num === 3 ? 'Evidence' : 'Submit'}
                </span>
              </div>
            ))}
          </div>
          <div className="absolute top-4 left-0 w-full h-0.5 bg-slate-200 -z-10">
            <div className="h-full bg-royal-600 transition-all duration-300" style={{ width: `${(step - 1) * 33.33}%` }}></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card">
          {step === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="text-xl font-bold text-navy-900 mb-4">Select Category</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categories.map(cat => (
                  <label 
                    key={cat.id} 
                    className={`cursor-pointer border rounded-xl p-4 transition-all flex items-center justify-between ${
                      categoryId === cat.id ? 'border-royal-500 ring-1 ring-royal-500 bg-royal-50' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                        {/* A generic icon or initial */}
                        {cat.name.charAt(0)}
                      </div>
                      <span className="font-medium text-slate-800">{cat.name}</span>
                    </div>
                    <input 
                      type="radio" 
                      name="category" 
                      value={cat.id} 
                      className="sr-only"
                      onChange={(e) => {
                        setCategoryId(e.target.value);
                        setLocation('');
                        setTimeout(() => setStep(2), 250);
                      }}
                      checked={categoryId === cat.id}
                    />
                  </label>
                ))}
              </div>
              <div className="pt-4 flex justify-end border-t border-slate-100">
                <button type="button" onClick={() => setStep(2)} disabled={!categoryId} className="btn-primary">
                  Next Step <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="text-xl font-bold text-navy-900 mb-4">Complaint Details</h3>
              <div>
                <label className="label-text">Complaint Title</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="E.g. Broken window in hostel room"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="label-text">Description</label>
                <textarea 
                  className="input-field min-h-[120px]" 
                  placeholder="Describe the issue in detail..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
              </div>
              <div>
                <label className="label-text">
                  {categoryId === 'CAT08' ? 'Transport Details / Location' : 'Location'}
                </label>
                <select 
                  className="input-field bg-white"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                >
                  <option value="" disabled>Select Location / Details</option>
                  {getLocationOptions().map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div className="pt-4 flex justify-between border-t border-slate-100">
                <button type="button" onClick={() => setStep(1)} className="btn-secondary">
                  Back
                </button>
                <button type="submit" className="btn-primary">
                  Next Step <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="text-xl font-bold text-navy-900 mb-4">Upload Evidence (Optional)</h3>
              
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center hover:bg-slate-50 transition-colors">
                <UploadCloud className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="font-medium text-slate-700 mb-1">Click to upload or drag and drop</p>
                <p className="text-sm text-slate-500 mb-4">SVG, PNG, JPG or PDF (max. 5MB)</p>
                <input type="file" className="hidden" id="file-upload" />
                <label htmlFor="file-upload" className="btn-secondary inline-flex cursor-pointer">
                  Browse Files
                </label>
              </div>

              <div className="pt-4 flex justify-between border-t border-slate-100">
                <button type="button" onClick={() => setStep(2)} className="btn-secondary">
                  Back
                </button>
                <button type="submit" className="btn-primary">
                  Next Step <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="text-xl font-bold text-navy-900 mb-4">Review & Submit</h3>
              
              <div>
                <label className="label-text mb-2">Select Priority</label>
                <div className="flex flex-wrap gap-3">
                  {(['Low', 'Medium', 'High', 'Urgent'] as Priority[]).map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                        priority === p 
                          ? p === 'Urgent' ? 'bg-red-600 text-white border-red-600'
                          : p === 'High' ? 'bg-orange-500 text-white border-orange-500'
                          : p === 'Medium' ? 'bg-yellow-500 text-white border-yellow-500'
                          : 'bg-blue-500 text-white border-blue-500'
                          : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-6 space-y-3 mt-6">
                <h4 className="font-semibold text-navy-900 mb-2 border-b border-slate-200 pb-2">Summary</h4>
                <div className="flex flex-col sm:flex-row sm:justify-between">
                  <span className="text-slate-500 text-sm w-32">Category:</span>
                  <span className="font-medium text-slate-800">{categories.find(c => c.id === categoryId)?.name}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between">
                  <span className="text-slate-500 text-sm w-32">Title:</span>
                  <span className="font-medium text-slate-800">{title}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between">
                  <span className="text-slate-500 text-sm w-32">Location:</span>
                  <span className="font-medium text-slate-800">{location}</span>
                </div>
              </div>

              <div className="pt-4 flex justify-between border-t border-slate-100">
                <button type="button" onClick={() => setStep(3)} className="btn-secondary">
                  Back
                </button>
                <button type="submit" disabled={isSubmitting} className="btn-primary min-w-[150px]">
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    'Submit Complaint'
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </Layout>
  );
};

export default RaiseComplaint;
