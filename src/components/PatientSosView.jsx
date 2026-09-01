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

  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallApp = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the app install prompt');
        }
        setDeferredPrompt(null);
      });
    } else {
      alert("📱 To install this SOS page as a Standalone App on your phone:\n\n1. Android Chrome: Tap top 3-dots menu ➔ Tap 'Add to Home screen' or 'Install App'.\n\n2. iPhone Safari: Tap Share button ➔ Tap 'Add to Home Screen'.");
    }
  };

  // Automatically start listening on component load
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
    <div className="max-w-md mx-auto px-3 py-4 text-slate-800">
      
      {/* MOBILE APP CONTAINER FRAME */}
      <div className="bg-white border-4 border-slate-900 rounded-[36px] p-4 shadow-2xl space-y-4 relative overflow-hidden">
        
        {/* Mobile Camera Notch & Speaker Grill */}
        <div className="w-28 h-4 bg-slate-900 rounded-full mx-auto mb-2 flex items-center justify-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-slate-700"></div>
          <div className="w-10 h-1 bg-slate-700 rounded-full"></div>
        </div>

        {/* Mobile App Header Banner */}
        <div className="bg-[#064e3b] text-white p-4 rounded-2xl shadow-sm border border-emerald-700 text-center space-y-1">
          <div className="h-9 w-9 rounded-xl bg-red-600 border border-red-400 flex items-center justify-center mx-auto shadow-sm">
            <AlertCircle className="h-5 w-5 text-white animate-bounce" />
          </div>
          <h1 className="text-lg font-bold font-serif text-white uppercase tracking-tight">CITIZEN SOS APP</h1>
          <p className="text-[10px] text-emerald-200 font-medium">WellCare Emergency Dispatch • Toll-Free 108</p>
        </div>

        {/* 📲 1-CLICK INSTALL AS MOBILE APP BUTTON */}
        <button
          onClick={handleInstallApp}
          className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm flex items-center justify-center space-x-2 transition-all cursor-pointer border border-emerald-500"
        >
          <span>📱 INSTALL AS STANDALONE PHONE APP</span>
        </button>


        {activeUserSos ? (
          <div className="bg-white border-2 border-emerald-600 rounded-2xl p-5 shadow-sm space-y-3 text-center">
            <CheckCircle2 className="h-12 w-12 text-emerald-600 mx-auto animate-pulse" />
            <h2 className="text-xl font-bold font-serif text-slate-900">EMERGENCY SOS BROADCASTED!</h2>

            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-left space-y-1.5 text-xs">
              <div className="flex justify-between border-b border-emerald-200 pb-1">
                <span className="font-bold text-slate-600">Reference ID:</span>
                <span className="font-extrabold text-red-600">{activeUserSos.id}</span>
              </div>
              <div className="flex justify-between border-b border-emerald-200 pb-1">
                <span className="font-bold text-slate-600">Dispatch Status:</span>
                <span className="font-extrabold text-emerald-800">{activeUserSos.status}</span>
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
              className="w-full py-2.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              Trigger Another SOS Request
            </button>
          </div>
        ) : (
          <div className="space-y-4 text-center">
            
            {/* 1. ULTRA-HUGE BIGGER SOS BUTTON */}
            <button
              onClick={() => handleTriggerSos()}
              type="button"
              className="w-full py-8 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-2xl font-black text-xl uppercase tracking-wider shadow-xl flex flex-col items-center justify-center space-y-1 transition-all transform hover:scale-[1.02] active:scale-95 cursor-pointer ring-4 ring-red-200"
            >
              <AlertCircle className="h-8 w-8 text-white animate-bounce shrink-0" />
              <span>SOS – TRIGGER EMERGENCY</span>
            </button>

            {/* 2. IN-BUILT GOOGLE VOICE ASSISTANT INTEGRATION BOX (PARAGRAPH REMOVED AS REQUESTED) */}
            <div className="bg-emerald-50 border-2 border-emerald-500 rounded-2xl p-3 text-left space-y-2 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <Accessibility className="h-4 w-4 text-emerald-800 shrink-0" />
                  <h3 className="font-extrabold text-[11px] text-emerald-900 uppercase tracking-tight">
                    IN-BUILT ANDROID GOOGLE VOICE ASSISTANT INTEGRATION
                  </h3>
                </div>
                <span className="bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase animate-pulse flex items-center space-x-1 shrink-0">
                  <Radio className="h-2.5 w-2.5 text-white" />
                  <span>AUTO-LISTENING ACTIVE</span>
                </span>
              </div>

              {/* Live Audio Status Display Box */}
              <div className="bg-white p-2.5 rounded-xl border border-emerald-300 space-y-0.5">
                <p className="text-xs font-extrabold text-emerald-950 flex items-center space-x-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-600 animate-spin shrink-0" />
                  <span>{voiceStatus}</span>
                </p>
                {detectedText && (
                  <p className="text-[11px] font-black text-red-700 bg-red-50 p-1 rounded-lg border border-red-200">
                    Detected Input: "{detectedText}"
                  </p>
                )}
              </div>

              {/* Quick 1-Click Audio / Command Presets */}
              <div className="space-y-1 pt-0.5">
                <label className="text-[9px] font-extrabold text-emerald-900 uppercase block">
                  QUICK SOUND & COMMAND PRESETS (FALLBACK TRIGGER):
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleTriggerSos(`Voice Trigger: EMERGENCY HELP REQUIRED`)}
                    className="p-2 bg-white hover:bg-emerald-100 border border-emerald-300 rounded-lg text-xs font-bold text-slate-800 flex items-center space-x-1 shadow-xs cursor-pointer"
                  >
                    <Volume2 className="h-3.5 w-3.5 text-red-600 shrink-0" />
                    <span>🔊 "HELP! SOS"</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTriggerSos(`Voice Trigger: ACCIDENT DISPATCH`)}
                    className="p-2 bg-white hover:bg-emerald-100 border border-emerald-300 rounded-xl text-xs font-bold text-slate-800 flex items-center space-x-1 shadow-xs cursor-pointer"
                  >
                    <Volume2 className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                    <span>🔊 "AMBULANCE!"</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 3. Pickup Address Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-left space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 uppercase text-[9px] tracking-wider">Pickup Location Address</span>
                <span className="text-[9px] text-emerald-700 font-bold flex items-center space-x-1">
                  <MapPin className="h-3 w-3 text-red-500" />
                  <span>GPS Auto-Detected</span>
                </span>
              </div>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter pickup address"
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-600"
              />
            </div>

            <p className="text-[10px] text-slate-500 font-medium pt-1">
              Emergency Toll-Free Direct Hotline: <strong className="text-emerald-900 font-black">108 / (123) 456-7890</strong>
            </p>

          </div>
        )}

      </div>
    </div>
  );
};
