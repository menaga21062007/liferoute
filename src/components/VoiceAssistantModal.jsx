import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mic, MicOff, X, Volume2, Sparkles, ArrowRight } from 'lucide-react';

export const VoiceAssistantModal = () => {
  const { isVoiceModalOpen, setIsVoiceModalOpen, dispatchNextRequest, requestResourceTransfer, setTrafficSignals } = useApp();
  const [isListening, setIsListening] = useState(true);
  const [transcript, setTranscript] = useState('');
  const [statusMessage, setStatusMessage] = useState('Listening for voice commands...');

  if (!isVoiceModalOpen) return null;

  const handleVoiceCommand = (commandText) => {
    setTranscript(commandText);
    setIsListening(false);
    setStatusMessage('Processing command via AI voice engine...');

    setTimeout(() => {
      const lower = commandText.toLowerCase();

      if (lower.includes('dispatch') || lower.includes('sector')) {
        dispatchNextRequest();
        setStatusMessage('✅ Command Executed: Dispatched closest unit to critical emergency.');
      } else if (lower.includes('corridor') || lower.includes('ts-01')) {
        setTrafficSignals(prev => prev.map(s => s.code === 'TS-01' ? { ...s, status: 'GREEN', mode: 'GREEN_CORRIDOR_ACTIVE', countdownSeconds: 45 } : s));
        setStatusMessage('✅ Command Executed: Green Corridor forced active for TS-01.');
      } else if (lower.includes('ventilator') || lower.includes('marketplace')) {
        requestResourceTransfer('res-1', 'Midtown Emergency Center', 1);
        setStatusMessage('✅ Command Executed: Requested 1x Ventilator from Hospital Marketplace.');
      } else {
        setStatusMessage('✅ Command Processing Complete.');
      }

      setTimeout(() => {
        setIsListening(true);
      }, 2500);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 text-white shadow-2xl relative">
        <button
          onClick={() => setIsVoiceModalOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-brand-blue to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Sparkles className="h-5 w-5 text-white animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white">Voice Command Assistant</h3>
            <p className="text-xs text-slate-400">Hands-free emergency voice dispatch & control</p>
          </div>
        </div>

        {/* Microphone Visualizer */}
        <div className="flex flex-col items-center justify-center my-6 py-6 bg-slate-950/60 rounded-xl border border-slate-800/80">
          <button
            onClick={() => setIsListening(!isListening)}
            className={`h-20 w-20 rounded-full flex items-center justify-center transition-all duration-300 relative ${
              isListening
                ? 'bg-gradient-to-tr from-brand-red to-rose-500 text-white shadow-lg shadow-brand-red/40 ring-8 ring-rose-500/20 scale-105'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {isListening ? (
              <>
                <Mic className="h-9 w-9 animate-bounce" />
                <span className="absolute inset-0 rounded-full border-2 border-white/40 animate-ping" />
              </>
            ) : (
              <MicOff className="h-9 w-9" />
            )}
          </button>
          
          <div className="mt-4 text-center">
            <span className="text-xs font-semibold text-slate-300 block">{statusMessage}</span>
            {transcript && (
              <p className="text-sm font-bold text-brand-lightBlue mt-1 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800 inline-block">
                "{transcript}"
              </p>
            )}
          </div>
        </div>

        {/* Quick Voice Presets */}
        <div className="space-y-2">
          <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Click a sample voice command to execute:
          </label>

          {[
            "Dispatch closest unit to sector 3 STEMI request",
            "Activate Green Corridor on TS-01 intersection",
            "Request 1x Ventilator from Resource Marketplace",
            "Reserve ICU Bed at Velammal Global Hospital"
          ].map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleVoiceCommand(preset)}
              className="w-full text-left flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/60 text-xs text-slate-300 hover:text-white transition-all group"
            >
              <div className="flex items-center space-x-2">
                <Volume2 className="h-3.5 w-3.5 text-brand-blue group-hover:text-cyan-400" />
                <span>"{preset}"</span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:translate-x-1 transition-transform" />
            </button>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>Supported Languages: EN, ES, FR, HI</span>
          <button
            onClick={() => setIsVoiceModalOpen(false)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
