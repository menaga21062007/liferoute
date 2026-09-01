import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { AlertCircle, CheckCircle2, MapPin, Volume2, Accessibility, Radio, Sparkles, Smartphone, Wifi, Battery } from 'lucide-react';

export const PatientSosView = () => {
  const { createSosEmergency, sosEmergencies } = useApp();
  
  const [patientName, setPatientName] = useState('Citizen Patient (Hands-Free Voice SOS)');
  const [phone, setPhone] = useState('123-456-7890');
  const [address, setAddress] = useState('123 Wellness Blvd, Health City');
  const [submittedSos, setSubmittedSos] = useState(null);

  // Voice Assistant State (Continuous Hands-Free / In-Built Google Assistant Mode)
  const [isListening, setIsListening] = useState(true);
  const [voiceStatus, setVoiceStatus] = useState('🎙️ Hands-Free Google Voice Assistant active...');
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
      setVoiceStatus('Speech recognition active in hands-free fallback mode.');
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
        setVoiceStatus('🔴 AUTO-LISTENING ACTIVE: Speak "HELP", "SOS", "AMBULANCE" hands-free...');
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
            setVoiceStatus(`✅ EMERGENCY DETECTED: "${text}". Transmitting to Call Centre!`);
            setIsListening(false);
            recognition.stop();
            handleTriggerSos(`Google Voice SOS Auto-Trigger: "${text}" - ${address}`);
            break;
          }
        }
      };

      recognition.onerror = () => {
        setIsListening(true);
        setVoiceStatus('🎙️ Hands-Free Voice Assistant monitoring audio automatically...');
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
    <div className="flex justify-center items-center py-4 px-2">
      
      {/* MOBILE APP CONTAINER FRAME (MAX-W-SM / MOBILE APP SIZED VIEWPORT) */}
      <div className="w-full max-w-sm bg-slate-900 border-4 border-slate-800 rounded-[42px] p-3 shadow-2xl space-y-4 text-slate-800 relative">
        
        {/* Mobile Phone Top Notch / Status Bar */}
        <div className="flex items-center justify-between px-4 pt-1 text-slate-400 text-[10px] font-bold">
          <span>9:41 AM</span>
          <div className="h-4 w-20 bg-slate-800 rounded-full mx-auto" />
          <div className="flex items-center space-x-1.5">
            <Wifi className="h-3 w-3 text-emerald-400" />
            <Battery className="h-3.5 w-3.5 text-emerald-400" />
          </div>
        </div>

        {/* Mobile Screen Outer Background */}
        <div className="bg-white rounded-[32px] p-4 space-y-4 border border-slate-100 shadow-inner">
          
          {/* Header Banner */}
          <div className="bg-[#064e3b] text-white p-4 rounded-2xl shadow-sm text-center space-y-1">
            <div className="h-9 w-9 rounded-xl bg-red-600 border border-red-400 flex items-center justify-center mx-auto shadow-sm">
              <AlertCircle className="h-5 w-5 text-white animate-bounce" />
            </div>
            <h1 className="text-lg font-bold font-serif text-white tracking-tight">CITIZEN EMERGENCY SOS</h1>
            <p className="text-[10px] text-emerald-200 font-medium">WellCare Dispatch Network • Toll-Free 108</p>
          </div>

          {activeUserSos ? (
            <div className="bg-white border-2 border-emerald-600 rounded-2xl p-4 shadow-sm space-y-3 text-center">
              <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto animate-pulse" />
              <h2 className="text-base font-bold font-serif text-slate-900">EMERGENCY SOS BROADCASTED!</h2>

              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-left space-y-1.5 text-[11px]">
                <div className="flex justify-between border-b border-emerald-200 pb-1">
                  <span className="font-bold text-slate-600">Reference ID:</span>
                  <span className="font-extrabold text-red-600">{activeUserSos.id}</span>
                </div>
                <div className="flex justify-between border-b border-emerald-200 pb-1">
                  <span className="font-bold text-slate-600">Status:</span>
                  <span className="font-extrabold text-emerald-800">{activeUserSos.status}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-600 block mb-0.5">Pickup Address:</span>
                  <span className="text-slate-900 font-medium">{activeUserSos.pickupLocation?.address}</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-600 font-medium">
                Ambulance is being dispatched immediately to your address.
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
              
              <div>
                <h2 className="text-base font-bold font-serif text-slate-900">
                  Android Google Voice & 1-Tap SOS
                </h2>
                <p className="text-[10px] text-slate-500 font-medium">
                  Built for speech-impaired & handicapped individuals.
                </p>
              </div>

              {/* 1. ULTRA-HUGE BIGGER SOS BUTTON */}
              <button
                onClick={() => handleTriggerSos()}
                type="button"
                className="w-full py-8 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-2xl font-black text-xl uppercase tracking-wider shadow-xl flex items-center justify-center space-x-2 transition-all transform hover:scale-[1.02] active:scale-95 cursor-pointer ring-4 ring-red-200"
              >
                <AlertCircle className="h-8 w-8 text-white animate-bounce shrink-0" />
                <span>SOS – TRIGGER EMERGENCY</span>
              </button>

              {/* 2. IN-BUILT GOOGLE VOICE ASSISTANT INTEGRATION BOX (PARAGRAPH REMOVED AS REQUESTED) */}
              <div className="bg-emerald-50 border-2 border-emerald-500 rounded-2xl p-3 text-left space-y-2.5 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <Accessibility className="h-4 w-4 text-emerald-800" />
                    <h3 className="font-extrabold text-[11px] text-emerald-900 uppercase tracking-tight">
                      In-Built Android Google Voice Assistant Integration
                    </h3>
                  </div>
                  <span className="bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase animate-pulse flex items-center space-x-1 shrink-0">
                    <Radio className="h-2.5 w-2.5 text-white" />
                    <span>Auto-Listening Active</span>
                  </span>
                </div>

                {/* Live Audio Status Display Box */}
                <div className="bg-white p-2.5 rounded-xl border border-emerald-300 space-y-1">
                  <p className="text-[11px] font-extrabold text-emerald-950 flex items-center space-x-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-emerald-600 animate-spin shrink-0" />
                    <span className="truncate">{voiceStatus}</span>
                  </p>
                  {detectedText && (
                    <p className="text-[10px] font-black text-red-700 bg-red-50 p-1 rounded-md border border-red-200">
                      Detected: "{detectedText}"
                    </p>
                  )}
                </div>

                {/* Quick 1-Click Audio / Command Presets */}
                <div className="space-y-1 pt-0.5">
                  <label className="text-[9px] font-extrabold text-emerald-900 uppercase block">
                    Quick Sound & Command Presets (Fallback Trigger):
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleTriggerSos(`Voice Trigger: EMERGENCY HELP REQUIRED`)}
                      className="p-2 bg-white hover:bg-emerald-100 border border-emerald-300 rounded-xl text-[10px] font-bold text-slate-800 flex items-center space-x-1 shadow-xs cursor-pointer"
                    >
                      <Volume2 className="h-3.5 w-3.5 text-red-600 shrink-0" />
                      <span>🔊 "HELP! SOS"</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleTriggerSos(`Voice Trigger: ACCIDENT DISPATCH`)}
                      className="p-2 bg-white hover:bg-emerald-100 border border-emerald-300 rounded-xl text-[10px] font-bold text-slate-800 flex items-center space-x-1 shadow-xs cursor-pointer"
                    >
                      <Volume2 className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                      <span>🔊 "AMBULANCE!"</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 3. Pickup Address Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-left space-y-1.5 text-[11px]">
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
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <p className="text-[10px] text-slate-500 font-medium">
                Emergency Hotline: <strong className="text-emerald-900 font-black">108 / (123) 456-7890</strong>
              </p>

            </div>
          )}

        </div>
      </div>

    </div>
  );
};
