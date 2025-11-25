import { Html } from '@react-three/drei';

interface HealthBarProps {
  current: number;
  max: number;
  position: [number, number, number];
  showText?: boolean;
}

export function HealthBar({ current, max, position, showText = false }: HealthBarProps) {
  const percentage = Math.max(0, Math.min(100, (current / max) * 100));
  const isLow = percentage < 30;

  return (
    <Html position={position} center>
      <div className="bg-gray-800 w-24 h-2 rounded-full overflow-hidden border border-gray-600">
        <div
          className={`h-full transition-all duration-300 ${
            isLow ? 'bg-red-600' : 'bg-red-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showText && (
        <div className="text-white text-xs text-center mt-1">
          {Math.ceil(current)} / {max}
        </div>
      )}
    </Html>
  );
}

