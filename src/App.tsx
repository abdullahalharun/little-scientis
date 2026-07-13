import { PhaserGame } from './game/PhaserGame';
import { LoadingScreen } from './components/LoadingScreen';
import { MuteButton } from './components/MuteButton';
import { RotateHint } from './components/RotateHint';

export function App() {
  return (
    <>
      <PhaserGame />
      <MuteButton />
      <LoadingScreen />
      <RotateHint />
    </>
  );
}
