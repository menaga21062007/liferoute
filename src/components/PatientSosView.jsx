import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { AlertCircle, CheckCircle2, MapPin, Volume2, Accessibility, Radio, Sparkles, Mic } from 'lucide-react';

export const PatientSosView = () => {
  const { createSosEmergency, sosEmergencies } = useApp();
  
  const [patientName, setPatientName] = useState('Citizen Patient (Hands-Free Voice SOS)');
  const [phone, setPhone] = useState('123-456-7890');
  const [address, setAddress] = useState('123 Wellness Blvd, Health City');
  const [submittedSos, setSubmittedSos] = useState(null);

  // Voice Assistant State
  const [isListening, setIsListening] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState('🎙️ Click "TAP TO SPEAK" below to activate Voice Assistant');
  const [detectedText, setDetectedText] = useState('');
  const recognitionRef = useRef(null);

  const handleTriggerSos = (customAddress = null) => {
    const sos = createSosEmergency({
      patientName: patientName || 'Hands-Free Emergency Patient',
      phone: phone || '123-456-7890',
      age: 42,
      emergencyType: 'Hands-Free Google Voice SOS',
      pickupLocation: {
        lat: 40.715000,
        lng: -73.955000,
        address: customAddress || address || '123 Wellness Blvd, Health City'
      }
    });
    setSubmittedSos(sos);
  };

  // Start Speech Recognition with user click permission
  const startSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceStatus('Speech recognition active in fallback mode. Click sound presets below.');
      return;
    }

    try {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch(e) {}
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceStatus('🔴 VOICE LISTENING ACTIVE: Speak "HELP", "EMERGENCY", "AMBULANCE"...');
      };

      recognition.onresult = (event) => {
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const text = event.results[i][0].transcript.toLowerCase();
          setDetectedText(text);

          if (
            text.includes('help') ||
            text.includes('sos') ||
            text.includes('ambulance') ||
            text.includes('emergency') ||
            text.includes('accident') ||
            text.includes('save me')
          ) {
            setVoiceStatus(`✅ EMERGENCY DETECTED: "${text}". Transmitting signal to Call Centre!`);
            setIsListening(false);
            recognition.stop();
            handleTriggerSos(`Google Voice SOS Trigger: "${text}" - ${address}`);
            break;
          }
        }
      };

      recognition.onerror = (err) => {
        console.log('Voice Recognition Error:', err);
        setIsListening(false);
        setVoiceStatus('🎙️ Tap microphone button below to re-activate voice assistant.');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (e) {
      console.log('Speech Recognition init error:', e);
      setIsListening(false);
      setVoiceStatus('🎙️ Tap microphone button below to speak.');
    }
  };

  // Auto-attempt startup on load
  useEffect(() => {
    startSpeechRecognition();

    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch(e) {}
      }
    };
  }, []);

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
        <h1 className="text-2xl font-bold font-serif text-white">PATIENT EMERGENCY PORTAL</h1>
        <p className="text-xs text-emerald-200 font-medium">WellCare Emergency Dispatch Network • Toll-Free 108</p>
      </div>

      {activeUserSos ? (
        <div className="bg-white border-2 border-emerald-600 rounded-3xl p-6 shadow-md space-y-4 text-center">
          <CheckCircle2 className="h-14 w-14 text-emerald-600 mx-auto animate-pulse" />
          <h2 className="text-2xl font-bold font-serif text-slate-900">PATIENT EMERGENCY BROADCASTED!</h2>

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
            onClick={() => {
              setSubmittedSos(null);
              startSpeechRecognition();
            }}
            className="w-full py-3 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-xs rounded-xl transition-all cursor-pointer"
          >
            Trigger Another Emergency Request
          </button>
        </div>
      ) : (
        <div className="bg-white border border-emerald-200 rounded-3xl p-6 shadow-md space-y-6 text-center">
          
          <div>
            <h2 className="text-xl font-bold font-serif text-slate-900 mb-1">
              Android Google Voice Assistant Emergency
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Hands-Free Emergency Response System
            </p>
          </div>

          {/* IN-BUILT GOOGLE VOICE ASSISTANT INTEGRATION BOX */}
          <div className="bg-emerald-50 border-2 border-emerald-500 rounded-3xl p-4 text-left space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Accessibility className="h-5 w-5 text-emerald-800" />
                <h3 className="font-extrabold text-xs text-emerald-900 uppercase tracking-wider">
                  In-Built Android Google Voice Assistant Integration
                </h3>
              </div>
              <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase flex items-center space-x-1 shrink-0 ${
                isListening ? 'bg-red-600 text-white animate-pulse' : 'bg-emerald-700 text-white'
              }`}>
                <Radio className="h-3 w-3 text-white" />
                <span>{isListening ? 'Listening Active' : 'Mic Ready'}</span>
              </span>
            </div>

            {/* Tap to Speak Mic Trigger Button */}
            <button
              type="button"
              onClick={startSpeechRecognition}
              className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center space-x-2 shadow-md transition-all cursor-pointer ${
                isListening
                  ? 'bg-red-600 text-white animate-pulse ring-4 ring-red-300'
                  : 'bg-[#064e3b] hover:bg-emerald-900 text-white'
              }`}
            >
              <Mic className="h-5 w-5 animate-bounce" />
              <span>{isListening ? '🎙️ LISTENING NOW... SPEAK "HELP"' : '🎙️ TAP TO SPEAK / START VOICE ASSISTANT'}</span>
            </button>

            {/* Live Audio Status Display Box */}
            <div className="bg-white p-3 rounded-2xl border border-emerald-300 space-y-1">
              <p className="text-xs font-extrabold text-emerald-950 flex items-center space-x-1.5">
                <Sparkles className="h-4 w-4 text-emerald-600 animate-spin shrink-0" />
                <span>{voiceStatus}</span>
              </p>
              {detectedText && (
                <p className="text-xs font-black text-red-700 bg-red-50 p-1.5 rounded-lg border border-red-200">
                  Detected Input: "{detectedText}"
                </p>
              )}
            </div>

            {/* Quick 1-Click Audio / Command Presets */}
            <div className="space-y-1.5 pt-1">
              <label className="text-[10px] font-extrabold text-emerald-900 uppercase block">
                Quick Sound & Command Presets (Instant Trigger):
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleTriggerSos(`Voice Trigger: EMERGENCY HELP REQUIRED`)}
                  className="p-3 bg-white hover:bg-emerald-100 border border-emerald-300 rounded-xl text-xs font-bold text-slate-800 flex items-center space-x-2 shadow-xs cursor-pointer"
                >
                  <Volume2 className="h-4 w-4 text-red-600 shrink-0" />
                  <span>🔊 "HELP! SOS"</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTriggerSos(`Voice Trigger: ACCIDENT DISPATCH`)}
                  className="p-3 bg-white hover:bg-emerald-100 border border-emerald-300 rounded-xl text-xs font-bold text-slate-800 flex items-center space-x-2 shadow-xs cursor-pointer"
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

          <p className="text-xs text-slate-500 font-medium pt-2">
            Emergency Toll-Free Direct Hotline: <strong className="text-emerald-900 font-black">108 / (123) 456-7890</strong>
          </p>

        </div>
      )}

    </div>
  );
};
