import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Clock } from "lucide-react";

interface EventCountdownProps {
  eventDate: Date;
  eventEndTime: Date;
  onEventEnded?: () => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

export function EventCountdown({ eventDate, eventEndTime, onEventEnded }: EventCountdownProps) {
  const [, setLocation] = useLocation();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());
  const [hasEnded, setHasEnded] = useState(false);

  function calculateTimeLeft(): TimeLeft {
    const now = new Date().getTime();
    const eventTime = new Date(eventDate).getTime();
    const difference = eventTime - now;

    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        total: difference,
      };
    }

    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      total: 0,
    };
  }

  function checkIfEventEnded() {
    const now = new Date().getTime();
    const endTime = new Date(eventEndTime).getTime();
    return now >= endTime;
  }

  useEffect(() => {
    // Check if event has already ended
    if (checkIfEventEnded() && !hasEnded) {
      setHasEnded(true);
      if (onEventEnded) {
        onEventEnded();
      }
      // Redirect to /participe after 3 seconds
      setTimeout(() => {
        setLocation("/participe");
      }, 3000);
      return;
    }

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      // Check if countdown reached zero and event has ended
      if (newTimeLeft.total <= 0 && checkIfEventEnded() && !hasEnded) {
        setHasEnded(true);
        if (onEventEnded) {
          onEventEnded();
        }
        // Redirect to /participe after 3 seconds
        setTimeout(() => {
          setLocation("/participe");
        }, 3000);
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [eventDate, eventEndTime, hasEnded, onEventEnded, setLocation]);

  if (hasEnded) {
    return (
      <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6 text-center">
        <Clock className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
        <h3 className="text-xl font-bold text-yellow-800 mb-2">
          Este evento já aconteceu
        </h3>
        <p className="text-yellow-700">
          Redirecionando você para conhecer o Gente Networking...
        </p>
      </div>
    );
  }

  if (timeLeft.total <= 0) {
    return (
      <div className="bg-green-50 border-2 border-green-400 rounded-lg p-6 text-center">
        <Clock className="w-12 h-12 text-green-600 mx-auto mb-3 animate-pulse" />
        <h3 className="text-xl font-bold text-green-800 mb-2">
          O evento está acontecendo AGORA! 🎉
        </h3>
        <p className="text-green-700">
          Inscreva-se para receber o link de acesso!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-[#1E5A96] to-[#2B7BBF] rounded-xl p-6 text-white">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Clock className="w-6 h-6" />
        <h3 className="text-xl font-bold">Faltam apenas:</h3>
      </div>
      
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
          <div className="text-4xl font-bold mb-1">{timeLeft.days}</div>
          <div className="text-sm uppercase tracking-wide opacity-90">
            {timeLeft.days === 1 ? "Dia" : "Dias"}
          </div>
        </div>
        
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
          <div className="text-4xl font-bold mb-1">{String(timeLeft.hours).padStart(2, "0")}</div>
          <div className="text-sm uppercase tracking-wide opacity-90">Horas</div>
        </div>
        
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
          <div className="text-4xl font-bold mb-1">{String(timeLeft.minutes).padStart(2, "0")}</div>
          <div className="text-sm uppercase tracking-wide opacity-90">Min</div>
        </div>
        
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
          <div className="text-4xl font-bold mb-1">{String(timeLeft.seconds).padStart(2, "0")}</div>
          <div className="text-sm uppercase tracking-wide opacity-90">Seg</div>
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm opacity-90">
          ⚡ Vagas limitadas! Garanta a sua agora!
        </p>
      </div>
    </div>
  );
}
