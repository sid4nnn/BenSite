import backgroundImage from '../../assets/2ndop.png';

export function BackgroundScene() {
  return (
    <div className="background-scene">
      <img className="background-photo" src={backgroundImage} alt="" aria-hidden="true" />
    </div>
  );
}
