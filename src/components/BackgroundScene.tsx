import backgroundAvif1280 from '../../assets/sundownnew.webp';
import backgroundAvif1912 from '../../assets/sundownnew.webp';
import backgroundWebp1280 from '../../assets/sundownnew.webp';
import backgroundWebp1912 from '../../assets/sundownnew.webp';

type BackgroundSceneProps = {
  onReady?: () => void;
};

export function BackgroundScene({ onReady }: BackgroundSceneProps) {
  return (
    <div className="background-scene">
      <picture>
        <source
          type="image/avif"
          srcSet={`${backgroundAvif1280} 1280w, ${backgroundAvif1912} 1912w`}
          sizes="100vw"
        />
        <source
          type="image/webp"
          srcSet={`${backgroundWebp1280} 1280w, ${backgroundWebp1912} 1912w`}
          sizes="100vw"
        />
        <img
          className="background-photo"
          src={backgroundWebp1912}
          srcSet={`${backgroundWebp1280} 1280w, ${backgroundWebp1912} 1912w`}
          sizes="100vw"
          alt=""
          aria-hidden="true"
          loading="eager"
          fetchPriority="high"
          onLoad={onReady}
          onError={onReady}
        />
      </picture>
    </div>
  );
}
