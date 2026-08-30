import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AlertCircle, CheckCircle2, MapPin, Mic, MicOff, Volume2, Sparkles, Accessibility } from 'lucide-react';

export const PatientSosView = () => {
  const { createSosEmergency, sosEmergencies } = useApp();
  
  const [patientName, setPatientName] = useState('Citizen Patient (Accessibility Voice SOS)');
  const [phone, setPhone] = useState('123-456-7890');
  const [address, setAddress] = useState('123 Wellness Blvd, Health City');
  const [submittedSos, setSubmittedSos] = useState(null);

  // Voice Assistant State for Speech-Impaired / Handicapped Patients
  const [isListening, setIsListening] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState('Click to activate Voice/Speech Assistant');
  const [detectedText, setDetectedText] = useState('');

  const handleTriggerSos = (customAddress = null) => {
    const sos = createSosEmergency({
      patientName: patientName || 'Accessibility Emergency Patient',
      phone: phone || '123-456-7890',
      age: 42,
      emergencyType: 'Accessibility Voice SOS Call',
      pickupLocation: {
        lat: 40.715000,
        lng: -73.955000,
        address: customAddress || address || '123 Wellness Blvd, Health City'
      }
    });
    setSubmittedSos(sos);
  };

  // Start Speech Recognition
  const startSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceStatus('Speech recognition not supported in browser. Using sound triggers.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceStatus('🎙️ Listening for emergency words ("HELP", "SOS", "AMBULANCE")...');
      };

      recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        setDetectedText(text);
        setVoiceStatus(`✅ Voice Detected: "${text}". Triggering SOS...`);
        setIsListening(false);
        setTimeout(() => {
          handleTriggerSos(`Voice SOS: ${text} - ${address}`);
        }, 1000);
      };

      recognition.onerror = () => {
        setIsListening(false);
        setVoiceStatus('Voice recognition paused. Tap button or sound presets below.');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.log('Speech Recognition error:', e);
      setIsListening(false);
    }
  };

  const activeUserSos = submittedSos
    ? sosEmergencies.find((s) => s.id === submittedSos.id) || submittedSos
    : null;

  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-6 text-slate-800">
      
      {/* Header Banner */}
      <div className="bg-[#064e3b] text-white p-6 rounded-3xl shadow-md border border-emerald-700 text-center space-y-2">
        <div className="h-12 w-12 rounded-2xl bg-red-600 border border-red-400 flex items-center justify-center mx-auto shadow-md">
          <AlertCircle className="h-7 w-7 text-white animate-bounce" />
        </div>
        <h1 className="text-2xl font-bold font-serif text-white">CITIZEN EMERGENCY SOS PORTAL</h1>
        <p className="text-xs text-emerald-200 font-medium">WellCare Emergency Dispatch Network • Toll-Free 108</p>
      </div>

      {activeUserSos ? (
        <div className="bg-white border-2 border-emerald-600 rounded-3xl p-6 shadow-md space-y-4 text-center">
          <CheckCircle2 className="h-14 w-14 text-emerald-600 mx-auto animate-pulse" />
          <h2 className="text-2xl font-bold font-serif text-slate-900">EMERGENCY SOS BROADCASTED!</h2>

          <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-left space-y-2 text-xs">
            <div className="flex justify-between border-b border-emerald-200 pb-1">
              <span className="font-bold text-slate-600">Reference ID:</span>
              <span className="font-extrabold text-red-600 text-sm">{activeUserSos.id}</span>
            </div>
            <div className="flex justify-between border-b border-emerald-200 pb-1">
              <span className="font-bold text-slate-600">Dispatch Status:</span>
              <span className="font-extrabold text-emerald-800 text-sm">{activeUserSos.status}</span>
            </div>
            <div className="flex justify-between border-b border-emerald-200 pb-1">
              <span className="font-bold text-slate-600">Patient:</span>
              <span className="font-bold text-slate-900">{activeUserSos.patientName}</span>
            </div>
            <div>
              <span className="font-bold text-slate-600 block mb-0.5">Pickup Address:</span>
              <span className="text-slate-900 font-medium">{activeUserSos.pickupLocation?.address}</span>
            </div>
          </div>

          <p className="text-xs text-slate-600 font-medium">
            Call centre operator has received your location address and an available ambulance is being dispatched immediately.
          </p>

          <button
            onClick={() => setSubmittedSos(null)}
            className="w-full py-3 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-xs rounded-xl transition-all"
          >
            Trigger Another SOS Request
          </button>
        </div>
      ) : (
        <div className="bg-white border border-emerald-200 rounded-3xl p-6 shadow-md space-y-6 text-center">
          
          <div>
            <h2 className="text-xl font-bold font-serif text-slate-900 mb-1">
              1-Tap Immediate SOS Trigger
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Press the big red button or use the voice assistant below to broadcast your GPS location to Call Centre.
            </p>
          </div>

          {/* ACCESSIBILITY VOICE ASSISTANT CARD (FOR SPEECH-IMPAIRED / HANDICAPPED PERSONS) */}
          <div className="bg-emerald-50 border-2 border-emerald-500 rounded-3xl p-4 text-left space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Accessibility className="h-5 w-5 text-emerald-800" />
                <h3 className="font-extrabold text-xs text-emerald-900 uppercase tracking-wider">
                  Accessibility Voice Assistant (Speech & Sound Triggers)
                </h3>
              </div>
              <span className="bg-emerald-200 text-emerald-900 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                Handicapped Mode
              </span>
            </div>

            <p className="text-[11px] text-slate-600 font-medium">
              Designed for non-verbal, speech-impaired, and handicapped individuals to request help instantly.
            </p>

            {/* Mic Activation Button & Status */}
            <div className="flex items-center space-x-3 bg-white p-3 rounded-2xl border border-emerald-300">
              <button
                type="button"
                onClick={startSpeechRecognition}
                className={`p-3 rounded-2xl flex items-center justify-center transition-all ${
                  isListening
                    ? 'bg-red-600 text-white animate-pulse ring-4 ring-red-300'
                    : 'bg-[#064e3b] hover:bg-emerald-900 text-white shadow-md'
                }`}
              >
                {isListening ? <Mic className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
              </button>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-900">{voiceStatus}</p>
                {detectedText && <p className="text-[11px] font-extrabold text-emerald-700">Detected: "{detectedText}"</p>}
              </div>
            </div>

            {/* Quick 1-Click Audio / Command Presets */}
            <div className="space-y-1.5 pt-1">
              <label className="text-[10px] font-extrabold text-emerald-900 uppercase block">
                Quick Sound & Command Presets (1-Click Trigger):
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleTriggerSos(`Voice Trigger: EMERGENCY HELP REQUIRED`)}
                  className="p-2.5 bg-white hover:bg-emerald-100 border border-emerald-300 rounded-xl text-xs font-bold text-slate-800 flex items-center space-x-1.5 shadow-xs"
                >
                  <Volume2 className="h-4 w-4 text-red-600 shrink-0" />
                  <span>🔊 "HELP! SOS"</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTriggerSos(`Voice Trigger: ACCIDENT DISPATCH`)}
                  className="p-2.5 bg-white hover:bg-emerald-100 border border-emerald-300 rounded-xl text-xs font-bold text-slate-800 flex items-center space-x-1.5 shadow-xs"
                >
                  <Volume2 className="h-4 w-4 text-emerald-700 shrink-0" />
                  <span>🔊 "AMBULANCE!"</span>
                </button>
              </div>
            </div>
          </div>

          {/* Pickup Address Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700 uppercase text-[10px] tracking-wider">Pickup Location Address</span>
              <span className="text-[10px] text-emerald-700 font-bold flex items-center space-x-1">
                <MapPin className="h-3 w-3 text-red-500" />
                <span>GPS Auto-Detected</span>
              </span>
            </div>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter pickup address"
              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-600"
            />
          </div>

          {/* ULTRA-HUGE BIGGER SOS BUTTON */}
          <button
            onClick={() => handleTriggerSos()}
            type="button"
            className="w-full py-12 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-3xl font-black text-2xl sm:text-3xl uppercase tracking-wider shadow-2xl flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 transition-all transform hover:scale-[1.03] active:scale-95 cursor-pointer ring-8 ring-red-200"
          >
            <AlertCircle className="h-12 w-12 text-white animate-bounce shrink-0" />
            <span>SOS – TRIGGER EMERGENCY</span>
          </button>

          <p className="text-xs text-slate-500 font-medium pt-2">
            Emergency Toll-Free Direct Hotline: <strong className="text-emerald-900 font-black">108 / (123) 456-7890</strong>
          </p>

        </div>
      )}

    </div>
  );
};
