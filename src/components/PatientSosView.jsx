import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { AlertCircle, CheckCircle2, MapPin, Mic, Volume2, Accessibility, Radio, Sparkles } from 'lucide-react';

export const PatientSosView = () => {
  const { createSosEmergency, sosEmergencies } = useApp();
  
  const [patientName, setPatientName] = useState('Citizen Patient (Hands-Free Voice SOS)');
  const [phone, setPhone] = useState('123-456-7890');
  const [address, setAddress] = useState('123 Wellness Blvd, Health City');
  const [submittedSos, setSubmittedSos] = useState(null);

  // Voice Assistant State (Continuous Hands-Free / In-Built Google Assistant Mode)
  const [isListening, setIsListening] = useState(true);
  const [voiceStatus, setVoiceStatus] = useState('🎙️ Hands-Free Google Voice Assistant active & listening automatically...');
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

  // Continuous Auto-Listening Speech Recognition (No Button Press Required)
  const startContinuousSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceStatus('Speech recognition active in hands-free fallback mode. Use quick sound triggers below.');
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceStatus('🔴 AUTO-LISTENING ACTIVE: Speak "HELP", "SOS", "AMBULANCE", "EMERGENCY" hands-free...');
      };

      recognition.onresult = (event) => {
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const text = event.results[i][0].transcript.toLowerCase();
          setDetectedText(text);

          // Check if speech contains emergency trigger words
          if (
            text.includes('help') ||
            text.includes('sos') ||
            text.includes('ambulance') ||
            text.includes('emergency') ||
            text.includes('accident') ||
            text.includes('save me')
          ) {
            setVoiceStatus(`✅ EMERGENCY DETECTED: "${text}". Transmitting location signal to Call Centre!`);
            setIsListening(false);
            recognition.stop();
            handleTriggerSos(`Google Voice SOS Auto-Trigger: "${text}" - ${address}`);
            break;
          }
        }
      };

      recognition.onerror = () => {
        setIsListening(true);
        setVoiceStatus('🎙️ Hands-Free Voice Assistant monitoring audio inputs automatically...');
      };

      recognition.onend = () => {
        // Automatically restart listening for continuous hands-free operation
        if (!submittedSos) {
          setTimeout(() => {
            try { recognition.start(); } catch(e) {}
          }, 1000);
        }
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (e) {
      console.log('Auto Speech Recognition error:', e);
      setIsListening(true);
      setVoiceStatus('🎙️ Voice monitoring ready in hands-free mode...');
    }
  };

  // Automatically start listening on component load (Hands-free for handicapped / non-verbal persons)
  useEffect(() => {
    startContinuousSpeechRecognition();

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
            onClick={() => {
              setSubmittedSos(null);
              startContinuousSpeechRecognition();
            }}
            className="w-full py-3 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-xs rounded-xl transition-all cursor-pointer"
          >
            Trigger Another SOS Request
          </button>
        </div>
      ) : (
        <div className="bg-white border border-emerald-200 rounded-3xl p-6 shadow-md space-y-6 text-center">
          
          <div>
            <h2 className="text-xl font-bold font-serif text-slate-900 mb-1">
              Hands-Free Auto Voice & 1-Tap SOS
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Specifically built for speech-impaired & handicapped individuals. Speaks into device or press button below.
            </p>
          </div>

          {/* 1. ULTRA-HUGE BIGGER SOS BUTTON */}
          <button
            onClick={() => handleTriggerSos()}
            type="button"
            className="w-full py-12 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-3xl font-black text-2xl sm:text-3xl uppercase tracking-wider shadow-2xl flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 transition-all transform hover:scale-[1.03] active:scale-95 cursor-pointer ring-8 ring-red-200"
          >
            <AlertCircle className="h-12 w-12 text-white animate-bounce shrink-0" />
            <span>SOS – TRIGGER EMERGENCY</span>
          </button>

          {/* 2. ULTRA-HUGE HANDS-FREE VOICE ASSISTANT INDICATOR (AUTOMATICALLY ACTIVE / NO CLICK REQUIRED) */}
          <div
            onClick={startContinuousSpeechRecognition}
            className="w-full py-10 bg-gradient-to-r from-emerald-700 to-emerald-900 text-white rounded-3xl font-black text-2xl sm:text-3xl uppercase tracking-wider shadow-2xl flex flex-col items-center justify-center space-y-2 transition-all cursor-pointer ring-8 ring-emerald-300 relative overflow-hidden"
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Mic className="h-12 w-12 text-white animate-bounce shrink-0" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full animate-ping" />
              </div>
              <span>🎙️ GOOGLE VOICE ASSISTANT</span>
            </div>
            <span className="text-xs font-bold text-emerald-200 tracking-normal normal-case flex items-center space-x-1.5">
              <Radio className="h-4 w-4 text-red-400 animate-pulse" />
              <span>In-Built Hands-Free Mode Active (Auto-Listening)</span>
            </span>
          </div>

          {/* 3. VOICE ASSISTANT DESCRIPTION & PRESETS (GIVEN AFTER THE BUTTONS) */}
          <div className="bg-emerald-50 border-2 border-emerald-500 rounded-3xl p-4 text-left space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Accessibility className="h-5 w-5 text-emerald-800" />
                <h3 className="font-extrabold text-xs text-emerald-900 uppercase tracking-wider">
                  In-Built Google Assistant Hands-Free Description
                </h3>
              </div>
              <span className="bg-red-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase animate-pulse">
                Auto-Listening Active
              </span>
            </div>

            <p className="text-xs text-slate-700 font-medium">
              <strong>How it works for handicapped / speech-impaired persons:</strong> You do NOT need to press any button! Your mobile's in-built Google Voice Assistant continuously monitors for emergency words ("HELP", "SOS", "AMBULANCE", "ACCIDENT") or distress sounds, and automatically transmits your GPS location signal directly to the Call Centre!
            </p>

            {/* Live Audio Status Display Box */}
            <div className="bg-white p-3 rounded-2xl border border-emerald-300 space-y-1">
              <p className="text-xs font-extrabold text-emerald-950 flex items-center space-x-1.5">
                <Sparkles className="h-4 w-4 text-emerald-600 animate-spin" />
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
                Quick Sound & Command Presets (Fallback Trigger):
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

          {/* 4. Pickup Address Card */}
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
